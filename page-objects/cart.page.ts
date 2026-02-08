import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartTotal: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.woocommerce-cart-form .cart_item, .cart-item');
    this.cartTotal = page.locator('.cart-subtotal .amount, .order-total .amount');
    this.checkoutButton = page.locator('.checkout-button, a[href*="checkout"]');
    this.emptyCartMessage = page.locator('.cart-empty, .wc-empty-cart-message');
  }

  async goto() {
    await this.page.goto('/cart/');
    await this.page.waitForLoadState('networkidle');
  }

  /** Get the number of items in the cart */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /** Remove a cart item by its row index (0-based) */
  async removeItem(index: number) {
    const removeBtn = this.cartItems.nth(index).locator('.remove, a.remove');
    await removeBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Remove all items from the cart */
  async clearCart() {
    const count = await this.getItemCount();
    for (let i = count - 1; i >= 0; i--) {
      await this.removeItem(0); // always remove first since list shifts
    }
  }

  /** Update quantity for a cart item by row index */
  async updateQuantity(index: number, quantity: number) {
    const qtyInput = this.cartItems.nth(index).locator('input.qty, input[type="number"]');
    await qtyInput.fill(String(quantity));
    const updateBtn = this.page.locator('button[name="update_cart"], .update-cart');
    if (await updateBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await updateBtn.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  /** Proceed to checkout */
  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Assert cart is not empty */
  async expectHasItems() {
    await expect(this.cartItems.first()).toBeVisible({ timeout: 10_000 });
  }

  /** Assert cart is empty */
  async expectEmpty() {
    await expect(this.emptyCartMessage).toBeVisible({ timeout: 10_000 });
  }
}
