import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/checkout/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);

    // Wait for shipping method to load via AJAX (up to 30s)
    const placeholder = this.page.getByText('-- Select Shipping Method --');
    for (let attempt = 0; attempt < 15; attempt++) {
      const still = await placeholder.isVisible({ timeout: 1_000 }).catch(() => false);
      if (!still) {
        console.log('  → Shipping method loaded');
        break;
      }
      if (attempt === 14) {
        console.log('  → WARNING: Shipping method still not loaded after 30s');
        // Trigger WooCommerce shipping calculation via JS
        await this.page.evaluate(() => {
          (document.body as any).dispatchEvent?.(new Event('update_checkout'));
          jQuery?.('body')?.trigger?.('update_checkout');
        }).catch(() => {});
        await this.page.waitForTimeout(5000);
      }
      await this.page.waitForTimeout(2000);
    }
  }

  /** Click "PROCEED TO PAYMENT" on the shipping/confirmation step */
  async proceedToPayment() {
    const btn = this.page.getByRole('button', { name: /proceed to payment/i })
      .or(this.page.getByRole('link', { name: /proceed to payment/i }))
      .or(this.page.locator('button, a, input[type="submit"]').filter({ hasText: /proceed to payment/i }));

    await btn.first().waitFor({ state: 'visible', timeout: 30_000 });
    await btn.first().click();
    // Wait for payment section to load
    await this.page.waitForTimeout(5000);
  }

  /**
   * Try to apply Veteran's Affairs policy for $0.00 total.
   * Returns true if the policy was found and applied, false if not available.
   *
   * The "Available Discounts" section with "Policy - Veteran's Affairs" checkbox
   * appears on the payment page for eligible accounts (6 of 10 test accounts).
   */
  async tryApplyVeteranPolicy(): Promise<boolean> {
    // Scroll to top to find the discount section
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(1000);

    // Look for the exact checkbox label from the "Available Discounts" section
    const veteranLabel = this.page.getByText('Policy - Veteran\'s Affairs');
    const hasVeteran = await veteranLabel.isVisible({ timeout: 5_000 }).catch(() => false);

    if (!hasVeteran) {
      console.log('  → Veteran\'s Affairs policy not available for this account, using credit card');
      return false;
    }

    // Found it — click the label to check the checkbox
    await veteranLabel.scrollIntoViewIfNeeded();
    await veteranLabel.click();
    console.log('  → Clicked "Policy - Veteran\'s Affairs" checkbox');

    // Wait for AJAX to recalculate total
    await this.page.waitForTimeout(5000);

    // Verify $0.00 total or that Credit Card section is hidden
    const bodyText = await this.page.evaluate(() => document.body.innerText);
    const hasZeroTotal = /\$0\.00/.test(bodyText);
    const hasNoPayment = /no further payment/i.test(bodyText);
    const isApplied = hasZeroTotal || hasNoPayment;
    console.log(`  → Veteran's Affairs applied, $0.00 total: ${isApplied}`);
    return isApplied;
  }

  /** Click "PLACE ORDER" button */
  async placeOrder() {
    const placeBtn = this.page.locator('#place_order');

    await placeBtn.scrollIntoViewIfNeeded();
    await placeBtn.waitFor({ state: 'visible', timeout: 15_000 });

    // Wait for button to become enabled (up to 20s)
    for (let attempt = 0; attempt < 20; attempt++) {
      const isDisabled = await placeBtn.isDisabled();
      if (!isDisabled) break;
      if (attempt % 5 === 4) {
        console.log(`  → PLACE ORDER still disabled, waiting... (attempt ${attempt + 1})`);
      }
      await this.page.waitForTimeout(1000);
    }

    const stillDisabled = await placeBtn.isDisabled();
    if (stillDisabled) {
      console.log('  → WARNING: PLACE ORDER button still disabled, force-clicking');
      await this.page.screenshot({ path: './test-results/place-order-disabled-debug.png', fullPage: true });
      await placeBtn.click({ force: true });
    } else {
      await placeBtn.click();
    }

    // Wait for order processing
    await this.page.waitForTimeout(10000);
  }

  /** Verify order was placed successfully */
  async expectOrderSuccess() {
    try {
      await this.page.waitForURL(/order-received|order-confirmation|thank-you/i, { timeout: 60_000 });
    } catch {
      // If URL doesn't change, check for success text
      const successText = this.page.getByText(/thank you|order.*received|order.*confirmed|order.*placed/i);
      await expect(successText.first()).toBeVisible({ timeout: 15_000 });
    }
  }
}
