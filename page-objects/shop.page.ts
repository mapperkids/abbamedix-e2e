import { Page, Locator } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly products: Locator;

  constructor(page: Page) {
    this.page = page;
    this.products = page.locator('li.product');
  }

  /** Navigate to a product category page */
  async gotoCategory(categoryPath: string) {
    await this.page.goto(categoryPath);
    await this.page.waitForLoadState('networkidle');
  }

  /** Get all in-stock product cards */
  async getInStockProducts(): Promise<Locator> {
    return this.page.locator('li.product.instock');
  }

  /** Get the Nth in-stock product (0-based) */
  getInStockProduct(index: number): Locator {
    return this.page.locator('li.product.instock').nth(index);
  }

  /** Select a size swatch on a product card (e.g. "5 g", "10 g", "28 g") */
  async selectSize(product: Locator, sizeLabel: string) {
    const swatch = product.locator(`.swatch-item[data-value="${sizeLabel}"]:not(.disabled)`);
    if (await swatch.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await swatch.click();
      // Wait for price to update after swatch selection
      await this.page.waitForTimeout(500);
    }
  }

  /** Set quantity on a product card */
  async setQuantity(product: Locator, quantity: number) {
    const qtyInput = product.locator('input.quantity');
    await qtyInput.fill(String(quantity));
    // Trigger change event
    await qtyInput.dispatchEvent('change');
    await this.page.waitForTimeout(300);
  }

  /** Click the add-to-cart / purchase button on a product card */
  async addToCart(product: Locator) {
    const addBtn = product.locator('.single_add_to_cart_button:not(.notify-me-button)');
    await addBtn.click();
    // Wait for AJAX cart update
    await this.page.waitForLoadState('networkidle');
  }

  /** Full flow: select size (if needed), set quantity, add to cart */
  async addProductToCart(
    productIndex: number,
    options?: { sizeLabel?: string | null; quantity?: number }
  ) {
    const product = this.getInStockProduct(productIndex);
    await product.scrollIntoViewIfNeeded();

    // Select size if provided
    if (options?.sizeLabel) {
      await this.selectSize(product, options.sizeLabel);
    } else {
      // Click first available non-disabled swatch if any exist
      const firstSwatch = product.locator('.swatch-item:not(.disabled)').first();
      if (await firstSwatch.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await firstSwatch.click();
        await this.page.waitForTimeout(500);
      }
    }

    // Set quantity
    if (options?.quantity && options.quantity > 1) {
      await this.setQuantity(product, options.quantity);
    }

    // Add to cart
    await this.addToCart(product);
  }

  /** Get product name from a card */
  async getProductName(product: Locator): Promise<string> {
    return (await product.locator('.woocommerce-loop-product__title').textContent()) ?? '';
  }

  /** Get the number of products currently displayed */
  async getProductCount(): Promise<number> {
    return await this.products.count();
  }

  /** Get the number of in-stock products */
  async getInStockCount(): Promise<number> {
    return await this.page.locator('li.product.instock').count();
  }
}
