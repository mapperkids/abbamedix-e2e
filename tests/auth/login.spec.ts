import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS } from '../fixtures/test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { LoginPage } from '../../page-objects/login.page';

// These tests use a FRESH browser (no saved auth) to test the login flow itself
const test = base;

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const ageGate = new AgeGatePage(page);
    await ageGate.confirmAge();
  });

  test('login page shows correct fields', async ({ page }) => {
    await page.goto('/my-account/');
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-submit-btn')).toBeVisible();
  });

  test('successful login redirects to my account', async ({ page }) => {
    const account = TEST_ACCOUNTS[0];
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(account.email, account.password);
    await loginPage.expectLoggedIn();
  });

  test('invalid credentials shows error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'WrongPassword123');
    // WooCommerce shows error notice for bad credentials
    await expect(
      page.locator('.woocommerce-error, .wc-block-components-notice-banner.is-error')
    ).toBeVisible({ timeout: 10_000 });
  });

  test('forgot password form is visible', async ({ page }) => {
    await page.goto('/my-account/');
    await expect(page.locator('#forgot-email')).toBeVisible();
    await expect(page.locator('#reset-password-btn')).toBeVisible();
  });
});
