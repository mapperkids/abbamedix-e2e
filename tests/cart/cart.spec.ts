import { test, expect } from '../fixtures/base-test';
import { ShopPage } from '../../page-objects/shop.page';
import { CartPage } from '../../page-objects/cart.page';
import { CATEGORIES } from '../fixtures/test-data';

test.describe('Cart Management', () => {
  let shop: ShopPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    shop = new ShopPage(page);
    cart = new CartPage(page);
    // Clear cart before each test
    await cart.goto();
    const itemCount = await cart.getItemCount();
    if (itemCount > 0) {
      await cart.clearCart();
    }
  });

  test('add single product to cart', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path); // Dried Flower
    await shop.addProductToCart(0, { sizeLabel: '5 g', quantity: 1 });

    await cart.goto();
    await cart.expectHasItems();
    expect(await cart.getItemCount()).toBeGreaterThanOrEqual(1);
  });

  test('add multiple products to cart', async ({ page }) => {
    // Add from Dried Flower
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    // Add from Edibles
    await shop.gotoCategory(CATEGORIES[1].path);
    await shop.addProductToCart(0);

    await cart.goto();
    await cart.expectHasItems();
    expect(await cart.getItemCount()).toBeGreaterThanOrEqual(2);
  });

  test('remove item from cart', async ({ page }) => {
    // Add a product first
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    await cart.goto();
    await cart.expectHasItems();

    // Remove the item
    await cart.removeItem(0);

    // Cart should now be empty (or have one fewer item)
    await cart.goto();
    await cart.expectEmpty();
  });

  test('update quantity in cart', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    await cart.goto();
    await cart.expectHasItems();

    // Update quantity to 3
    await cart.updateQuantity(0, 3);

    // Verify quantity persisted
    const qtyInput = page.locator('.cart_item input.qty, .cart-item input[type="number"]').first();
    await expect(qtyInput).toHaveValue('3');
  });

  test('cart persists after page reload', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    await cart.goto();
    const countBefore = await cart.getItemCount();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    const countAfter = await cart.getItemCount();
    expect(countAfter).toBe(countBefore);
  });

  test('proceed to checkout from cart', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    await cart.goto();
    await cart.expectHasItems();
    await cart.proceedToCheckout();

    await expect(page).toHaveURL(/checkout/);
  });
});
