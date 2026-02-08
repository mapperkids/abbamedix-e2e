import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/my-account/');
  }

  async login(email: string, password: string) {
    await this.page.locator('#username').fill(email);
    await this.page.locator('#password').fill(password);
    // The login button may be disabled until fields are filled — wait for it
    const loginBtn = this.page.locator('#login-submit-btn');
    await loginBtn.waitFor({ state: 'visible' });
    // WooCommerce enables the button via JS after field input
    await this.page.waitForTimeout(500);
    await loginBtn.click({ force: true });
    // Wait for redirect after login (dashboard or my-account page)
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoggedIn() {
    // After login, WooCommerce shows the My Account dashboard
    await expect(
      this.page.locator('.woocommerce-MyAccount-navigation, .woocommerce-MyAccount-content')
    ).toBeVisible({ timeout: 15_000 });
  }
}
