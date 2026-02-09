import { Page, Locator } from '@playwright/test';

export class NavPage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly accountIcon: Locator;
  readonly searchIcon: Locator;
  readonly productsMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('nav#pr-nav .fa-shopping-cart, nav#pr-nav a[href*="cart"]');
    this.accountIcon = page.locator('.header-profile > .menu-item');
    this.searchIcon = page.locator('nav#pr-nav .fa-search');
    this.productsMenu = page.locator('#menu-item-31065');
  }

  /** Open cart page from the nav icon */
  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Open my account page from the nav icon */
  async goToAccount() {
    await this.accountIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Get the cart item count from the nav badge (if present) */
  async getCartBadgeCount(): Promise<string> {
    const badge = this.page.locator('.cart-contents .count, .cart-count');
    if (await badge.isVisible({ timeout: 2_000 }).catch(() => false)) {
      return (await badge.textContent()) ?? '0';
    }
    return '0';
  }
}
