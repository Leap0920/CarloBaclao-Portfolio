/**
 * The hero field's GLSL. Two programs, both tiny.
 *
 * Two conventions matter here and the CPU side depends on both:
 *
 * 1. Geometry arrives in UNIT space: the sphere has radius 1 and the scatter
 *    lattice spans roughly -1..1 on both axes. `uScale` turns that into world
 *    units and is recomputed every frame from the canvas aspect, so the field
 *    always fits whatever box the layout gives it instead of being sized for
 *    one viewport.
 * 2. `uCopy` is the copy column's rectangle in normalised device coordinates.
 *    Points landing inside it are dimmed almost to nothing. With the field in
 *    its own layout column this should never trigger; it is the guarantee for
 *    the narrow-viewport case where the field does sit behind the text, and
 *    `pw-qa/field-contrast.mjs` measures the real composited pixels to prove
 *    the result either way.
 */

export const FIELD_VERT = /* glsl */ `
  attribute vec3 aScatter;
  attribute float aSeed;

  uniform float uTime;
  uniform float uMorph;
  uniform vec2  uPointer;
  uniform vec4  uCopy;
  uniform float uSize;
  uniform float uProj;
  uniform float uScale;

  varying float vAlpha;

  void main() {
    // Per-particle stagger: the sphere does not dissolve all at once.
    float stagger = smoothstep(
      0.0, 1.0, clamp(uMorph * 1.7 - aSeed * 0.7, 0.0, 1.0)
    );

    // Unit space. Everything below stays in it until the final scale.
    vec3 pos = mix(position, aScatter, stagger);

    // A slow orbit so the field is never perfectly still.
    float t = uTime * 0.25;
    pos.x += sin(t + aSeed * 6.2831) * 0.03;
    pos.y += cos(t * 1.3 + aSeed * 4.1) * 0.03;

    // Pointer repulsion. The pointer arrives in world units, so dividing by
    // uScale puts it in the same space as the geometry.
    vec3 ptr = vec3(uPointer / max(uScale, 0.001), 0.0);
    vec3 away = pos - ptr;
    float d = length(away);
    pos += normalize(away + 1e-4) * (0.28 / (1.0 + d * d * 3.0));

    vec3 world = pos * uScale;
    vec4 mv = modelViewMatrix * vec4(world, 1.0);
    gl_Position = projectionMatrix * mv;

    // Perspective-correct dot size, in device pixels.
    //
    // This used to be a bare 320.0 / -mv.z, which is not a projection of
    // anything: at a camera distance of 6 it drew dots about 200px across, and
    // with additive blending they fused into one solid white disc. uProj is the
    // real scale — viewport height in device pixels over 2*tan(fov/2) — so
    // uSize can be stated in world units and the dots stay a couple of pixels
    // at any viewport size or device pixel ratio. The clamp bounds the sprite
    // for the few particles that pass close to the camera.
    float sizeVar = 0.65 + aSeed * 0.9;
    gl_PointSize = clamp(uSize * sizeVar * uProj / -mv.z, 1.0, 7.0);

    // The copy exclusion zone. A step on both edges of both axes gives 1 only
    // inside the rectangle; min > max therefore reads as "no zone".
    vec2 ndc = gl_Position.xy / gl_Position.w;
    float inCopy =
      step(uCopy.x, ndc.x) * step(ndc.x, uCopy.z) *
      step(uCopy.y, ndc.y) * step(ndc.y, uCopy.w);

    // Depth fade: the far side of the sphere recedes instead of flattening.
    float depth = smoothstep(-8.5, -3.5, mv.z);
    // A particle shell piles up at the silhouette, so the raw projection is a
    // bright ring around a hollow middle. This puts the light back in the
    // centre, which is what makes it read as a lit volume rather than a hoop.
    float core = smoothstep(0.88, 0.1, length(pos.xy));

    // The depth term already ramps the front of the sphere brighter than the
    // back; the per-particle term breaks up the uniformity so the mass reads
    // as a volume rather than as flat grain.
    vAlpha = mix(0.58, 0.05, inCopy) * depth * (0.55 + aSeed * 0.75) * (0.7 + core * 0.9);
  }
`;

export const FIELD_FRAG = /* glsl */ `
  varying float vAlpha;
  // The dot colour, pushed in from the page's own ink token rather than
  // hardcoded. The previous build hardcoded vec3(1.0) because the page was
  // black and every dot was white; on a light page a white dot is invisible,
  // and a literal here would be a second source of truth for the palette.
  uniform vec3 uInk;

  void main() {
    // A round, soft dot. gl_PointCoord runs 0..1 across the sprite.
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * vAlpha;
    gl_FragColor = vec4(uInk, a);
  }
`;
