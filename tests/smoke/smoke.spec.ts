import { test, expect } from '../fixtures/base-test';
import { CATEGORIES } from '../fixtures/test-data';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav#pr-nav')).toBeVisible();
    await expect(page.locator('.custom-logo')).toBeVisible();
  });

  test('navigation menu is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#primary-menu')).toBeVisible();
    for (const label of ['GET STARTED', 'ABOUT US', 'PRODUCTS', 'LEARN', 'CONTACT US']) {
      await expect(page.locator(`nav >> text=${label}`)).toBeVisible();
    }
  });

  test('my account page loads when logged in', async ({ page }) => {
    await page.goto('/my-account/');
    // Should see account dashboard, not login form
    await expect(
      page.locator('.woocommerce-MyAccount-navigation, .woocommerce-MyAccount-content')
    ).toBeVisible({ timeout: 10_000 });
  });

  test('cart page loads', async ({ page }) => {
    await page.goto('/cart/');
    await expect(page).toHaveURL(/cart/);
  });

  test('checkout page loads', async ({ page }) => {
    await page.goto('/checkout/');
    await expect(page).toHaveURL(/checkout/);
  });

  // Smoke test each product category loads products
  for (const category of CATEGORIES) {
    test(`category loads: ${category.name}`, async ({ page }) => {
      await page.goto(category.path);
      await page.waitForLoadState('networkidle');
      // Should have at least one product listed
      const products = page.locator('li.product');
      await expect(products.first()).toBeVisible({ timeout: 15_000 });
    });
  }
});
