import { test, expect } from '@playwright/test';
import { PUBLIC_SCENARIOS } from '../fixtures/public-routes';

/**
 * ============================================================
 * PUBLIC BROWSING — Real User Journeys
 *
 * Each session is ONE continuous video of a user browsing the site:
 *   - Lands on homepage, clicks through age gate
 *   - Clicks nav links to visit pages
 *   - Scrolls down to see content
 *   - Browses a product category
 *   - Clicks into a product, looks around
 *   - Goes back, browses more
 *
 * 10 sessions, 10 different paths, 10 videos.
 * Run: npm run test:public
 * ============================================================
 */

// Helper: simulate reading/looking at a page
async function browseAndScroll(page: any, waitMs = 1500) {
  await page.waitForTimeout(waitMs);
  // Scroll down slowly like a real user
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(800);
}

for (const scenario of PUBLIC_SCENARIOS) {
  test(`${scenario.name}`, async ({ page }) => {
    // ── 1. Land on homepage ──
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Look around the homepage
    await browseAndScroll(page);

    // ── 2. Click through content pages ──
    for (const pg of scenario.pages) {
      // Navigate to the page (simulates clicking a link)
      await page.goto(pg.path, { waitUntil: 'domcontentloaded' });

      // Verify page loaded (not 404)
      const title = await page.title();
      expect(title).not.toContain('404');

      // Key content should be visible
      const element = page.locator(pg.checkFor).first();
      await expect(element).toBeVisible({ timeout: 15_000 });

      // Browse the page like a real user
      await browseAndScroll(page, 1000);
    }

    // ── 3. Navigate to a product category via the PRODUCTS menu ──
    // Click PRODUCTS in the nav
    const productsNav = page.locator('nav#pr-nav a:has-text("PRODUCTS")').first();
    await expect(productsNav).toBeVisible({ timeout: 10_000 });
    await productsNav.click();
    await page.waitForTimeout(1000);

    // The mega menu should open — now click the category link
    const categoryLink = page.locator(`a[href*="${scenario.category.path}"]`).first();
    if (await categoryLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        categoryLink.click(),
      ]);
    } else {
      // Fallback: navigate directly
      await page.goto(scenario.category.path, { waitUntil: 'domcontentloaded' });
    }

    // ── 4. Browse the product listing ──
    const products = page.locator('li.product');
    await expect(products.first()).toBeVisible({ timeout: 15_000 });

    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);

    // Scroll through the product grid
    await browseAndScroll(page, 1500);

    // Hover over a couple of products (shows interaction in video)
    for (let i = 0; i < Math.min(3, productCount); i++) {
      const product = products.nth(i);
      if (await product.isVisible().catch(() => false)) {
        await product.scrollIntoViewIfNeeded();
        await product.hover();
        await page.waitForTimeout(600);
      }
    }

    // ── 5. Click into the first in-stock product ──
    const inStockProduct = page.locator('li.product.instock a.woocommerce-LoopProduct-link').first();
    if (await inStockProduct.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await inStockProduct.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        inStockProduct.click(),
      ]);

      // On the product detail page — look around
      await expect(page).toHaveURL(/\/product\//, { timeout: 15_000 });
      await expect(page.locator('h1.product-title')).toBeVisible({ timeout: 10_000 });

      // Scroll through product details
      await browseAndScroll(page, 2000);

      // Scroll down more to see description/reviews
      await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
      await page.waitForTimeout(1000);

      // Try clicking a size swatch if available
      const swatch = page.locator('.swatch-item:not(.disabled)').first();
      if (await swatch.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await swatch.click();
        await page.waitForTimeout(800);
      }

      // ── 6. Go back to the category listing ──
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
    }

    // ── 7. Scroll through more products ──
    await page.evaluate(() => window.scrollBy({ top: 800, behavior: 'smooth' }));
    await page.waitForTimeout(1000);

    // Click into a second product if available
    const secondProduct = page.locator('li.product.instock a.woocommerce-LoopProduct-link').nth(1);
    if (await secondProduct.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await secondProduct.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        secondProduct.click(),
      ]);

      // Quick look
      await browseAndScroll(page, 1500);

      // Go back
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
    }

    // ── 8. Click the cart icon (should be empty for guest) ──
    const cartIcon = page.locator('nav#pr-nav a[href*="cart"], .cart-contents').first();
    if (await cartIcon.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await Promise.all([
        page.waitForLoadState('domcontentloaded'),
        cartIcon.click(),
      ]);
      await page.waitForTimeout(1500);
    }

    // ── 9. Navigate to homepage via logo ──
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Final scroll on homepage
    await browseAndScroll(page, 1000);
  });
}
