import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/cart/', { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(2000);
  }

  /** Get all REMOVE links/buttons in the cart */
  private get removeLinks(): Locator {
    return this.page.getByText('REMOVE', { exact: true });
  }

  /** Get the number of items in the cart */
  async getItemCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.removeLinks.count();
  }

  /** Wait for WooCommerce blockUI overlay to disappear */
  private async waitForBlockUI() {
    const overlay = this.page.locator('.blockUI.blockOverlay');
    if (await overlay.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await overlay.waitFor({ state: 'hidden', timeout: 15_000 });
    }
  }

  /** Remove a cart item by its index (0-based) */
  async removeItem(index: number) {
    const count = await this.removeLinks.count();
    if (count === 0) return;
    const safeIndex = Math.min(index, count - 1);
    await this.waitForBlockUI();
    await this.removeLinks.nth(safeIndex).scrollIntoViewIfNeeded();
    await this.removeLinks.nth(safeIndex).click();
    // Wait for AJAX cart update + blockUI to finish
    await this.page.waitForTimeout(2000);
    await this.waitForBlockUI();
  }

  /** Remove all items from the cart */
  async clearCart() {
    let count = await this.getItemCount();
    while (count > 0) {
      await this.removeItem(0);
      count = await this.getItemCount();
    }
  }

  /** Assert the cart has the expected number of items */
  async expectItemCount(expected: number) {
    // Retry for up to 15 seconds (cart updates via AJAX)
    for (let attempt = 0; attempt < 10; attempt++) {
      const count = await this.getItemCount();
      if (count === expected) return;
      await this.page.waitForTimeout(1500);
    }
    const finalCount = await this.removeLinks.count();
    expect(finalCount).toBe(expected);
  }

  /** Assert cart has items (any number > 0) */
  async expectHasItems() {
    await expect(this.removeLinks.first()).toBeVisible({ timeout: 15_000 });
  }
}
