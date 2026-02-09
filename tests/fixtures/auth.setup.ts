import { test as setup } from '@playwright/test';
import { TEST_ACCOUNTS } from './test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { LoginPage } from '../../page-objects/login.page';

/**
 * Auth setup — runs ONCE per account before all tests.
 * Handles the age gate + login, then saves cookies to a file.
 * All tests reuse these saved sessions so they skip age gate + login.
 */
for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
  const account = TEST_ACCOUNTS[i];

  setup(`authenticate account ${i + 1}: ${account.clientId}`, async ({ page }) => {
    // 1. Handle age gate
    await page.goto('/');
    const ageGate = new AgeGatePage(page);
    await ageGate.confirmAge();

    // 2. Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(account.clientId, account.password);
    await loginPage.expectLoggedIn();

    // 3. Save authenticated state (cookies + localStorage)
    await page.context().storageState({ path: `./auth-states/account-${i}.json` });
  });
}
