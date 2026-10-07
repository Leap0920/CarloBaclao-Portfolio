/**
 * The fragment shader behind the hero planet.
 *
 * A sphere rotating toward the camera moves every point on the disc by a
 * different amount, and no CSS transform can produce that — which is why the
 * interactive planet is a shader and not the SVG.
 *
 * Everything is computed per pixel from the sphere's own coordinates, so there
 * is no texture to download and nothing to cache. The geometry is quantised to a
 * coarse grid on purpose (see BLOCKS in main) so the planet renders as pixels.
 *
 * The whole object is generated in the shader. There is no texture to download
 * and nothing to cache, which is why the resolution can be pushed as far as the
 * GPU allows without the payload changing at all.
 *
 * The structure, in the order it is built:
 *
 *   1. Latitude/longitude from the sphere's surface normal.
 *   2. A domain warp — the field is sampled at a position displaced by another
 *      noise field. This is the single most important line in the file. Without
 *      it the bands are stripes; with it they are weather.
 *   3. Zonal shear: the noise is stretched along longitude and compressed across
 *      latitude, which is what a rotating fluid does.
 *   4. The colour ramp, the cool blue-grey, the polar caps, and the storm.
 *   5. A directional sun, a terminator, limb darkening, and a scattering rim.
 */

export const JUPITER_VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const JUPITER_FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uSpin;
uniform float uTilt;
uniform float uZoom;
uniform vec3  uSun;
uniform float uDetail;
uniform float uStars;

// ------------------------------------------------------------------ noise

float hash21(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

const mat2 M2 = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p, float octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 9; i++) {
    if (float(i) >= octaves) break;
    v += a * vnoise(p);
    p = M2 * p * 2.03;
    a *= 0.5;
  }
  return v;
}

// Ridged noise. The absolute-value fold turns smooth blobs into filaments, which
// is what cloud edges actually look like.
float ridge(vec2 p, float octaves) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 9; i++) {
    if (float(i) >= octaves) break;
    float n = 1.0 - abs(vnoise(p) * 2.0 - 1.0);
    v += a * n * n;
    p = M2 * p * 2.11;
    a *= 0.5;
  }
  return v;
}

// ------------------------------------------------------------------ palette

const vec3 C_DEEP   = vec3(0.208, 0.098, 0.031);
const vec3 C_UMBER  = vec3(0.345, 0.161, 0.051);
const vec3 C_RUSSET = vec3(0.545, 0.243, 0.078);
const vec3 C_OCHRE  = vec3(0.910, 0.639, 0.239);
const vec3 C_CREAM  = vec3(1.000, 0.949, 0.867);
const vec3 C_IVORY  = vec3(1.000, 0.996, 0.976);
const vec3 C_COOL   = vec3(0.451, 0.671, 0.812);
const vec3 C_COOLD  = vec3(0.216, 0.361, 0.463);
const vec3 C_SLATE  = vec3(0.114, 0.169, 0.212);
const vec3 C_SPOT   = vec3(0.784, 0.325, 0.176);

vec3 ramp(float t) {
  vec3 c = C_DEEP;
  c = mix(c, C_UMBER,  smoothstep(0.00, 0.20, t));
  c = mix(c, C_RUSSET, smoothstep(0.16, 0.40, t));
  c = mix(c, C_OCHRE,  smoothstep(0.36, 0.60, t));
  c = mix(c, C_CREAM,  smoothstep(0.56, 0.79, t));
  c = mix(c, C_IVORY,  smoothstep(0.77, 1.00, t));
  return c;
}

float angleDelta(float a, float b) {
  return mod(a - b + 3.14159265, 6.28318531) - 3.14159265;
}

// ------------------------------------------------------------------ the deck

