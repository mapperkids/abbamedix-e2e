import { test, expect } from '../fixtures/base-test';
import { ShopPage } from '../../page-objects/shop.page';
import { CartPage } from '../../page-objects/cart.page';
import { CheckoutPage } from '../../page-objects/checkout.page';
import { CATEGORIES } from '../fixtures/test-data';

test.describe('Full Order Flow', () => {
  let shop: ShopPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    shop = new ShopPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    // Ensure cart is empty before each order test
    await cart.goto();
    const itemCount = await cart.getItemCount();
    if (itemCount > 0) {
      await cart.clearCart();
    }
  });

  test('complete order: single dried flower product', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g', quantity: 1 });

    await cart.goto();
    await cart.expectHasItems();
    await cart.proceedToCheckout();

    await checkout.waitForReady();
    await checkout.placeOrder();
    await checkout.expectOrderSuccess();
  });

  test('complete order: multiple products from different categories', async ({ page }) => {
    // Add dried flower
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });

    // Add edible
    await shop.gotoCategory(CATEGORIES[1].path);
    await shop.addProductToCart(0);

    await cart.goto();
    expect(await cart.getItemCount()).toBeGreaterThanOrEqual(2);
    await cart.proceedToCheckout();

    await checkout.waitForReady();
    await checkout.placeOrder();
    await checkout.expectOrderSuccess();
  });

  test('complete order: higher quantity', async ({ page }) => {
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '10 g', quantity: 3 });

    await cart.goto();
    await cart.expectHasItems();
    await cart.proceedToCheckout();

    await checkout.waitForReady();
    await checkout.placeOrder();
    await checkout.expectOrderSuccess();
  });

  test('add to cart, remove one, then checkout remaining', async ({ page }) => {
    // Add two products
    await shop.gotoCategory(CATEGORIES[0].path);
    await shop.addProductToCart(0, { sizeLabel: '5 g' });
    await shop.addProductToCart(1, { sizeLabel: '5 g' });

    // Remove one
    await cart.goto();
    expect(await cart.getItemCount()).toBeGreaterThanOrEqual(2);
    await cart.removeItem(0);

    // Checkout with remaining
    await cart.expectHasItems();
    await cart.proceedToCheckout();

    await checkout.waitForReady();
    await checkout.placeOrder();
    await checkout.expectOrderSuccess();
  });
});
