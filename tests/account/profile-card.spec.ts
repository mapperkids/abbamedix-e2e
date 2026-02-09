import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS, CARD_TEST_DATA, TEST_CARD, SITE } from '../fixtures/test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { LoginPage } from '../../page-objects/login.page';
import { NavPage } from '../../page-objects/nav.page';
import { ProfilePage } from '../../page-objects/profile.page';

/**
 * ============================================================
 * PROFILE & CARD MANAGEMENT — 10 concurrent accounts
 *
 * Each account logs in, views profile, checks orders,
 * adds a credit card, then logs out.
 *
 * 10 accounts across 10 shards = 10 concurrent real users.
 * Run: npm run test:account
 * ============================================================
 */

for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
  const account = TEST_ACCOUNTS[i];
  const billing = CARD_TEST_DATA[i];

  base(`Account ${i + 1}: Profile & Card (${account.clientId})`, async ({ browser }) => {
    const context = await browser.newContext({
      recordVideo: { dir: './test-results/videos/' },
    });
    const page = await context.newPage();

    try {
      // ── 1. Homepage + age gate ──
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      const ageGate = new AgeGatePage(page);
      await ageGate.confirmAge();
      await page.screenshot({ path: `./test-results/account-${i + 1}-01-homepage.png` });

      // ── 2. Login ──
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(account.clientId, account.password);
      await loginPage.expectLoggedIn();
      await page.screenshot({ path: `./test-results/account-${i + 1}-02-logged-in.png` });

      // ── 3. View profile — verify ACCOUNT STATUS ──
      const profile = new ProfilePage(page);
      await profile.gotoProfile();
      await profile.expectProfileVisible();
      await page.screenshot({ path: `./test-results/account-${i + 1}-03-profile.png` });

      // ── 4. Navigate to orders via account icon dropdown ──
      const nav = new NavPage(page);
      await nav.accountIcon.hover();
      await page.waitForTimeout(500);
      const ordersLink = page.locator('a:has-text("MY ORDERS"), a:has-text("My Orders"), a[href*="orders"]').first();
      if (await ordersLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await ordersLink.click();
        await page.waitForLoadState('networkidle');
      } else {
        // Fallback: navigate directly
        await page.goto('/my-account/orders/', { waitUntil: 'domcontentloaded' });
      }
      await expect(page).toHaveURL(/orders/);
      await page.screenshot({ path: `./test-results/account-${i + 1}-04-orders.png` });

      // ── 5. Go to manage cards ──
      await profile.gotoProfile();
      await profile.clickManageCards();
      await profile.expectManageCardsPageVisible();
      await page.screenshot({ path: `./test-results/account-${i + 1}-05-manage-cards.png` });

      // ── 6. Add new card ──
      await profile.clickAddNewCard();
      await page.waitForTimeout(1000);

      // ── 7. Fill billing info ──
      await profile.fillBillingInfo(billing);
      await page.waitForTimeout(500);

      // ── 8. Fill card details ──
      await profile.fillCardDetails(TEST_CARD);
      await page.screenshot({ path: `./test-results/account-${i + 1}-06-card-filled.png` });

      // ── 9. Save card ──
      await profile.saveCard();
      await profile.expectCardSaved();
      await page.screenshot({ path: `./test-results/account-${i + 1}-07-card-saved.png` });

      // ── 10. Logout via account icon dropdown ──
      await nav.accountIcon.hover();
      await page.waitForTimeout(500);
      const logoutLink = page.locator('a:has-text("LOGOUT"), a:has-text("Logout"), a[href*="logout"]').first();
      if (await logoutLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await logoutLink.click();
        await page.waitForLoadState('networkidle');
      } else {
        await page.goto('/my-account/customer-logout/', { waitUntil: 'domcontentloaded' });
      }
      // Verify logged out — may redirect to homepage or login page
      await page.waitForTimeout(2000);
      const onHomepage = page.url().includes(SITE.baseURL) && !page.url().includes('my-account');
      const loginVisible = await page.locator('#username').isVisible({ timeout: 3_000 }).catch(() => false);
      expect(onHomepage || loginVisible).toBeTruthy();

    } finally {
      await context.close();
    }
  });
}
