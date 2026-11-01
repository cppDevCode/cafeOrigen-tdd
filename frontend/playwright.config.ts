import { defineConfig, devices } from '@playwright/test';

try {
  process.loadEnvFile('.env');
} catch {
  // En entornos CI donde no exista .env físico, se usan las variables del sistema
}

const FRONTEND_PORT = process.env.VITE_PORT || '5173';
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${FRONTEND_PORT}`;
const API_URL = process.env.VITE_API_URL || 'http://localhost:3002/api';
const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    viewport: { width: 375, height: 667 },
  },
  projects: [
    {
      name: 'Mobile Chromium (375px)',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm --dir ../backend dev',
      url: `${BACKEND_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: `pnpm dev --port ${FRONTEND_PORT}`,
      url: FRONTEND_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
  ],
});