vec3 cloudField(float lat, float lon, float detail) {
  // Zonal flow: stretched far along longitude, compressed across latitude.
  vec2 q = vec2(lon * 1.35, lat * 7.5);

  // Domain warp. This one line is the difference between stripes and weather.
  float warpOct = max(detail - 3.0, 2.0);
  vec2 warp = vec2(
    fbm(q * 0.70 + vec2(11.3, 4.7), warpOct),
    fbm(q * 0.70 + vec2(2.9, 19.1), warpOct)
  ) - 0.5;
  vec2 p = q + warp * 2.6;

  float band  = fbm(vec2(p.x * 0.35, p.y * 0.90), detail);
  float fine  = ridge(vec2(p.x * 1.70, p.y * 3.40), max(detail - 1.0, 2.0));
  float churn = fbm(vec2(p.x * 3.10, p.y * 6.20), max(detail - 2.0, 2.0));

  // The belts: a warped harmonic stack on latitude, so their edges wander the
  // way the real ones do instead of running dead straight.
  float belt = sin(p.y * 1.15 + band * 6.0)
             + 0.55 * sin(p.y * 2.31 + band * 9.0 + 1.3)
             + 0.28 * sin(p.y * 4.70 + band * 12.0 + 2.6);
  belt *= 0.55;

  float t = clamp(belt * 0.5 + 0.5, 0.0, 1.0);
  t = clamp(t + (fine - 0.45) * 0.55 + (churn - 0.5) * 0.18, 0.0, 1.0);

  vec3 col = ramp(t);

  // The cool half of the range, in the turbulent mid latitudes. Jupiter is not
  // one hue, and the blue-grey is what stops it reading as a cartoon.
  float coolMask = smoothstep(0.52, 0.86, churn) * smoothstep(0.18, 0.62, abs(lat));
  col = mix(col, mix(C_COOL, C_COOLD, churn), coolMask * 0.42);

  float polar = smoothstep(0.95, 1.45, abs(lat));
  col = mix(col, C_SLATE, polar * 0.72);

  // The storm. Stamped into the domain rather than painted over it, so the belts
  // bend around it and it sits inside the flow.
  float dlon = angleDelta(lon, 0.6);
  vec2 sp = vec2(dlon * 0.62, (lat + 0.42) * 2.9);
  float sr = length(sp);
  if (sr < 1.0) {
    // Rotate the sample by an angle that grows toward the centre: a spiral.
    float swirl = atan(sp.y, sp.x) + (1.0 - sr) * 3.4;
    vec2 sq = vec2(cos(swirl), sin(swirl)) * sr;
    float inner = fbm(sq * 3.2 + vec2(7.0, 3.0), 4.0);
    float core = smoothstep(1.0, 0.12, sr);
    // The collar has to reach zero *at* sr = 1, where the storm's influence
    // stops. Fading it toward 1 instead leaves a hard elliptical seam, which
    // reads as a texture-mapping bug rather than as weather.
    float collar = smoothstep(0.70, 0.90, sr) * (1.0 - smoothstep(0.90, 1.00, sr));
    col = mix(col, C_UMBER, collar * 0.45);
    col = mix(col, C_SPOT, core * 0.94);
    col = mix(col, C_CREAM, smoothstep(0.55, 0.05, sr) * 0.55);
    col = mix(col, C_RUSSET, core * inner * 0.50);
  }

  return col;
}

// ------------------------------------------------------------------ main

// Virtual pixels down the canvas height. The disc comes out about 100 blocks
// across, which is enough for the bands and the storm to read while still
// looking like a pixel drawing rather than a photograph.
const float BLOCKS = 132.0;

