# Abba Medix E2E Tests

Playwright E2E test suite for the Abba Medix WooCommerce cannabis e-commerce site at `https://shop-abbamedix.sandbox.onample.com`.

---

## Current Status (Feb 2026)

### DONE: Public Browsing Tests (50 concurrent users)

- **50 browsing sessions** across 10 GitHub Actions machines (10 shards x 5 workers)
- All **10 product categories** covered (5 sessions per category)
- **Product filters** tested: THC range slider, CBD range slider, sort order, strain/brand/size checkboxes
- **Homepage search** tested with terms: "flowers", "preroll", "strawberry"
- Every session records **video** of the full user journey
- HTML report with embedded videos uploaded to `https://groiq.ca/e2e/50-users/index.html`
- Workflow: `.github/workflows/e2e-public.yml` (manual trigger via GitHub UI)
- **Last successful run**: All 50 sessions passed (Run ID: 21792016730)

### TODO: Order Flow Tests (needs 10 test accounts)

- Test specs are **scaffolded and ready** in `tests/orders/`
- Page objects for login, shop, cart, checkout are **already built**
- `tests/fixtures/test-data.ts` has **placeholder accounts** (email/password = CHANGE_ME)
- **Waiting for**: 10 real test account credentials from the client
- Once accounts are provided, update `test-data.ts` and the order tests should work
- See "Next Steps for Order Tests" section below

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run public browsing tests locally (10 sessions)
npm run test:public

# 4. Or trigger 50-user run on GitHub Actions
# Go to: https://github.com/mapperkids/abbamedix-e2e/actions
# Click "E2E Public Browsing (50 concurrent users)" > "Run workflow"
```

---

## Project Structure

```
abbamedix-e2e/
├── playwright.config.ts           # Main config: video, user-agent, BrowserStack, projects
├── package.json                   # Scripts: test:public, test:orders, report:upload
├── .env                           # BrowserStack credentials (gitignored)
├── .github/
│   └── workflows/
│       └── e2e-public.yml         # GitHub Actions: 10 shards x 5 workers = 50 users
│
├── tests/
│   ├── fixtures/
│   │   ├── test-data.ts           # Test accounts, categories, order scenarios
│   │   ├── public-routes.ts       # 50 public browsing scenarios with filters + search
│   │   ├── auth.setup.ts          # Logs in each account, saves cookies
│   │   └── base-test.ts           # Custom test fixture (handles auth)
│   │
│   ├── public/
│   │   └── public-browse.spec.ts  # 50 browsing sessions with filter + search logic
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
│   ├── age-gate.page.ts           # Age gate popup (currently DISABLED on site)
│   ├── login.page.ts              # /my-account/ login form
│   ├── shop.page.ts               # Product listing, size swatches, add to cart
│   ├── cart.page.ts               # Cart items, remove, update qty, checkout button
│   ├── checkout.page.ts           # Billing form, payment method, place order
│   └── nav.page.ts                # Top navigation, cart icon, account icon
│
├── scripts/
│   ├── browserstack-report.ts     # Pull BrowserStack results + generate HTML report
│   ├── save-report.sh             # Saves report to reports-history/<timestamp>/
│   └── upload-report.sh           # Upload reports to company server
│
├── auth-states/                   # Auto-generated: saved login cookies per account
├── test-results/                  # Auto-generated: videos, screenshots, traces
├── playwright-report/             # Auto-generated: HTML report after each run
└── reports-history/               # Timestamped archive of past reports
```

---

## GitHub Actions: 50 Concurrent Users

The workflow at `.github/workflows/e2e-public.yml` runs on `workflow_dispatch` (manual trigger).

**How it works:**
1. **10 parallel GitHub Actions runners** each get a shard (1/10 through 10/10)
2. Each runner launches **5 Chromium browsers** (`--workers=5`)
3. Total: **50 simultaneous browser sessions from 10 different machines/IPs**
4. Each session uses `--reporter=blob` for later merging
5. After all 10 shards finish, `merge-reports` job combines everything into one HTML report
6. Videos are bundled into the report artifact

**Artifacts produced:**
- `e2e-full-report-with-videos` — HTML report with embedded session videos
- `e2e-all-videos` — All 50 video recordings separately
- `blob-report-shard-{1-10}` — Raw blob reports per shard
- `test-results-shard-{1-10}` — Raw test results per shard

**GitHub repo:** `https://github.com/mapperkids/abbamedix-e2e`
- Push uses HTTPS + personal access token (SSH key is linked to a different account)
- Token needs `workflow` scope to push `.github/workflows/` changes

