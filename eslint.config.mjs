import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // An `_`-prefixed name is the conventional "intentionally unused"
      // marker (mock signatures, ignored callbacks). Without this a typed
      // `vi.fn((_targets, _from, _to) => ...)` mock reports three warnings.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Isolated build outputs (see next.config.mjs distDir). Without these,
    // ESLint lints ~400 generated files and buries the repo's own findings
    // under ~30k warnings.
    ".next-build/**",
    ".next-prod/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local QA probe scripts, not application code.
    "pw-qa/**",
    // Vendored third-party component libraries. These are ported sources
    // (React Bits plus the Aceternity / Magic UI registry), not first-party
    // code, and linting them buries this repo's own findings under tens of
    // thousands of warnings. Audit them for the documented traps instead
    // (resting `opacity: 0`, per-pointer-move re-renders, raw <img>).
    "src/components/reactbits/**",
    "src/components/registry/**",
  ]),
]);

export default eslintConfig;
