import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright roda contra o build de produção, não contra o dev server.
 *
 * Não é preciosismo: em desenvolvimento o Next injeta HMR e não aplica as
 * otimizações de fonte e imagem, então medir a11y e captura visual ali mede
 * um site que não existe.
 *
 * Os três breakpoints do briefing § 13 são projetos separados para que uma
 * falha diga em qual largura o layout quebrou.
 */

const PORTA = 3100;
const BASE_URL = `http://127.0.0.1:${PORTA}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e/**/*.spec.ts", "a11y/**/*.spec.ts", "visual/**/*.spec.ts"],

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  expect: {
    // Tolerância de captura visual: baixa o suficiente para pegar regressão
    // de layout, alta o suficiente para não quebrar com antialiasing.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  use: {
    baseURL: BASE_URL,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "mobile-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: {
    command: `pnpm build && pnpm start --port ${PORTA}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: "pipe",
  },
});