void main() {
  // Quantise the fragment position to a coarse grid before anything else is
  // evaluated, so the disc edge, the bands, the storm and the sky all land on
  // the same pixels. Doing it here rather than by rendering to a small canvas
  // and scaling it up is what keeps the blocks crisp: the browser still rasterises
  // at full resolution, so each block edge falls on an exact pixel boundary
  // instead of being interpolated.
  float block = uRes.y / BLOCKS;
  vec2 px = (floor(gl_FragCoord.xy / block) + 0.5) * block;

  vec2 uv = (px - 0.5 * uRes) / (0.5 * uRes.y);
  uv /= uZoom;

  float r2 = dot(uv, uv);

  vec3 col = vec3(0.0);

  // A soft bloom hugging the limb. Kept low on purpose: at 0.30 it was bright
  // enough to be the whole sky, and the sky it was standing in for measured as
  // a flat wash with a warm halo around the disc.
  col += vec3(0.62, 0.42, 0.16) * exp(-max(r2 - 1.0, 0.0) * 5.0) * 0.13;

  if (r2 >= 1.0) {
    // The sky the planet hangs in, rather than a void. Only the pixels outside
    // the disc pay for this: the disc is opaque, so building a nebula under it
    // would be work thrown away, and in the hero the disc covers most of them.
    //
    // The smoothstep window is deliberately low. fbm sums to a mean near 0.5, so
    // a window starting at 0.40 put almost every pixel at the bottom of the ramp
    // and the whole sky measured ~6/255 — a nebula that existed only in the
    // shader. Starting at 0.20 is what makes it a sky.
    vec2 sky = px / uRes.y;

    // Three scales: the cloud masses, the filaments inside them, and the fine
    // grain. One scale alone is a smooth wash, and a smooth wash reads as a
    // glow rather than as a sky — which is exactly what the first two attempts
    // measured as.
    float mass  = fbm(sky * 2.2 + vec2(3.1, 8.4), 5.0);
    float fila  = ridge(sky * 6.5 - vec2(7.7, 2.2), 4.0);
    float grain = fbm(sky * 15.0 + vec2(1.3, 5.9), 3.0);

    // Dust lanes: the dark half of the same structure. Subtracting where the
    // filaments thin out is what gives the sky depth — without it there is
    // nothing but glow.
    float dust = smoothstep(0.60, 0.28, fila);
    float density = smoothstep(0.16, 0.86, mass * 0.78 + fila * 0.34 + grain * 0.12);

    // Violet and deep blue carry it; the warm tone is an accent on the brightest
    // ridges only. Weighted the other way it stops being a galaxy and becomes a
    // brown haze, which is what it measured as before this.
    vec3 nebula = mix(vec3(0.30, 0.16, 0.55), vec3(0.06, 0.19, 0.46), grain);
    nebula += vec3(0.40, 0.24, 0.70) * pow(mass, 1.6) * 0.85;
    nebula += vec3(0.12, 0.34, 0.62) * pow(fila, 2.0) * 0.80;
    // Amber, but only where the masses are at their peak and only at half
    // strength: at 0.90 across everything above 0.78 it out-summed the violet
    // and every sky pixel measured warm.
    nebula += vec3(1.00, 0.62, 0.22) * pow(max(mass - 0.86, 0.0) * 7.14, 2.0) * 0.55;

    // A galactic band, so the stars have a structure to belong to rather than
    // being scattered evenly, which reads as noise.
    float band = exp(-pow((sky.y - sky.x * 0.42 - 0.30) * 2.6, 2.0));
    nebula += vec3(0.46, 0.42, 0.70) * band * 0.34;

    col += nebula * density * 1.30 * uStars * (1.0 - dust * 0.55);

    // Stars. One whole block each: a soft dot inside a cell would be the one
    // smooth thing left on the canvas, and it reads as a smudge next to the
    // planet's hard pixels. Brightness varies per star so the field is not flat.
    vec2 gcell = floor(gl_FragCoord.xy / block);
    float gp = hash21(gcell + 7.0);
    float gb = hash21(gcell + 11.0);
    col += vec3(0.92, 0.94, 1.00) * step(0.99400, gp) * (0.35 + gb * 0.65)
         * (1.0 + band * 1.5) * 2.2 * uStars;
  } else {
    float z = sqrt(max(1.0 - r2, 0.0));
    vec3 N = vec3(uv, z);

    // Tilt the planet's axis, not the camera. The sun stays where it is in view
    // space, so tilting genuinely changes which latitudes are lit — which is
    // what makes it read as a body in space rather than a spinning decal.
    float ct = cos(uTilt);
    float st = sin(uTilt);
    vec3 P = vec3(N.x, N.y * ct - N.z * st, N.y * st + N.z * ct);

    float lat = asin(clamp(P.y, -1.0, 1.0));
    float lon = atan(P.x, P.z) + uSpin;

    vec3 base = cloudField(lat, lon, uDetail);

    vec3 L = normalize(uSun);
    float ndl = max(dot(N, L), 0.0);
    float diff = pow(ndl, 0.75);

    // Limb darkening: the disc rolls off toward every edge, not only the one
    // facing away from the sun.
    float limb = mix(0.50, 1.0, pow(z, 0.42));

    vec3 lit = base * (0.045 + 0.955 * diff) * limb;

    // Scattering through the atmosphere at the lit edge.
    float rim = pow(1.0 - z, 3.2) * smoothstep(0.0, 0.55, ndl);
    lit += vec3(1.00, 0.80, 0.52) * rim * 0.75;

    // A little ambient on the night side, so it is not a hole cut in the frame.
    lit += base * 0.035 * (1.0 - diff);

    col = lit;
  }

  // A gentle shoulder so the brightest filaments keep their detail instead of
  // clipping to flat white.
  col *= 1.0 - 0.12 * col;

  // One 8-bit dither step of noise. Smooth gradients across a nine-megapixel
  // disc band visibly without it.
  // Keyed to the block grid, not to gl_FragCoord. A per-pixel dither is invisible
  // on a smooth gradient, but it is the one thing that survives quantisation —
  // it broke every block back down into 1 px speckle, which is exactly what the
  // pixel grid is meant to avoid.
  col += (hash21(px * 1.37) - 0.5) * (1.0 / 255.0);

  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`;
