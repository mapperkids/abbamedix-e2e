# Abba Medix E2E Tests

Playwright E2E test suite for the Abba Medix WooCommerce site at `https://shop-abbamedix.sandbox.onample.com`.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Add your test account credentials in tests/fixtures/test-data.ts

# 4. Run all tests
npm test

# 5. Save report with timestamp
npm run report:save

# 6. Upload to company website
npm run report:upload
```

---

## Project Structure

```
abbamedix-e2e/
├── playwright.config.ts           # Main config: video, workers, retries, browsers
├── package.json                   # Scripts: test, report:save, report:upload
├── tsconfig.json
│
├── tests/
│   ├── fixtures/
│   │   ├── test-data.ts           # ** THE MAIN FILE TO EDIT **
│   │   │                          #    - Test accounts (credentials)
│   │   │                          #    - Product categories (routes)
│   │   │                          #    - Order scenarios (what each session does)
│   │   ├── auth.setup.ts          # Logs in each account, saves cookies
│   │   └── base-test.ts           # Custom test fixture (handles age gate + auth)
│   │
│   ├── smoke/
│   │   └── smoke.spec.ts          # Homepage, nav, all categories load
│   ├── auth/
│   │   └── login.spec.ts          # Login success, bad credentials, forgot password
│   ├── cart/
│   │   └── cart.spec.ts           # Add/remove/update qty/multi-product/persistence
│   └── orders/
│       ├── full-order-flow.spec.ts      # Single/multi/high-qty order flows
│       └── parallel-orders.spec.ts      # 10 parallel sessions, each different scenario
│
├── page-objects/                  # All selectors live here (Page Object Model)
│   ├── age-gate.page.ts           # "Are you 19?" popup
│   ├── login.page.ts              # /my-account/ login form
│   ├── shop.page.ts               # Product listing, size swatches, add to cart
│   ├── cart.page.ts               # Cart items, remove, update qty, checkout button
│   ├── checkout.page.ts           # Billing form, payment method, place order
│   └── nav.page.ts                # Top navigation, cart icon, account icon
│
├── scripts/
│   ├── save-report.sh             # Saves report to reports-history/<timestamp>/
│   └── upload-report.sh           # Uploads reports-history/ to your company server
│
├── auth-states/                   # Auto-generated: saved login cookies per account
├── test-results/                  # Auto-generated: videos, screenshots, traces
├── playwright-report/             # Auto-generated: HTML report after each run
└── reports-history/               # Timestamped archive of all past reports
```

---

## Configuration: `tests/fixtures/test-data.ts`

This is the **single file** that controls everything. An AI agent or developer only needs to edit this file to scale tests or add routes.

### Test Accounts

Each account = one parallel browser session. Workers auto-scale to match.

```ts
export const TEST_ACCOUNTS = [
  { email: 'tester1@example.com', password: 'password1' },
  { email: 'tester2@example.com', password: 'password2' },
  // Add more accounts = more parallel sessions
  // Remove accounts = fewer sessions
];
```

| Want this many sessions? | Add this many accounts |
|---|---|
| 5 | 5 accounts in the array |
| 10 | 10 accounts |
| 20 | 20 accounts |
| 50 | 50 accounts (for load testing) |

### Product Categories (Test Routes)

Each entry is a browseable product category on the site.

```ts
export const CATEGORIES = [
  { name: 'Dried Flower', path: '/product-filter/dried-flower-dried-flower' },
  { name: 'Edibles',      path: '/product-filter/edibles-edibles' },
  // ... existing categories
];
```

**Current categories discovered from the live site:**

| Category | URL Path |
|---|---|
| Dried Flower | `/product-filter/dried-flower-dried-flower` |
| Edibles | `/product-filter/edibles-edibles` |
| Topicals | `/product-filter/topical~topicals-topicals` |
| Extracts | `/product-filter/capsules~extracts-extracts~oil~sublingual-strips` |
| Vapes | `/product-filter/vapes-vapes` |
| Pre-Rolls | `/product-filter/pre-rolls-pre-rolls` |
| Beverages | `/product-filter/beverages-beverages` |
| Concentrates | `/product-filter/concentrates-concentrates` |
| Medical | `/product-filter/inhaler~suppository` |
| Accessories | `/product-filter/accessories-accessories` |

### Order Scenarios

Each scenario defines what one parallel session does during the test.

```ts
export const ORDER_SCENARIOS = [
  {
    name: 'Dried Flower - single item',  // Test name (shows in report)
    accountIndex: 0,                      // Which TEST_ACCOUNTS[index] to use
    category: CATEGORIES[0],              // Which category to browse
    productIndex: 0,                      // Pick the Nth in-stock product (0-based)
    sizeLabel: '5 g',                     // Size swatch to select (null = auto-pick first)
    quantity: 1,                          // How many to add
  },
  // Add more scenarios for more test coverage
];
```

---

## How to Add New Test Routes

### Step 1: Discover the route

Use Playwright to browse the site and find the URL:

```bash
# Open the site in a headed browser
npx playwright open https://shop-abbamedix.sandbox.onample.com
```

Navigate to the new page/category and copy the URL path.

### Step 2: Add the category

In `tests/fixtures/test-data.ts`, add to `CATEGORIES`:

```ts
export const CATEGORIES = [
  // ... existing
  { name: 'New Category', path: '/product-filter/new-category-slug' },
];
```

### Step 3: Add a test scenario

In the same file, add to `ORDER_SCENARIOS`:

```ts
export const ORDER_SCENARIOS = [
  // ... existing
  {
    name: 'New Category - test description',
    accountIndex: 5,           // use account #6
    category: CATEGORIES[10],  // index of the new category
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
];
```

### Step 4: Run

```bash
npm test
```

The new route is automatically picked up by `parallel-orders.spec.ts` and `smoke.spec.ts`.

---

## How to Add a New Test Section (e.g. Wishlist, Account Settings)

### Step 1: Create a page object

```bash
# Create a new page object for the feature
# File: page-objects/wishlist.page.ts
```

```ts
import { Page, Locator } from '@playwright/test';

export class WishlistPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/wishlist/');
  }

  async addItem(productName: string) {
    // Add selectors discovered from the site
  }
}
```

### Step 2: Create a test file

```bash
# Create test file in the appropriate directory
# File: tests/wishlist/wishlist.spec.ts
```

```ts
import { test, expect } from '../fixtures/base-test';
import { WishlistPage } from '../../page-objects/wishlist.page';

