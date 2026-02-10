import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS, ORDER_SCENARIOS, CATEGORIES } from '../fixtures/test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { LoginPage } from '../../page-objects/login.page';
import { ShopPage } from '../../page-objects/shop.page';
import { CartPage } from '../../page-objects/cart.page';
import { CheckoutPage } from '../../page-objects/checkout.page';

/**
 * ============================================================
 * ORDER PLACEMENT — 10 concurrent accounts
 *
 * Each account:
 *  1. Logs in
 *  2. Shuffles all categories, picks 3 random products
 *     from 3 different categories (skips empty ones)
 *  3. First product gets qty=2
 *  4. Removes 1 product from cart
 *  5. Places order using Veteran's Affairs policy ($0.00)
 *
 * Uses { page } fixture for automatic video embedding.
 * 10 accounts across 10 shards = 10 concurrent real users.
 * Run: npm run test:orders
 * ============================================================
 */

/** Fisher-Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

for (let i = 0; i < ORDER_SCENARIOS.length; i++) {
  const scenario = ORDER_SCENARIOS[i];
  const account = TEST_ACCOUNTS[scenario.accountIndex];

  base(`Order ${i + 1}: Multi-Product Order (${account.clientId})`, async ({ page }) => {
    // ── 1. Homepage + age gate ──
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const ageGate = new AgeGatePage(page);
    await ageGate.confirmAge();
    await page.screenshot({ path: `./test-results/order-${i + 1}-01-homepage.png` });

    // ── 2. Login ──
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(account.clientId, account.password);
    await loginPage.expectLoggedIn();
    await page.screenshot({ path: `./test-results/order-${i + 1}-02-logged-in.png` });

    // ── 3. Clear any existing cart items ──
    const cart = new CartPage(page);
    await cart.goto();
    const existingCount = await cart.getItemCount();
    if (existingCount > 0) {
      await cart.clearCart();
    }

    // ── 4. Add 3 random products from 3 different categories ──
    const shop = new ShopPage(page);
    const shuffledCategories = shuffle(CATEGORIES);
    let productsAdded = 0;
    const addedFromCategories: string[] = [];

    for (const category of shuffledCategories) {
      if (productsAdded >= 3) break;

      await shop.gotoCategory(category.path);
      const inStockCount = await shop.getInStockCount();

      if (inStockCount === 0) {
        console.log(`[Account ${i + 1}] No in-stock products in ${category.name}, skipping`);
        continue;
      }

      // First product gets qty=2, rest get qty=1
      const qty = productsAdded === 0 ? 2 : 1;
      const added = await shop.addRandomProductToCart(qty);

      if (added) {
        productsAdded++;
        addedFromCategories.push(category.name);
        console.log(`[Account ${i + 1}] Added product ${productsAdded} from ${category.name} (qty=${qty})`);
        await page.screenshot({ path: `./test-results/order-${i + 1}-0${2 + productsAdded}-product-${productsAdded}.png` });
      }
    }

    // Ensure we added at least 2 products (minimum for the test)
    console.log(`[Account ${i + 1}] Added ${productsAdded} products from: ${addedFromCategories.join(', ')}`);
    expect(productsAdded).toBeGreaterThanOrEqual(2);

    // ── 5. Go to cart — verify items ──
    await cart.goto();
    await cart.expectItemCount(productsAdded);
    await page.screenshot({ path: `./test-results/order-${i + 1}-06-cart-items.png` });

    // ── 6. Remove 1 item from cart ──
    const removeIdx = Math.min(scenario.removeFromCart, productsAdded - 1);
    await cart.removeItem(removeIdx);
    await cart.expectItemCount(productsAdded - 1);
    await page.screenshot({ path: `./test-results/order-${i + 1}-07-cart-after-remove.png` });

    // ── 7. Navigate to checkout ──
    const checkout = new CheckoutPage(page);
    await checkout.goto();
    await page.screenshot({ path: `./test-results/order-${i + 1}-08-checkout.png` });

    // ── 8. Proceed to payment ──
    await checkout.proceedToPayment();
    await page.screenshot({ path: `./test-results/order-${i + 1}-09-payment.png` });

    // ── 9. Try Veteran's Affairs policy ($0.00) or use saved credit card ──
    const hasVeteranPolicy = await checkout.tryApplyVeteranPolicy();
    await page.screenshot({ path: `./test-results/order-${i + 1}-10-payment-ready.png` });

    // ── 10. Place order ──
    await checkout.placeOrder();
    await checkout.expectOrderSuccess();
    await page.screenshot({ path: `./test-results/order-${i + 1}-11-order-success.png` });
    console.log(`[Account ${i + 1}] Order placed! (veteran policy: ${hasVeteranPolicy})`);
  });
}
