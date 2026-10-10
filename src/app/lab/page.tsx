'use client';

/**
 * /lab — the React Bits showcase.
 *
 * Every ported component rendered in a labelled tile so the whole library can be
 * seen and compared side by side. Guardrails that apply here too:
 *  - each tile mounts only once it has scrolled into view (IntersectionObserver),
 *    so a page with ~50 canvas effects does not start 50 render loops at once;
 *  - the heavy backgrounds are mutually exclusive: a picker mounts exactly one;
 *  - everything is a dynamic import, so a broken component cannot take the page down.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import './lab.css';

const D = <P,>(loader: () => Promise<{ default: React.ComponentType<P> }>) =>
  dynamic(loader, { ssr: false, loading: () => <span className="lab-loading">loading…</span> });

/* ---------------------------------------------------------------- text */
const TechText = D(() => import('@/components/reactbits/TechText/TechText'));
const Shuffle = D(() => import('@/components/reactbits/Shuffle/Shuffle'));
const BlurText = D(() => import('@/components/reactbits/BlurText/BlurText'));
const SplitText = D(() => import('@/components/reactbits/SplitText/SplitText'));
const GradientText = D(() => import('@/components/reactbits/GradientText/GradientText'));
const ShinyText = D(() => import('@/components/reactbits/ShinyText/ShinyText'));
const GlitchText = D(() => import('@/components/reactbits/GlitchText/GlitchText'));
const DecryptedText = D(() => import('@/components/reactbits/DecryptedText/DecryptedText'));
const ScrambledText = D(() => import('@/components/reactbits/ScrambledText/ScrambledText'));
const RotatingText = D(() => import('@/components/reactbits/RotatingText/RotatingText'));
const CountUp = D(() => import('@/components/reactbits/CountUp/CountUp'));
const TextType = D(() => import('@/components/reactbits/TextType/TextType'));
const ScrollReveal = D(() => import('@/components/reactbits/ScrollReveal/ScrollReveal'));
const ScrollFloat = D(() => import('@/components/reactbits/ScrollFloat/ScrollFloat'));
const TrueFocus = D(() => import('@/components/reactbits/TrueFocus/TrueFocus'));
const FuzzyText = D(() => import('@/components/reactbits/FuzzyText/FuzzyText'));
const FallingText = D(() => import('@/components/reactbits/FallingText/FallingText'));
const CircularText = D(() => import('@/components/reactbits/CircularText/CircularText'));
const CurvedLoop = D(() => import('@/components/reactbits/CurvedLoop/CurvedLoop'));
const ASCIIText = D(() => import('@/components/reactbits/ASCIIText/ASCIIText'));
const LiquidAscii = D(() => import('@/components/reactbits/LiquidAscii/LiquidAscii'));
const CenterFlow = D(() => import('@/components/reactbits/CenterFlow/CenterFlow'));

/* ----------------------------------------------------------- animations */
const LogoLoop = D(() => import('@/components/reactbits/LogoLoop/LogoLoop'));