test.describe('Wishlist', () => {
  test('can add product to wishlist', async ({ page }) => {
    const wishlist = new WishlistPage(page);
    // ... test logic
  });
});
```

### Step 3: Run

```bash
npm test
# or just the new tests:
npx playwright test tests/wishlist/
```

---

## Selectors Reference

All selectors are in `page-objects/`. If the site's HTML changes, update selectors in ONE place.

### Age Gate (`age-gate.page.ts`)

| Element | Selector |
|---|---|
| Yes button | `button.age-gate__submit--yes` |
| No button | `button.age-gate__submit--no` |
| Remember me | `input.age-gate__remember-field` |
| Wrapper (to detect visibility) | `.age-gate__wrapper` |

### Login (`login.page.ts`)

| Element | Selector |
|---|---|
| Email / Client-ID | `#username` |
| Password | `#password` |
| Login button | `#login-submit-btn` |
| Forgot password email | `#forgot-email` |
| Reset password button | `#reset-password-btn` |
| Logged-in indicator | `.woocommerce-MyAccount-navigation` |
| Login error | `.woocommerce-error` |

### Shop / Product Listing (`shop.page.ts`)

| Element | Selector |
|---|---|
| All product cards | `li.product` |
| In-stock products | `li.product.instock` |
| Product title | `.woocommerce-loop-product__title` |
| Size swatch | `.swatch-item[data-value="5 g"]` |
| Disabled swatch (out of stock) | `.swatch-item.disabled` |
| Quantity input | `input.quantity` |
| Quantity minus button | `button.qty-minus` |
| Quantity plus button | `button.qty-plus` |
| Add to cart button | `.single_add_to_cart_button:not(.notify-me-button)` |
| Notify me (out of stock) | `button.notify-me-button` |
| Favourites heart | `.favouriteIcon` |