---

## Public Browsing Test Details

### What Each Session Does

Each of the 50 sessions follows this journey:
1. **Land on homepage** and scroll
2. **Search for a product** (sessions 11-13 search "flowers", "preroll", "strawberry")
3. **Visit 2 content pages** (About Us, Blog, Cannabis Info, etc.)
4. **Browse a product category** (one of 10 categories)
5. **Apply filters** — THC range, CBD range, sort order, strain/brand/size checkboxes
6. **Hover over products** in the grid
7. **Click into a product detail page**, scroll through details, try size swatches
8. **Go back to category**, click a second product
9. **Return to homepage**

### Filter Selectors (Amplefilter plugin)

| Filter | Selector |
|--------|----------|
| THC min input | `#thc-dual-range-min-input` |
| THC max input | `#thc-dual-range-max-input` |
| THC apply button | `button.ample-dual-range-apply[data-slider="thc-dual-range"]` |
| CBD min input | `#cbd-dual-range-min-input` |
| CBD max input | `#cbd-dual-range-max-input` |
| CBD apply button | `button.ample-dual-range-apply[data-slider="cbd-dual-range"]` |
| Sort dropdown | `select.orderby` or `.orderby` |
| Strain/Brand/Size | Text labels clicked directly (e.g., `text="Indica"`) |
| Search input | `input.e-search-input[name="s"]` |
| Search submit | `button.e-search-submit` |

### Categories (all 10 covered)

| Category | Path | Sessions |
|----------|------|----------|
| Dried Flower | `/product-filter/dried-flower-dried-flower` | 1,11,21,31,41 |
| Edibles | `/product-filter/edibles-edibles` | 2,12,22,32,42 |
| Topicals | `/product-filter/topical~topicals-topicals` | 3,13,23,33,43 |
| Extracts | `/product-filter/capsules~extracts-extracts~oil~sublingual-strips` | 4,14,24,34,44 |
| Vapes | `/product-filter/vapes-vapes` | 5,15,25,35,45 |
| Pre-Rolls | `/product-filter/pre-rolls-pre-rolls` | 6,16,26,36,46 |
| Beverages | `/product-filter/beverages-beverages` | 7,17,27,37,47 |
| Concentrates | `/product-filter/concentrates-concentrates` | 8,18,28,38,48 |
| Medical | `/product-filter/inhaler~suppository` | 9,19,29,39,49 |
| Accessories | `/product-filter/accessories-accessories` | 10,20,30,40,50 |

---

## BrowserStack Integration (Optional)

Configured but not primary. Free plan only allows 5 parallel sessions.

```bash
# Set credentials in .env (see .env.example)
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key

# Run on BrowserStack
npm run test:browserstack
```

---

## Report Hosting

