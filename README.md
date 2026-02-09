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

### DONE: Account Profile & Card Tests (10 concurrent users)

- **10 authenticated sessions** across 10 GitHub Actions machines (10 shards x 1 worker)
- Each account: login → profile → order history → manage cards → add card → logout
- **Moneris HPP iframe** card entry handled (cross-origin iframe with `esqa.moneris.com`)
- Test card: Visa 4242 4242 4242 4242, exp 12/28, CVC 123
- 10 unique billing addresses (Alice Anderson through Jack Johnson, Canadian postal codes)
- Every session records **video** of the full user journey
- HTML report with embedded videos uploaded to `https://groiq.ca/e2e/10-accounts/index.html`
- Workflow: `.github/workflows/e2e-account.yml` (manual trigger via GitHub UI)

### TODO: Order Flow Tests

- Test specs are **scaffolded and ready** in `tests/orders/`
- Page objects for login, shop, cart, checkout are **already built**
- `tests/fixtures/test-data.ts` now has **real account credentials** (10 client-ids)
- Account profile & card tests serve as prerequisite validation
- Next: implement full add-to-cart → checkout → payment → order confirmation flow

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run public browsing tests locally (10 sessions)
npm run test:public

# 4. Run account profile & card test locally (1 account)
npx playwright test --project=account --workers=1 --shard=1/10

# 5. Trigger full concurrent runs on GitHub Actions
# Go to: https://github.com/mapperkids/abbamedix-e2e/actions
# - "E2E Public Browsing (50 concurrent users)" > "Run workflow"
# - "E2E Account Profile & Card (10 concurrent users)" > "Run workflow"
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
│       ├── e2e-public.yml         # GitHub Actions: 10 shards x 5 workers = 50 users
│       └── e2e-account.yml        # GitHub Actions: 10 shards x 1 worker = 10 accounts
│
├── tests/
│   ├── fixtures/
│   │   ├── test-data.ts           # Test accounts (client-ids), categories, card data, order scenarios
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
│   ├── account/
│   │   └── profile-card.spec.ts         # 10 accounts: login, profile, orders, add card, logout
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
│   ├── nav.page.ts                # Top navigation, cart icon, account icon
│   └── profile.page.ts            # My profile, manage cards, Moneris iframe card entry
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

## GitHub Actions: 10 Concurrent Account Sessions

The workflow at `.github/workflows/e2e-account.yml` runs on `workflow_dispatch` (manual trigger).

**How it works:**
1. **10 parallel GitHub Actions runners** each get one shard (1/10 through 10/10)
2. Each runner launches **1 Chromium browser** (`--workers=1`) — one account per VM
3. Total: **10 simultaneous authenticated sessions from 10 different machines/IPs**
4. Each session uses `--reporter=blob` for later merging
5. After all 10 shards finish, `merge-reports` job merges into one HTML report
6. Videos are embedded in the report automatically (uses `{ page }` fixture)
7. Report is uploaded via FTP to `groiq.ca/e2e/10-accounts/`

**Test flow per account:**
1. Homepage + age gate
2. Login with client-id (`#username` field) + password
3. View profile — verify "ACCOUNT STATUS" visible
4. Hover account icon → click "MY ORDERS" → verify order history
5. Go to manage cards → click "ADD NEW CARD"
6. Fill billing info (unique name/address per account)
7. Fill card details in **Moneris HPP iframe** (Card number, MM/YY, CVC)
8. Click "SAVE CARD" → verify "Card saved successfully!"
9. Hover account icon → click "LOGOUT" → verify logged out

**Re-run anytime:**
```bash
# Trigger via GitHub Actions UI:
# https://github.com/mapperkids/abbamedix-e2e/actions
# Click "E2E Account Profile & Card (10 concurrent users)" > "Run workflow"

# Or test a single account locally:
npx playwright test --project=account --workers=1 --shard=1/10
```

**10 Test Accounts:**

| # | Client ID | Billing Name |
|---|-----------|-------------|
| 1 | 2246-3594-5067-6181 | Alice Anderson |
| 2 | 6624-6029-3419-7992 | Bob Baker |
| 3 | 9766-3751-4801-3208 | Carol Carter |
| 4 | 9281-7590-3959-9291 | David Davis |
| 5 | 3879-3132-5322-0516 | Eve Edwards |
| 6 | 6049-9580-9576-5153 | Frank Fisher |
| 7 | 9388-7517-1232-3269 | Grace Garcia |
| 8 | 7067-2719-0010-1968 | Henry Hughes |
| 9 | 7650-1889-1132-9212 | Irene Irving |
| 10 | 2969-6953-7775-7863 | Jack Johnson |

All accounts use password `WCSandbox321`. Test card: Visa `4242424242424242`, exp `12/28`, CVC `123`.

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

Reports are uploaded to **groiq.ca/e2e/** via FTP (auto-uploaded by GitHub Actions workflows):

| Report | URL | Workflow |
|--------|-----|----------|
| 50-user public browsing | `https://groiq.ca/e2e/50-users/index.html` | `e2e-public.yml` |
| 10-account profile & card | `https://groiq.ca/e2e/10-accounts/index.html` | `e2e-account.yml` |

FTP: Host `groiq.ca`, User `wilcompute`. Each workflow uploads to its own directory — they don't overwrite each other.

---

## Next Steps: Order Flow Tests

Accounts are now validated (login, profile, card management all working). Next phase:

### What's needed
1. **Implement full order flow**: add-to-cart → cart → checkout → payment → order confirmation
2. **Verify checkout selectors**: Payment method, billing form on checkout page may differ from manage-card page
3. **Handle Moneris on checkout**: Same HPP iframe pattern as card management — `profile.page.ts` has the working approach

### Key selectors already known
- **Login**: `#username` (accepts client-id), `#password`, `#login-submit-btn`
- **Account icon**: `.header-profile > .menu-item` (hover for dropdown)
- **Card iframe**: `iframe[src*="moneris.com"]` — inputs are `input.monerisInput`, `#monerisExpInput`
- **Size swatches**: `.swatch-item` spans (click, wait for price update)
- **Cart**: AJAX-heavy — always `waitForLoadState('networkidle')` after actions

### Run order tests
```bash
# Locally
npm run test:orders

# On GitHub Actions (needs new workflow, similar to e2e-account.yml)
```

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
| **Moneris card fields in iframe** | Card number/expiry/CVC are inside `iframe[src*="moneris.com"]`. Use `frame.fill()` via `elementHandle().contentFrame()`. `page.fill()` and `page.locator().fill()` silently fail. |
| **Nav account icon matches 4 elements** | Use `.header-profile > .menu-item` (not `a[href*="my-account"]` which matches dropdown links too). |
| **Logout redirects to homepage** | Don't assert `#username` visible after logout — check URL instead. |

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
| `npm run test:orders` | Order flow tests only |
| `npm run test:public` | Public browsing tests (10 local workers) |
| `npm run test:account` | Account profile & card tests (10 local workers) |
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
| **Test accounts** | 10 client-ids in `test-data.ts`, password `WCSandbox321`, test card Visa `4242424242424242` |
