import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from './test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';

/**
 * Custom test fixture that:
 * 1. Assigns each parallel worker its own account (round-robin)
 * 2. Loads the saved auth session (from auth.setup.ts)
 * 3. Handles age gate if it somehow reappears
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures/base-test';
 */

type AccountFixture = {
  accountIndex: number;
  account: { email: string; password: string };
};

export const test = base.extend<AccountFixture>({
  // Assign account based on worker index (round-robin if workers > accounts)
  accountIndex: async ({}, use, testInfo) => {
    const index = testInfo.parallelIndex % TEST_ACCOUNTS.length;
    await use(index);
  },

  account: async ({ accountIndex }, use) => {
    await use(TEST_ACCOUNTS[accountIndex]);
  },

  // Override the default storageState to load per-account auth
  storageState: async ({ accountIndex }, use) => {
    await use(`./auth-states/account-${accountIndex}.json`);
  },

  // Wrap page to handle age gate if it reappears
  page: async ({ page }, use) => {
    const origGoto = page.goto.bind(page);
    page.goto = async (url, options?) => {
      const response = await origGoto(url, options);
      const ageGate = new AgeGatePage(page);
      await ageGate.confirmAge();
      return response;
    };
    await use(page);
  },
});

export { expect };
