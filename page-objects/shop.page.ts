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
    await this.page.goto(categoryPath, { waitUntil: 'domcontentloaded' });
    // Wait for product cards to render
    await this.page.waitForTimeout(2000);
  }

  /** Get the Nth in-stock product (0-based) */
  getInStockProduct(index: number): Locator {
    return this.page.locator('li.product.instock').nth(index);
  }

  /** Select a size swatch on a product card (e.g. "5 g", "10 g", "28 g") */
  async selectSize(product: Locator, sizeLabel: string) {
    // Try data-value attribute first
    const swatchByValue = product.locator(`.swatch-item[data-value="${sizeLabel}"]:not(.disabled)`);
    if (await swatchByValue.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await swatchByValue.click();
      await this.page.waitForTimeout(500);
      return;
    }

    // Fallback: match by text content
    const swatchByText = product.locator('.swatch-item:not(.disabled)').filter({ hasText: sizeLabel });
    if (await swatchByText.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await swatchByText.first().click();
      await this.page.waitForTimeout(500);
      return;
    }

    // Last resort: click first available swatch
    const firstSwatch = product.locator('.swatch-item:not(.disabled)').first();
    if (await firstSwatch.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await firstSwatch.click();
      await this.page.waitForTimeout(500);
    }
  }

  /** Set quantity on a product card */
  async setQuantity(product: Locator, quantity: number) {
    const qtyInput = product.locator('input.quantity, input[type="number"]');
    if (await qtyInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await qtyInput.fill(String(quantity));
      await qtyInput.dispatchEvent('change');
    } else {
      // Fallback: click the + button to increase quantity
      const plusBtn = product.locator('.plus, button:has-text("+"), .quantity-plus').first();
      for (let j = 1; j < quantity; j++) {
        await plusBtn.click();
        await this.page.waitForTimeout(300);
      }
    }
    await this.page.waitForTimeout(300);
  }

  /** Click the add-to-cart button on a product card */
  async addToCart(product: Locator) {
    const addBtn = product.locator('.single_add_to_cart_button:not(.notify-me-button)');
    await addBtn.click();

    // Wait for "Processing..." overlay to disappear
    const processing = this.page.getByText('Processing', { exact: false });
    if (await processing.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await processing.waitFor({ state: 'hidden', timeout: 15_000 });
    }

    // Wait for toast notification or cart badge update
    await this.page.waitForTimeout(2000);
  }

  /** Full flow: select size (if needed), set quantity, add to cart */
  async addProductToCart(
    productIndex: number,
    options?: { sizeLabel?: string | null; quantity?: number }
  ) {
    const product = this.getInStockProduct(productIndex);
    await product.scrollIntoViewIfNeeded();

    const addBtn = product.locator('.single_add_to_cart_button:not(.notify-me-button)');

    // Select size if a specific one is requested
    if (options?.sizeLabel) {
      await this.selectSize(product, options.sizeLabel);
    } else {
      // Only auto-pick swatch if button shows "SELECT SIZE" (not already "ADD TO CART")
      const btnText = (await addBtn.textContent() ?? '').trim();
      if (/select/i.test(btnText)) {
        const firstSwatch = product.locator('.swatch-item:not(.disabled)').first();
        if (await firstSwatch.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await firstSwatch.click();
          await this.page.waitForTimeout(500);
        }
      }
    }

    // Set quantity
    if (options?.quantity && options.quantity > 1) {
      await this.setQuantity(product, options.quantity);
    }

    // Wait for ADD TO CART button to be ready after swatch selection
    await addBtn.waitFor({ state: 'visible', timeout: 5_000 });

    // Add to cart
    await this.addToCart(product);
  }

  /** Pick a random in-stock product and add it to cart with random size */
  async addRandomProductToCart(quantity: number = 1): Promise<boolean> {
    const inStockCount = await this.getInStockCount();
    if (inStockCount === 0) return false;

    const randomIndex = Math.floor(Math.random() * inStockCount);
    const product = this.getInStockProduct(randomIndex);
    await product.scrollIntoViewIfNeeded();

    const addBtn = product.locator('.single_add_to_cart_button:not(.notify-me-button)');
    const btnText = (await addBtn.textContent() ?? '').trim();

    // If button says "SELECT SIZE", pick a random available swatch
    if (/select/i.test(btnText)) {
      const swatches = product.locator('.swatch-item:not(.disabled)');
      const swatchCount = await swatches.count();
      if (swatchCount > 0) {
        const randomSwatch = Math.floor(Math.random() * swatchCount);
        await swatches.nth(randomSwatch).click();
        await this.page.waitForTimeout(500);
      }
    }

    // Set quantity
    if (quantity > 1) {
      await this.setQuantity(product, quantity);
    }

    // Wait for ADD TO CART button after swatch selection
    await addBtn.waitFor({ state: 'visible', timeout: 5_000 });
    await this.addToCart(product);
    return true;
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
