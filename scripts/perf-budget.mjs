// perf-budget.mjs — item 22's budget, enforced from real measurements.
//
// The bundle budget (scripts/bundle-budget.mjs) covers bytes; this covers what
// the reader actually experiences. It loads the page through the same CDP Chrome
// the qa probes use, under a 4x CPU throttle and Slow-4G, and checks LCP / CLS /
// TBT against a ratchet.
//
// WHY A RATCHET AND NOT THE LIGHTHOUSE BAR
// The thresholds sit just above today's measured numbers so they fail on
// REGRESSION rather than on day one (the same trap the bundle budget avoids), and
// the gap to the good bar is printed on every run. LCP now MEETS the 2500ms good
// bar, so its ratchet sits close to it; TBT does not (it is hydration cost), so
// its ratchet is deliberately loose and the gap stays visible. Tighten as the
// numbers improve.
//
// It also reports WHEN the reveal gate opened (`revealReady`), because that is
// what the LCP number is made of: every [data-reveal] block is opacity 0 while
// `html.js-reveal` is armed, and the class is only stood down in Reveal's
// useEffect — i.e. after hydration. See BACKLOG item 22.
//
// Requires a Chrome started with --remote-debugging-port. Run Windows-side:
//   $env:CDP='http://127.0.0.1:9247'; node scripts\perf-budget.mjs
import http from 'node:http';

const CDP = process.env.CDP || 'http://127.0.0.1:9247';
const BASE = process.env.BASE || 'http://localhost:3000/';

const BUDGET = {
  // Tightened once the hero's entrance stopped being hydration-gated: LCP went
  // 5512ms -> ~1912ms (median of 3), so this can sit just above the good bar
  // instead of far above the old failure.
  lcp: Number(process.env.BUDGET_LCP_MS || 3000),
  cls: Number(process.env.BUDGET_CLS || 0.1),
  tbt: Number(process.env.BUDGET_TBT_MS || 1600),
};

// Lighthouse mobile "good" bars, printed for context, not enforced.
const GOOD = { lcp: 2500, cls: 0.1, tbt: 200 };

const get = (url) =>
  new Promise((res, rej) => {
    http.get(url, (r) => {
      let d = '';
      r.on('data', (c) => (d += c));
      r.on('end', () => res(d));
    }).on('error', rej);
  });

const OBSERVER = `
window.__perf = { lcp: 0, cls: 0, fcp: 0, longtasks: [], lcpEl: '', revealReadyAt: 0, revealClearedAt: 0, jsRevealAt: 0 };
const safe = (fn) => { try { fn(); } catch (e) {} };
safe(() => new PerformanceObserver((l) => {
  for (const e of l.getEntries()) {
    window.__perf.lcp = e.startTime;
    window.__perf.lcpEl = e.element ? (e.element.tagName + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '')) : (e.url || '');
  }
}).observe({ type: 'largest-contentful-paint', buffered: true }));
safe(() => new PerformanceObserver((l) => {
  for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
}).observe({ type: 'layout-shift', buffered: true }));
safe(() => new PerformanceObserver((l) => {
  for (const e of l.getEntries()) window.__perf.longtasks.push(e.duration);
}).observe({ type: 'longtask', buffered: true }));
safe(() => new PerformanceObserver((l) => {
  for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__perf.fcp = e.startTime;
}).observe({ type: 'paint', buffered: true }));
// The gate: when does React report for duty, and when does the class come off?
// A plain interval rather than a MutationObserver: this runs at document_start,
// where documentElement can still be null, and observe(null) throws.
safe(() => {
  const check = () => {
    const d = document.documentElement;
    if (!d) return;
    if (!window.__perf.jsRevealAt && d.classList.contains('js-reveal')) window.__perf.jsRevealAt = Math.round(performance.now());
    if (d.dataset.revealReady && !window.__perf.revealReadyAt) window.__perf.revealReadyAt = Math.round(performance.now());
    // Only meaningful once the class HAS been armed: at document_start it is
    // absent, and reading that as "the hatch fired" is simply wrong.
    if (window.__perf.jsRevealAt && !d.classList.contains('js-reveal') && !window.__perf.revealClearedAt) window.__perf.revealClearedAt = Math.round(performance.now());
  };
  setInterval(check, 50);
  check();
});
`;