/* ----------------------------------------------------------- backgrounds */
const Aurora = D(() => import('@/components/reactbits/Aurora/Aurora'));
const Particles = D(() => import('@/components/reactbits/Particles/Particles'));
const Galaxy = D(() => import('@/components/reactbits/Galaxy/Galaxy'));
const Waves = D(() => import('@/components/reactbits/Waves/Waves'));
const DarkVeil = D(() => import('@/components/reactbits/DarkVeil/DarkVeil'));
const Silk = D(() => import('@/components/reactbits/Silk/Silk'));
const Orb = D(() => import('@/components/reactbits/Orb/Orb'));
const Plasma = D(() => import('@/components/reactbits/Plasma/Plasma'));
const Beams = D(() => import('@/components/reactbits/Beams/Beams'));
const DotGrid = D(() => import('@/components/reactbits/DotGrid/DotGrid'));
const Squares = D(() => import('@/components/reactbits/Squares/Squares'));
const Threads = D(() => import('@/components/reactbits/Threads/Threads'));
const Iridescence = D(() => import('@/components/reactbits/Iridescence/Iridescence'));
const Lightning = D(() => import('@/components/reactbits/Lightning/Lightning'));
const Prism = D(() => import('@/components/reactbits/Prism/Prism'));
const GradientBlinds = D(() => import('@/components/reactbits/GradientBlinds/GradientBlinds'));
const LetterGlitch = D(() => import('@/components/reactbits/LetterGlitch/LetterGlitch'));
const LiquidChrome = D(() => import('@/components/reactbits/LiquidChrome/LiquidChrome'));
const PixelBlast = D(() => import('@/components/reactbits/PixelBlast/PixelBlast'));
const RippleGrid = D(() => import('@/components/reactbits/RippleGrid/RippleGrid'));
const Dither = D(() => import('@/components/reactbits/Dither/Dither'));
const FaultyTerminal = D(() => import('@/components/reactbits/FaultyTerminal/FaultyTerminal'));
const ColorBends = D(() => import('@/components/reactbits/ColorBends/ColorBends'));
const LineWaves = D(() => import('@/components/reactbits/LineWaves/LineWaves'));

/* ------------------------------------------------------------ components */
const CardNav = D(() => import('@/components/reactbits/CardNav/CardNav'));

/* --------------------------------------------------------------- helpers */

/** Mounts children only after the tile has been on screen once. */
function Tile({
  title,
  note,
  tall,
  children,
}: {
  title: string;
  note?: string;
  tall?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div className="lab-tile" ref={ref}>
      <div className="lab-head">
        <span className="lab-name">{title}</span>
        {note ? <span className="lab-note">{note}</span> : null}
      </div>
      <div className={`lab-stage${tall ? ' lab-stage-tall' : ''}`}>
        {seen ? children : <span className="lab-loading">scroll into view…</span>}
      </div>
    </div>
  );
}

function Group({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <section className="lab-group">
      <header className="lab-group-head">
        <h2>{title}</h2>
        <p>{sub}</p>
      </header>
      <div className="lab-grid">{children}</div>
    </section>
  );
}

