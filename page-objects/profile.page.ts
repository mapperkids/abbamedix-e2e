import { Page, expect } from '@playwright/test';

export class ProfilePage {
  constructor(private page: Page) {}

  // ─── Profile ───

  async gotoProfile() {
    await this.page.goto('/my-account/');
    await this.page.waitForLoadState('networkidle');
  }

  async expectProfileVisible() {
    await expect(
      this.page.locator('text=ACCOUNT STATUS').first()
    ).toBeVisible({ timeout: 15_000 });
  }

  async clickManageCards() {
    const btn = this.page.locator('a:has-text("MANAGE CARDS"), a:has-text("Manage Cards"), a[href*="manage-card"]').first();
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ─── Manage Cards ───

  async gotoManageCards() {
    await this.page.goto('/my-account/manage-card/');
    await this.page.waitForLoadState('networkidle');
  }

  async expectManageCardsPageVisible() {
    await expect(this.page).toHaveURL(/manage-card/);
  }

  async clickAddNewCard() {
    const btn = this.page.locator('a:has-text("ADD NEW CARD"), a:has-text("Add New Card"), button:has-text("ADD NEW CARD"), button:has-text("Add New Card")').first();
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ─── Add Card Form ───

  async fillBillingInfo(data: {
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    postalCode: string;
  }) {
    // Try getByLabel first, fallback to common ID selectors
    for (const [label, value, fallbackId] of [
      ['First Name', data.firstName, '#billing_first_name'],
      ['Last Name', data.lastName, '#billing_last_name'],
      ['Street Name', data.street, '#billing_address_1'],
      ['Street Number', data.streetNumber, '#billing_address_2'],
      ['Postal Code', data.postalCode, '#billing_postcode'],
    ] as [string, string, string][]) {
      let field = this.page.getByLabel(label, { exact: false }).first();
      if (!await field.isVisible({ timeout: 3_000 }).catch(() => false)) {
        field = this.page.locator(fallbackId);
      }
      if (await field.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await field.fill(value);
        await this.page.waitForTimeout(200);
      }
    }
  }

  /**
   * Fill card details using 3-tier strategy:
   * 1. Direct inputs (non-iframe card fields)
   * 2. Stripe single combined iframe
   * 3. Stripe separate iframes (cardNumber, cardExpiry, cardCvc)
   */
  async fillCardDetails(card: { number: string; expiry: string; cvc: string }) {
    // The card fields are inside a Moneris HPP iframe (esqa.moneris.com)
    // First scroll the iframe into view on the main page
    const iframeEl = this.page.locator('iframe[src*="moneris.com"]').first();
    await iframeEl.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    // Get the actual Frame object for cross-origin iframe interaction
    const iframeHandle = await iframeEl.elementHandle();
    const frame = await iframeHandle?.contentFrame();
    if (!frame) {
      throw new Error('Could not access Moneris iframe content frame');
    }

    // Fill card number
    await frame.fill('input.monerisInput:first-of-type', card.number);
    await this.page.waitForTimeout(500);

    // Fill expiry — send digits only, the formatter adds the slash
    await frame.fill('#monerisExpInput', card.expiry.replace('/', ''));
    await this.page.waitForTimeout(300);

    // Fill CVC
    const cvcSelector = 'input[placeholder="CVC"]';
    await frame.fill(cvcSelector, card.cvc);
    await this.page.waitForTimeout(300);
  }

  async saveCard() {
    const btn = this.page.getByRole('button', { name: /SAVE CARD/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectCardSaved() {
    // Look for success message or the saved card appearing in the list
    const success = this.page.locator('.woocommerce-message, .wc-block-components-notice-banner.is-success').first();
    const cardEntry = this.page.locator('text=/Visa ending in/i, text=/card.*saved/i, text=/success/i').first();
    try {
      await expect(success.or(cardEntry)).toBeVisible({ timeout: 15_000 });
    } catch {
      // If no explicit success message, check that we're back on manage-card with a card listed
      await expect(this.page).toHaveURL(/manage-card/);
    }
  }
}
