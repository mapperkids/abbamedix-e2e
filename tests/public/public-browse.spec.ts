import { test, expect } from '@playwright/test';
import { PUBLIC_SCENARIOS, FilterAction } from '../fixtures/public-routes';

/**
 * ============================================================
 * PUBLIC BROWSING — Real User Journeys (50 sessions)
 *
 * Each session is ONE continuous video of a user browsing:
 *   - Lands on homepage, optionally searches for a product
 *   - Visits content pages
 *   - Browses a product category
 *   - Applies filters (THC/CBD range, sort order)
 *   - Clicks into products, scrolls, goes back
 *
 * 50 sessions across 10 machines = 50 concurrent users.
 * Run: npm run test:public
 * ============================================================
 */

// Helper: simulate reading/looking at a page
async function browseAndScroll(page: any, waitMs = 1500) {
  await page.waitForTimeout(waitMs);
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(800);
}

// Helper: apply a THC or CBD range filter via the number inputs
async function applyRangeFilter(page: any, sliderId: string, min: number, max: number) {
  const minInput = page.locator(`#${sliderId}-min-input`);
  const maxInput = page.locator(`#${sliderId}-max-input`);

  if (await minInput.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await minInput.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await minInput.fill(String(min));
    await page.waitForTimeout(200);
    await maxInput.fill(String(max));
    await page.waitForTimeout(200);

    // Click the Apply Filter button for this slider
    const applyBtn = page.locator(`button.ample-dual-range-apply[data-slider="${sliderId}"]`);
    if (await applyBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await applyBtn.click();
      await page.waitForTimeout(1500); // Wait for AJAX filter results
    }
  }
}

// Helper: select a sort option from the dropdown
async function applySortFilter(page: any, value: string) {
  const sortMap: Record<string, string> = {
    'popularity': 'Sort by popularity',
    'rating': 'Sort by average rating',
    'date': 'Sort by latest',
    'price': 'Sort by price: low to high',
    'price-desc': 'Sort by price: high to low',
  };

  const sortSelect = page.locator('select.orderby, .orderby');
  if (await sortSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await sortSelect.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    // Try select by value first, fallback to clicking the text
    try {
      await sortSelect.selectOption({ label: sortMap[value] || value });
    } catch {
      // Some themes use custom dropdowns — click the option text
      const option = page.locator(`text="${sortMap[value] || value}"`).first();
      if (await option.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await option.click();
      }
    }
    await page.waitForTimeout(1500); // Wait for re-sort
  }
}

// Helper: apply all filters for a scenario
async function applyFilters(page: any, filters: FilterAction[]) {
  for (const filter of filters) {
    switch (filter.type) {
      case 'thc':
        await applyRangeFilter(page, 'thc-dual-range', filter.min, filter.max);
        break;
      case 'cbd':
        await applyRangeFilter(page, 'cbd-dual-range', filter.min, filter.max);
        break;
      case 'sort':
        await applySortFilter(page, filter.value);
        break;
      case 'strain': {
        const strainLabel = page.locator(`text="${filter.value}"`).first();
        if (await strainLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await strainLabel.click();
          await page.waitForTimeout(1500);
        }
        break;
      }
      case 'brand': {
        const brandLabel = page.locator(`text="${filter.value}"`).first();
        if (await brandLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await brandLabel.click();
          await page.waitForTimeout(1500);
        }
        break;
      }
      case 'size': {
        const sizeLabel = page.locator(`text="${filter.value}"`).first();
        if (await sizeLabel.isVisible({ timeout: 2_000 }).catch(() => false)) {
          await sizeLabel.click();
          await page.waitForTimeout(1500);
        }
        break;
      }
    }
  }
}

for (const scenario of PUBLIC_SCENARIOS) {
  test(`${scenario.name}`, async ({ page }) => {
    // ── 1. Land on homepage ──
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // ── 1b. Search test (if this session has a search term) ──
    if (scenario.search) {
      const searchInput = page.locator('input.e-search-input[name="s"]').first();
      if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await searchInput.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await searchInput.click();
        await page.waitForTimeout(300);

        // Type the search term slowly like a real user
        await searchInput.fill(scenario.search);
        await page.waitForTimeout(1000);

        // Submit the search
        const searchBtn = page.locator('button.e-search-submit').first();
        if (await searchBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
          await Promise.all([
            page.waitForLoadState('domcontentloaded'),
            searchBtn.click(),
          ]);
        } else {
          await searchInput.press('Enter');
          await page.waitForLoadState('domcontentloaded');
        }
        await page.waitForTimeout(1500);

        // Check search results loaded
        const title = await page.title();
        expect(title.toLowerCase()).not.toContain('404');

        // Browse search results
        await browseAndScroll(page, 1000);

        // Go back to homepage
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);
      }
    }

    // Look around the homepage
    await browseAndScroll(page);

    // ── 2. Click through content pages ──
    for (const pg of scenario.pages) {
      await page.goto(pg.path, { waitUntil: 'domcontentloaded' });

      const title = await page.title();
      expect(title).not.toContain('404');

      const element = page.locator(pg.checkFor).first();
      await expect(element).toBeVisible({ timeout: 15_000 });

      await browseAndScroll(page, 1000);
    }

    // ── 3. Navigate to product category ──
    await page.goto(scenario.category.path, { waitUntil: 'domcontentloaded' });

    // ── 4. Browse the product listing ──
    const products = page.locator('li.product');
    await expect(products.first()).toBeVisible({ timeout: 15_000 });

    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);

    // Scroll through the product grid
    await browseAndScroll(page, 1000);

    // ── 4b. Apply filters if defined ──
    if (scenario.filters && scenario.filters.length > 0) {
      // Scroll up to filter area first
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
      await page.waitForTimeout(800);

      await applyFilters(page, scenario.filters);

      // Scroll through filtered results
      await browseAndScroll(page, 1000);
    }

    // Hover over products (shows interaction in video)
    const currentCount = await products.count();
    for (let i = 0; i < Math.min(3, currentCount); i++) {
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

      // On the product detail page
      await expect(page.locator('h1.product-title')).toBeVisible({ timeout: 10_000 });

      // Scroll through product details
      await browseAndScroll(page, 2000);

      // Scroll down more to see description
      await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }));
      await page.waitForTimeout(1000);

      // Try clicking a size swatch if available
      const swatch = page.locator('.swatch-item:not(.disabled)').first();
      if (await swatch.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await swatch.click();
        await page.waitForTimeout(800);
      }

      // Go back to the category listing
      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);
    }

    // ── 6. Scroll through more products ──
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

      await browseAndScroll(page, 1500);

      await page.goBack({ waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
    }

    // ── 7. Navigate to homepage ──
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Final scroll on homepage
    await browseAndScroll(page, 1000);
  });
}