async function main() {
  let ver;
  try {
    ver = JSON.parse(await get(`${CDP}/json/version`));
  } catch {
    console.error(`CANNOT MEASURE: no Chrome DevTools endpoint at ${CDP}`);
    console.error('Start Chrome with --remote-debugging-port=9247, then re-run.');
    process.exit(2);
  }

  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) }));
    });

  const { targetId } = (await send('Target.createTarget', { url: 'about:blank' })).result;
  const { sessionId } = (await send('Target.attachToTarget', { targetId, flatten: true })).result;

  const js = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sessionId);
    if (r.result?.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    return r.result?.result?.value;
  };

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);
  await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sessionId);
  await send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  }, sessionId);
  await send('Page.addScriptToEvaluateOnNewDocument', { source: OBSERVER }, sessionId);

  const SAMPLES = Number(process.env.PERF_SAMPLES || 3);
  const runs = [];
  console.log(`Measuring ${BASE} (4x CPU throttle, Slow-4G, ${SAMPLES} samples)...`);
  for (let i = 1; i <= SAMPLES; i++) {
    process.stdout.write(`  sample ${i}/${SAMPLES}... `);
    await send('Page.navigate', { url: BASE }, sessionId);
    await new Promise((r) => setTimeout(r, 18000));
    const r = await js(`(() => {
      const p = window.__perf;
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const lt = p.longtasks || [];
      return {
        lcp: Math.round(p.lcp), lcpEl: p.lcpEl, cls: +p.cls.toFixed(4), fcp: Math.round(p.fcp),
        ttfb: Math.round(nav.responseStart || 0),
        loadEvent: Math.round(nav.loadEventEnd || 0),
        tbt: Math.round(lt.reduce((a, b) => a + Math.max(0, b - 50), 0)),
        longTasks: lt.length,
        jsRevealAt: p.jsRevealAt, revealReadyAt: p.revealReadyAt, revealClearedAt: p.revealClearedAt,
      };
    })()`);
    runs.push(r);
    console.log(`LCP ${r.lcp}ms  TBT ${r.tbt}ms`);
  }

  // Median, not mean. This runs on a shared machine where a sibling build or a
  // dev-server recompile lands mid-measurement and roughly doubles TBT; a single
  // outlier must not fail the budget, and the median ignores one by definition.
  const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    const h = s.length >> 1;
    return s.length % 2 ? s[h] : Math.round((s[h - 1] + s[h]) / 2);
  };
  const m = {
    lcpEl: runs[0].lcpEl,
    lcp: median(runs.map((r) => r.lcp)),
    cls: median(runs.map((r) => r.cls)),
    tbt: median(runs.map((r) => r.tbt)),
    fcp: median(runs.map((r) => r.fcp)),
    ttfb: median(runs.map((r) => r.ttfb)),
    longTasks: median(runs.map((r) => r.longTasks)),
    loadEvent: median(runs.map((r) => r.loadEvent)),
    jsRevealAt: median(runs.map((r) => r.jsRevealAt).filter(Boolean)) || 0,
    revealReadyAt: median(runs.map((r) => r.revealReadyAt).filter(Boolean)) || 0,
    revealClearedAt: median(runs.map((r) => r.revealClearedAt).filter(Boolean)) || 0,
  };

  console.log('\n=== MEASURED (median of ' + SAMPLES + ') ===');
  console.log(`  LCP samples: ${runs.map((r) => r.lcp).join(', ')}`);
  console.log(`  TBT samples: ${runs.map((r) => r.tbt).join(', ')}`);
  console.log(`  TTFB   ${m.ttfb} ms        FCP    ${m.fcp} ms`);
  console.log(`  LCP    ${m.lcp} ms   (element: ${m.lcpEl})`);
  console.log(`  CLS    ${m.cls}`);
  console.log(`  TBT    ${m.tbt} ms   (${m.longTasks} long tasks)   load event ${m.loadEvent} ms`);
  console.log('\n  reveal gate:');
  console.log(`    js-reveal armed at   ${m.jsRevealAt} ms`);
  console.log(`    React reported at    ${m.revealReadyAt || '(never)'} ms  <- hydration`);
  console.log(`    escape hatch fired   ${m.revealClearedAt || '(no)'} ms`);

  console.log('\n=== BUDGET ===');
  const checks = [
    ['LCP', m.lcp, BUDGET.lcp, GOOD.lcp, 'ms'],
    ['CLS', m.cls, BUDGET.cls, GOOD.cls, ''],
    ['TBT', m.tbt, BUDGET.tbt, GOOD.tbt, 'ms'],
  ];
  let failed = 0;
  for (const [name, value, limit, good, unit] of checks) {
    const ok = value <= limit;
    if (!ok) failed++;
    const vsGood = value <= good ? 'meets good bar' : `${(value / good).toFixed(1)}x the good bar (${good}${unit})`;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name} ${value}${unit}  budget ${limit}${unit}   ${vsGood}`);
  }

  await send('Target.closeTarget', { targetId });
  ws.close();

  console.log(`\n${failed === 0 ? 'PERF-BUDGET PASS' : `PERF-BUDGET FAIL (${failed} over budget)`}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('ERROR', e.message);
  process.exit(2);
});
