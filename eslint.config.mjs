import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "playwright-report/**",
      "test-results/**",
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  /**
   * `next/core-web-vitals` já registra o eslint-plugin-jsx-a11y — registrar de
   * novo dá "Cannot redefine plugin". Aqui só apertamos as regras que o piso
   * de acessibilidade do briefing § 9 exige e que o preset deixa frouxas.
   *
   * O jsx-a11y pega no lint o que o axe-core só pegaria no e2e, que é tarde.
   */
  {
    rules: {
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/media-has-caption": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/control-has-associated-label": "warn",

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  prettier,
];

export default eslintConfig;