Reports are uploaded to **groiq.ca/e2e/** via FTP:
- FTP credentials stored locally (ask team lead)
- 20-user report: `https://groiq.ca/e2e/index.html`
- 50-user report: `https://groiq.ca/e2e/50-users/index.html`

---

## Next Steps for Order Tests

When the client provides 10 test account credentials:

### 1. Update test accounts

Edit `tests/fixtures/test-data.ts`:

```ts
export const TEST_ACCOUNTS = [
  { email: 'real-account1@example.com', password: 'real-password1' },
  { email: 'real-account2@example.com', password: 'real-password2' },
  // ... all 10 accounts
];
```

### 2. Verify selectors

The page objects in `page-objects/` have selectors based on site inspection, but the order flow (add-to-cart, cart, checkout) needs live testing with a logged-in account. Key things to verify:

- **Age gate**: Currently disabled on site. If re-enabled, `age-gate.page.ts` handles it.
- **Login form**: `#username`, `#password`, `#login-submit-btn` — login button is disabled by default, enabled via JS.
- **Add to cart**: Size swatches use `.swatch-item` spans. Quantity buttons may be disabled for non-logged-in users.
- **Cart page**: AJAX updates — always use `waitForLoadState` after actions.
- **Checkout**: May use Select2 for country/state dropdowns. Payment method selectors need verification.

### 3. Run order tests

```bash
# Run order flow tests locally
npm run test:orders

# Or all tests including auth
npm test
```

### 4. Create GitHub Actions workflow for order tests

Similar to `e2e-public.yml` but with stored credentials (GitHub Secrets) and fewer shards (10 sessions = 2 shards x 5 workers).

---

## Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| **Cloudflare blocks HeadlessChrome** | Real Chrome user-agent set in `playwright.config.ts` |
| **`page.goto('/')` times out** | Use `{ waitUntil: 'domcontentloaded' }` — third-party scripts (Klaviyo, Weglot) keep `load` event pending |
| **Navigation clicks timeout** | Wrap with `Promise.all([page.waitForLoadState('domcontentloaded'), element.click()])` |
| **Local machine can't handle 10+ Chromium instances** | Use GitHub Actions (10 machines) instead of local. Local i5/20GB/WSL2 causes flaky failures. |
| **SSH push denied (raymondlee-groweriq)** | SSH key linked to different GitHub account. Use HTTPS + personal access token instead. |
| **GitHub token needs `workflow` scope** | First token was missing this scope. Regenerate with `workflow` scope if push fails. |
| **Age gate popup** | Currently disabled on site. `age-gate.page.ts` exists if re-enabled. |

---

## WooCommerce-Specific Notes

- **Age Gate Plugin** (v3.7.2): Currently disabled. Sets a cookie after confirming age.
- **Size Swatches**: Products use `.swatch-item` spans (not `<select>` dropdowns). Click the swatch, wait for price update.
- **Quantity Buttons**: May be disabled when not logged in (`title="Log in to change quantity"`).
- **AJAX Cart**: After adding to cart or updating quantity, use `waitForLoadState('domcontentloaded')`.
- **Select2 Dropdowns**: Country/state fields on checkout use Select2. Need click container > type > click result.
- **Login Button**: `#login-submit-btn` disabled by default, enabled via JS. Tests use `force: true` click.
- **Amplefilter Plugin**: Provides THC/CBD dual-range sliders, strain/brand/size checkboxes on product category pages.
- **Elementor**: Page builder used for content pages. Search box uses `.e-search-input` and `.e-search-submit`.

---

## Architecture Decisions

| Decision | Why |
|----------|-----|
| **Page Object Model** | Selectors change often on WooCommerce — isolate them so one HTML change = one file fix |
| **Single data file** (`test-data.ts`) | Accounts, routes, and scenarios in one place — easy for any agent or dev to extend |
| **Separate public-routes.ts** | 50 browsing scenarios with filter configs separated from auth-required test data |
| **GitHub Actions for concurrency** | Free, 10+ parallel machines with different IPs — truly simulates concurrent users |
| **`domcontentloaded` wait strategy** | Third-party scripts (Klaviyo, Weglot) prevent `load` event — `domcontentloaded` is reliable |
| **Real Chrome user-agent** | Cloudflare Enterprise blocks default HeadlessChrome user-agent |
| **Auth setup as separate project** | Login runs once per account, cookies reused across all tests |
| **`fullyParallel: true`** | Each test gets its own isolated browser context — no shared state |
| **Video always on** | Every test recorded — essential for debugging and management review |
| **Trace on failure** | Full network + DOM + console captured on failure — skipped on pass to save space |
| **Retry: 1** | WooCommerce is AJAX-heavy and can be flaky — one retry catches transient issues |
| **Blob reporter for shards** | Required by Playwright for merging reports from multiple machines |

---

## NPM Scripts Reference

| Command | What it does |
|---------|-------------|
| `npm test` | Run all tests (parallel workers = account count) |
| `npm run test:headed` | Same but with visible browser windows |
| `npm run test:smoke` | Smoke tests only (pages load, nav works) |
| `npm run test:orders` | Order flow tests only (needs real accounts) |
| `npm run test:public` | Public browsing tests (10 local workers) |
| `npm run test:browserstack` | Run on BrowserStack cloud browsers |
| `npm run test:parallel` | Force 10 parallel workers |
| `npm run test:debug` | Step-through debug mode |
| `npm run report` | Open the HTML report locally |
| `npm run report:save` | Copy report to `reports-history/<timestamp>/` |
| `npm run report:upload` | Upload to company server via rsync |
| `npm run report:browserstack` | Generate BrowserStack HTML report |
| `npm run trace` | Run tests with full trace recording |

---

## Credentials & Access

| Service | Details |
|---------|---------|
| **GitHub repo** | `mapperkids/abbamedix-e2e` |
| **GitHub push** | HTTPS + personal access token (needs `workflow` scope). See `.env` or ask team lead. |
| **BrowserStack** | Credentials in `.env` file (gitignored) |
| **FTP (report hosting)** | Host: `groiq.ca`, Path: `/e2e/`. Credentials stored locally. |
| **Target site** | `https://shop-abbamedix.sandbox.onample.com` |
| **Test accounts** | 10 placeholder accounts in `test-data.ts` — awaiting real credentials |
