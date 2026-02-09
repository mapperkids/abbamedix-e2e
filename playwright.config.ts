import { defineConfig, devices } from '@playwright/test';
import { TEST_ACCOUNTS, SITE } from './tests/fixtures/test-data';
import dotenv from 'dotenv';

dotenv.config();

// BrowserStack CDP endpoint
const BS_USER = process.env.BROWSERSTACK_USERNAME || '';
const BS_KEY = process.env.BROWSERSTACK_ACCESS_KEY || '';

const bsCaps = {
  'browser': 'chrome',
  'browser_version': 'latest',
  'os': 'Windows',
  'os_version': '11',
  'browserstack.username': BS_USER,
  'browserstack.accessKey': BS_KEY,
  'project': 'Abba Medix E2E',
  'build': `Public Browse ${new Date().toISOString().slice(0, 16)}`,
  'name': 'Public Browsing Session',
  'browserstack.debug': true,
  'browserstack.networkLogs': true,
  'browserstack.console': 'verbose',
  'browserstack.video': true,
};

const bsEndpoint = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(bsCaps))}`;

export default defineConfig({
  testDir: './tests',
  timeout: 180_000,  // 3 min per test (user journeys take longer)
  retries: 1,
  fullyParallel: true,

  // Default workers — overridden per-project command if needed
  workers: TEST_ACCOUNTS.length,

  use: {
    baseURL: SITE.baseURL,

    // Real Chrome user-agent — Cloudflare Enterprise blocks HeadlessChrome
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',

    // Video recording for every test
    video: 'on',

    // Screenshots on every test
    screenshot: 'on',

    // Full trace on failures (network, DOM, console logs)
    trace: 'retain-on-failure',

    // Timeouts for WooCommerce AJAX-heavy pages
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // ─── PUBLIC tests (local browser) ───
    {
      name: 'public',
      testMatch: /tests\/public\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },

    // ─── PUBLIC tests on BROWSERSTACK (cloud browsers) ───
    {
      name: 'browserstack',
      testMatch: /tests\/public\/.*/,
      use: {
        connectOptions: { wsEndpoint: bsEndpoint },
      },
    },

    // ─── ACCOUNT tests (profile & card management) ───
    {
      name: 'account',
      testMatch: /tests\/account\/.*/,
      use: { ...devices['Desktop Chrome'] },
    },

    // ─── AUTH tests (need credentials) ───
    {
      name: 'auth-setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['auth-setup'],
      testIgnore: [/.*\.setup\.ts/, /tests\/public\/.*/],
    },
  ],

  outputDir: './test-results/',

  reporter: [
    ['html', { open: 'never' }],  // HTML report with embedded videos
    ['list'],                       // Console progress output
  ],
});