### Cart (`cart.page.ts`)

| Element | Selector |
|---|---|
| Cart items | `.woocommerce-cart-form .cart_item` |
| Remove item button | `.cart_item .remove, .cart_item a.remove` |
| Quantity input | `.cart_item input.qty` |
| Update cart button | `button[name="update_cart"]` |
| Cart subtotal | `.cart-subtotal .amount` |
| Proceed to checkout | `.checkout-button, a[href*="checkout"]` |
| Empty cart message | `.cart-empty, .wc-empty-cart-message` |

### Checkout (`checkout.page.ts`)

| Element | Selector |
|---|---|
| First name | `#billing_first_name` |
| Last name | `#billing_last_name` |
| Email | `#billing_email` |
| Phone | `#billing_phone` |
| Address | `#billing_address_1` |
| City | `#billing_city` |
| Postcode | `#billing_postcode` |
| Payment method radio | `#payment_method_{method_id}` |
| Place order button | `#place_order` |
| Order success URL pattern | `**/order-received/**` |
| Thank you message | `.woocommerce-thankyou-order-received` |

---

## NPM Scripts Reference

| Command | What it does |
|---|---|
| `npm test` | Run all tests with video recording (parallel workers = account count) |
| `npm run test:headed` | Same but with visible browser windows |
| `npm run test:smoke` | Smoke tests only (pages load, nav works) |
| `npm run test:orders` | Order flow tests only |
| `npm run test:parallel` | Force 10 parallel workers |
| `npm run test:debug` | Step-through debug mode |
| `npm run report` | Open the HTML report locally in browser |
| `npm run report:save` | Copy report to `reports-history/<timestamp>/` |
| `npm run report:upload` | Upload all reports to company website via rsync |
| `npm run trace` | Run tests with full trace recording |

---

## Reports & Sharing

### Workflow after each test run

```bash
npm test                  # Run tests (videos auto-recorded)
npm run report:save       # Save to reports-history/2026-02-07_14-30-00/
npm run report:upload     # Upload to company website
```

### What gets uploaded

```
https://yourcompany.com/e2e-reports/
├── index.html                         # Landing page listing ALL runs
├── 2026-02-07_14-30-00/index.html     # Full report with videos
├── 2026-02-08_09-15-22/index.html
└── ...
```

### Configure upload destination

Edit `scripts/upload-report.sh` and set:

```bash
REMOTE_USER="your-ssh-user"
REMOTE_HOST="yourcompany.com"
REMOTE_PATH="/var/www/html/e2e-reports"
```

---

## Architecture Decisions

| Decision | Why |
|---|---|
| **Page Object Model** | Selectors change often on WooCommerce — isolate them so one HTML change = one file fix |
| **Single data file** (`test-data.ts`) | Accounts, routes, and scenarios in one place — easy for any agent or dev to extend |
| **Auth setup as separate project** | Login runs once per account, cookies reused across all tests — saves time |
| **`fullyParallel: true`** | Each test gets its own isolated browser context — no shared state between tests |
| **Video always on** | Every test recorded — essential for debugging failures and sharing with QA team |
| **Trace on failure** | Full network + DOM + console captured when a test fails — but skipped on pass to save space |
| **Retry: 1** | WooCommerce is AJAX-heavy and can be flaky — one retry catches transient issues |

---

## WooCommerce-Specific Notes

- **Age Gate Plugin** (v3.7.2): Sets a cookie after confirming age. Auth setup saves this cookie so tests skip the popup.
- **Size Swatches**: Products use `.swatch-item` spans (not `<select>` dropdowns). Click the swatch, wait for price update.
- **Quantity Buttons**: Disabled when not logged in (`title="Log in to change quantity"`). Tests must authenticate first.
- **AJAX Cart**: After adding to cart or updating quantity, always `waitForLoadState('networkidle')`.
- **Select2 Dropdowns**: Country/state fields on checkout use Select2. May need special handling (click container, type search, click result).
- **Login Button**: Disabled by default (`#login-submit-btn`), enabled via JS after fields are filled. Tests use `force: true` click.