/** One heavy background at a time — a picker rather than 24 live canvases. */
function BackgroundLab() {
  const options: Array<[string, ReactNode]> = [
    ['Aurora', <Aurora key="a" />],
    ['Particles', <Particles key="b" />],
    ['Galaxy', <Galaxy key="c" />],
    ['Waves', <Waves key="d" />],
    ['DarkVeil', <DarkVeil key="e" />],
    ['Silk', <Silk key="f" />],
    ['Orb', <Orb key="g" />],
    ['Plasma', <Plasma key="h" />],
    ['Beams', <Beams key="i" />],
    ['DotGrid', <DotGrid key="j" />],
    ['Squares', <Squares key="k" />],
    ['Threads', <Threads key="l" />],
    ['Iridescence', <Iridescence key="m" />],
    ['Lightning', <Lightning key="n" />],
    ['Prism', <Prism key="o" />],
    ['GradientBlinds', <GradientBlinds key="p" />],
    ['LetterGlitch', <LetterGlitch key="q" />],
    ['LiquidChrome', <LiquidChrome key="r" />],
    ['PixelBlast', <PixelBlast key="s" />],
    ['RippleGrid', <RippleGrid key="t" />],
    ['Dither', <Dither key="u" />],
    ['FaultyTerminal', <FaultyTerminal key="v" />],
    ['ColorBends', <ColorBends key="w" />],
    ['LineWaves', <LineWaves key="x" />],
  ];
  const [i, setI] = useState(0);

  return (
    <section className="lab-group">
      <header className="lab-group-head">
        <h2>Backgrounds</h2>
        <p>One mounted at a time - a live page should never run two WebGL scenes at once.</p>
      </header>
      <div className="lab-picker">
        {options.map(([name], idx) => (
          <button
            key={name}
            type="button"
            onClick={() => setI(idx)}
            className={idx === i ? 'lab-pick lab-pick-on' : 'lab-pick'}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="lab-bgstage">{options[i][1]}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ page */

const SAMPLE = 'Carlo Baclao';
const SENTENCE = 'Full stack developer building calm, fast interfaces';

export default function LabPage() {
  return (
    <main id="main-content" tabIndex={-1} className="lab-root focus:outline-none">
      <header className="lab-hero">
        <h1>React Bits lab</h1>
        <p>
          Every component ported into this site, in one place. Heavy effects mount on scroll and
          only one background runs at a time.
        </p>
      </header>

      <Group title="Text animations" sub="22 components">
        <Tile title="TechText" tall>
          <TechText text="CARLO BACLAO" />
        </Tile>
        <Tile title="Shuffle">
          <Shuffle text="Shuffle heading" tag="span" textAlign="left" />
        </Tile>
        <Tile title="BlurText">
          <BlurText text={SENTENCE} animateBy="words" direction="top" />
        </Tile>
        <Tile title="SplitText">
          <SplitText text="Split text" splitType="chars" textAlign="left" />
        </Tile>
        <Tile title="GradientText">
          <GradientText>Gradient text</GradientText>
        </Tile>
        <Tile title="ShinyText">
          <ShinyText text="Shiny text" speed={2} />
        </Tile>
        <Tile title="GlitchText">
          <GlitchText speed={0.6}>Glitch text</GlitchText>
        </Tile>
        <Tile title="DecryptedText">
          <DecryptedText text="Decrypted text" animateOn="view" />
        </Tile>
        <Tile title="ScrambledText">
          <ScrambledText>Scrambled text</ScrambledText>
        </Tile>
        <Tile title="RotatingText">
          <RotatingText texts={['design', 'build', 'ship', 'repeat']} />
        </Tile>
        <Tile title="CountUp">
          <CountUp to={128} duration={2} />
        </Tile>
        <Tile title="TextType">
          <TextType text="Typed out one character at a time" />
        </Tile>
        <Tile title="ScrollReveal" tall>
          <ScrollReveal>
            <p style={{ fontSize: '1.4rem', lineHeight: 1.5 }}>{SENTENCE}</p>
          </ScrollReveal>
        </Tile>
        <Tile title="ScrollFloat" tall>
          <ScrollFloat>{SENTENCE}</ScrollFloat>
        </Tile>
        <Tile title="TrueFocus">
          <TrueFocus sentence="Focus on one word" />
        </Tile>
        <Tile title="FuzzyText">
          <FuzzyText>Fuzzy</FuzzyText>
        </Tile>
        <Tile title="FallingText" tall>
          <FallingText text="Falling text drops into place" />
        </Tile>
        <Tile title="CircularText">
          <CircularText text="CIRCULAR • TEXT • " />
        </Tile>
        <Tile title="CurvedLoop">
          <CurvedLoop marqueeText="Curved loop of text that keeps moving along an arc" />
        </Tile>
        <Tile title="ASCIIText" tall>
          <ASCIIText text="HELLO" />
        </Tile>
        <Tile title="LiquidAscii" tall>
          <LiquidAscii />
        </Tile>
        <Tile title="CenterFlow" tall>
          <CenterFlow />
        </Tile>
      </Group>

      <Group title="Animations" sub="1 component">
        <Tile title="LogoLoop" tall>
          <LogoLoop
            logos={[
              { node: <span>React</span>, title: 'React' },
              { node: <span>TypeScript</span>, title: 'TypeScript' },
              { node: <span>Next.js</span>, title: 'Next.js' },
              { node: <span>Tailwind</span>, title: 'Tailwind' },
              { node: <span>GSAP</span>, title: 'GSAP' },
              { node: <span>WebGL</span>, title: 'WebGL' },
            ]}
          />
        </Tile>
      </Group>

      <Group title="Components" sub="1 component">
        <Tile title="CardNav" tall>
          <CardNav
            items={[
              {
                label: 'Work',
                bgColor: '#141414',
                textColor: '#FAFAFA',
                links: [{ label: 'Projects', href: '/#projects', ariaLabel: 'Projects' }],
              },
            ]}
          />
        </Tile>
      </Group>

      <BackgroundLab />
    </main>
  );
}
