import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS, ORDER_SCENARIOS, CATEGORIES } from '../fixtures/test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { LoginPage } from '../../page-objects/login.page';
import { ShopPage } from '../../page-objects/shop.page';
import { CartPage } from '../../page-objects/cart.page';
import { CheckoutPage } from '../../page-objects/checkout.page';

/**
 * ============================================================
 * PARALLEL ORDER TESTS
 *
 * Each scenario in ORDER_SCENARIOS becomes its own independent test.
 * With workers=10, all 10 run simultaneously — each with its own
 * account, browser, and product category.
 *
 * To add more scenarios: just add to ORDER_SCENARIOS in test-data.ts
 * To add more sessions:  add more accounts + scenarios
 * ============================================================
 */

for (const scenario of ORDER_SCENARIOS) {
  const account = TEST_ACCOUNTS[scenario.accountIndex];

  base(`Parallel Order: ${scenario.name} (${account.clientId})`, async ({ browser }) => {
    // Each test creates its own fresh context with its own account
    const context = await browser.newContext({
      recordVideo: { dir: './test-results/videos/' },
    });
    const page = await context.newPage();

    try {
      // 1. Handle age gate
      await page.goto('/');
      const ageGate = new AgeGatePage(page);
      await ageGate.confirmAge();

      // 2. Login with this scenario's dedicated account
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(account.clientId, account.password);
      await loginPage.expectLoggedIn();

      // 3. Clear any existing cart
      const cart = new CartPage(page);
      await cart.goto();
      const existingItems = await cart.getItemCount();
      if (existingItems > 0) {
        await cart.clearCart();
      }

      // 4. Browse to the category and add product
      const shop = new ShopPage(page);
      await shop.gotoCategory(scenario.category.path);

      // Wait for products to load
      const inStockCount = await shop.getInStockCount();
      if (inStockCount === 0) {
        console.log(`No in-stock products in ${scenario.category.name}, skipping order`);
        return;
      }

      // Pick the product (fallback to 0 if requested index doesn't exist)
      const productIndex = Math.min(scenario.productIndex, inStockCount - 1);
      await shop.addProductToCart(productIndex, {
        sizeLabel: scenario.sizeLabel,
        quantity: scenario.quantity,
      });

      // 5. Go to cart and verify
      await cart.goto();
      await cart.expectHasItems();

      // 6. Proceed to checkout
      await cart.proceedToCheckout();

      // 7. Complete the order
      const checkout = new CheckoutPage(page);
      await checkout.waitForReady();
      await checkout.placeOrder();
      await checkout.expectOrderSuccess();

      // Take a final screenshot of the confirmation
      await page.screenshot({ path: `./test-results/order-confirmed-${scenario.accountIndex}.png` });

    } finally {
      await context.close();
    }
  });
}
