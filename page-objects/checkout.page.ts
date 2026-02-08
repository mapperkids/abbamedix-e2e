import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/checkout/');
    await this.page.waitForLoadState('networkidle');
  }

  /** Wait for checkout page to fully load */
  async waitForReady() {
    // WooCommerce checkout loads fragments via AJAX
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('#place_order, .place-order, form.checkout').waitFor({
      state: 'visible',
      timeout: 15_000,
    });
  }

  /** Fill billing details — adapt field IDs to your site's checkout form */
  async fillBillingDetails(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  }) {
    if (data.firstName) {
      const field = this.page.locator('#billing_first_name');
      if (await field.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await field.fill(data.firstName);
      }
    }
    if (data.lastName) {
      const field = this.page.locator('#billing_last_name');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.lastName);
      }
    }
    if (data.email) {
      const field = this.page.locator('#billing_email');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.email);
      }
    }
    if (data.phone) {
      const field = this.page.locator('#billing_phone');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.phone);
      }
    }
    if (data.address) {
      const field = this.page.locator('#billing_address_1');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.address);
      }
    }
    if (data.city) {
      const field = this.page.locator('#billing_city');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.city);
      }
    }
    if (data.zip) {
      const field = this.page.locator('#billing_postcode');
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(data.zip);
      }
    }
    // Wait for AJAX to update order review
    await this.page.waitForLoadState('networkidle');
  }

  /** Select a payment method by its radio input ID */
  async selectPaymentMethod(methodId: string) {
    const radio = this.page.locator(`#${methodId}`);
    if (await radio.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await radio.check();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /** Click the Place Order button */
  async placeOrder() {
    await this.page.locator('#place_order').click();
    // Wait for order confirmation page
    await this.page.waitForURL('**/order-received/**', { timeout: 60_000 });
  }

  /** Assert order was placed successfully */
  async expectOrderSuccess() {
    await expect(this.page).toHaveURL(/order-received/);
    await expect(
      this.page.locator('.woocommerce-thankyou-order-received, .woocommerce-order-received')
    ).toBeVisible({ timeout: 15_000 });
  }
}
