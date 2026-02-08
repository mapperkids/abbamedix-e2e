/**
 * ============================================================
 * PUBLIC ROUTES — No login required.
 * These are all the pages/sections testable without an account.
 * To add more: just add another object to the array.
 * ============================================================
 */

export const PUBLIC_PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'About Us', path: '/about-us/' },
  { name: 'Getting Started', path: '/getting-started/' },
  { name: 'Coverage for Veterans', path: '/coverage-for-veterans/' },
  { name: 'Programs', path: '/programs/' },
  { name: 'Contact Us', path: '/contact-us/' },
  { name: 'Blog', path: '/blog/' },
  { name: 'Cannabis Info', path: '/cannabis/' },
  { name: 'Terpenes Info', path: '/terpenes/' },
  { name: 'Methods of Use', path: '/methods-of-use/' },
  { name: 'Capsules Info', path: '/capsules/' },
  { name: 'CBD Info', path: '/cbd/' },
  { name: 'Extracts Info', path: '/extracts/' },
  { name: 'Cannabis Oil Info', path: '/cannabis-oil/' },
  { name: 'Edibles Info', path: '/edibles/' },
  { name: 'Topicals Info', path: '/topicals/' },
  { name: 'Vapes Info', path: '/vapes/' },
  { name: 'Beverage Info', path: '/beverage/' },
  { name: 'My Account (login page)', path: '/my-account/' },
  { name: 'Cart (empty)', path: '/cart/' },
];

export const PUBLIC_CATEGORIES = [
  { name: 'Dried Flower', path: '/product-filter/dried-flower-dried-flower' },
  { name: 'Edibles', path: '/product-filter/edibles-edibles' },
  { name: 'Topicals', path: '/product-filter/topical~topicals-topicals' },
  { name: 'Extracts', path: '/product-filter/capsules~extracts-extracts~oil~sublingual-strips' },
  { name: 'Vapes', path: '/product-filter/vapes-vapes' },
  { name: 'Pre-Rolls', path: '/product-filter/pre-rolls-pre-rolls' },
  { name: 'Beverages', path: '/product-filter/beverages-beverages' },
  { name: 'Concentrates', path: '/product-filter/concentrates-concentrates' },
  { name: 'Medical', path: '/product-filter/inhaler~suppository' },
  { name: 'Accessories', path: '/product-filter/accessories-accessories' },
];

/**
 * Filter actions the test can perform on a category page.
 * Each session gets a different filter combo for variety.
 *
 * Types:
 *   - thc:     set THC range slider (min, max)
 *   - cbd:     set CBD range slider (min, max)
 *   - strain:  click a strain checkbox label
 *   - size:    click a size checkbox label
 *   - brand:   click a brand checkbox label
 *   - sort:    select a sort option from dropdown
 *   - search:  type a search term on the homepage
 */
export type FilterAction =
  | { type: 'thc'; min: number; max: number }
  | { type: 'cbd'; min: number; max: number }
  | { type: 'strain'; value: string }
  | { type: 'size'; value: string }
  | { type: 'brand'; value: string }
  | { type: 'sort'; value: string }
  | { type: 'search'; term: string };

export interface PublicScenario {
  name: string;
  pages: { path: string; checkFor: string }[];
  category: { name: string; path: string };
  filters?: FilterAction[];
  search?: string; // Search term to use on homepage
}

/**
 * ============================================================
 * 50 PUBLIC BROWSING SCENARIOS — one per parallel session.
 * Each session takes a different path through the site,
 * browses a product category, applies filters, and some
 * sessions also test homepage search.
 *
 * Every category is covered multiple times.
 * ============================================================
 */
export const PUBLIC_SCENARIOS: PublicScenario[] = [
  // ── Sessions 1-10: Core browsing + filters ──
  {
    name: 'Session 1: Homepage + About + Dried Flower (THC filter)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/getting-started/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0],
    filters: [
      { type: 'thc', min: 10, max: 30 },
      { type: 'sort', value: 'price' },
    ],
  },
  {
    name: 'Session 2: Programs + Veterans + Edibles (Strain filter)',
    pages: [
      { path: '/', checkFor: 'nav#pr-nav' },
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1],
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  {
    name: 'Session 3: Blog + Cannabis + Topicals (CBD filter)',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/terpenes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2],
    filters: [
      { type: 'cbd', min: 0, max: 50 },
    ],
  },
  {
    name: 'Session 4: Methods + Capsules + Extracts (Sort by latest)',
    pages: [
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
      { path: '/cbd/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3],
    filters: [
      { type: 'sort', value: 'date' },
    ],
  },
  {
    name: 'Session 5: Learn Extracts + Vapes (THC + Sort)',
    pages: [
      { path: '/extracts/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/edibles/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4],
    filters: [
      { type: 'thc', min: 5, max: 40 },
      { type: 'sort', value: 'price-desc' },
    ],
  },
  {
    name: 'Session 6: Topicals + Vapes + Pre-Rolls (Sort popularity)',
    pages: [
      { path: '/topicals/', checkFor: '.elementor' },
      { path: '/vapes/', checkFor: '.elementor' },
      { path: '/beverage/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  {
    name: 'Session 7: Contact + Login + Beverages (CBD filter)',
    pages: [
      { path: '/contact-us/', checkFor: '.elementor, .wpcf7' },
      { path: '/my-account/', checkFor: '#username' },
      { path: '/cart/', checkFor: '.woocommerce' },
    ],
    category: PUBLIC_CATEGORIES[6],
    filters: [
      { type: 'cbd', min: 0, max: 30 },
    ],
  },
  {
    name: 'Session 8: Nav click-through + Concentrates (Sort price)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/contact-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7],
    filters: [
      { type: 'sort', value: 'price' },
    ],
  },
  {
    name: 'Session 9: Deep browse + Medical (THC filter)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/blog/', checkFor: '.elementor, article' },
    ],
    category: PUBLIC_CATEGORIES[8],
    filters: [
      { type: 'thc', min: 0, max: 20 },
    ],
  },
  {
    name: 'Session 10: Info pages + Accessories (Sort latest)',
    pages: [
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/programs/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9],
    filters: [
      { type: 'sort', value: 'date' },
    ],
  },
  // ── Sessions 11-13: SEARCH TESTS ──
  {
    name: 'Session 11: Search "flowers" + Dried Flower browse',
    pages: [
      { path: '/about-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0],
    search: 'flowers',
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  {
    name: 'Session 12: Search "preroll" + Pre-Rolls browse',
    pages: [
      { path: '/cannabis/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    search: 'preroll',
    filters: [
      { type: 'thc', min: 5, max: 25 },
    ],
  },
  {
    name: 'Session 13: Search "strawberry" + Edibles browse',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
    ],
    category: PUBLIC_CATEGORIES[1],
    search: 'strawberry',
    filters: [
      { type: 'sort', value: 'price' },
    ],
  },
  // ── Sessions 14-20: More category coverage + filters ──
  {
    name: 'Session 14: About + Beverage + Vapes (THC range)',
    pages: [
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/beverage/', checkFor: '.elementor' },
      { path: '/vapes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4],
    filters: [
      { type: 'thc', min: 15, max: 45 },
    ],
  },
  {
    name: 'Session 15: Contact + Cannabis + Extracts (CBD)',
    pages: [
      { path: '/contact-us/', checkFor: '.elementor, .wpcf7' },
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/methods-of-use/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3],
    filters: [
      { type: 'cbd', min: 5, max: 40 },
    ],
  },
  {
    name: 'Session 16: Homepage + Edibles + Pre-Rolls (Sort)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/edibles/', checkFor: '.elementor' },
      { path: '/topicals/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    filters: [
      { type: 'sort', value: 'rating' },
    ],
  },
  {
    name: 'Session 17: Blog + Cart + Beverages (THC)',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/cart/', checkFor: '.woocommerce' },
      { path: '/my-account/', checkFor: '#username' },
    ],
    category: PUBLIC_CATEGORIES[6],
    filters: [
      { type: 'thc', min: 0, max: 10 },
    ],
  },
  {
    name: 'Session 18: CBD + Oil + Concentrates (Sort price high)',
    pages: [
      { path: '/cbd/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7],
    filters: [
      { type: 'sort', value: 'price-desc' },
    ],
  },
  {
    name: 'Session 19: Getting Started + Medical (CBD range)',
    pages: [
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[8],
    filters: [
      { type: 'cbd', min: 0, max: 60 },
    ],
  },
  {
    name: 'Session 20: Info pages + Accessories (Sort popularity)',
    pages: [
      { path: '/beverage/', checkFor: '.elementor' },
      { path: '/terpenes/', checkFor: '.elementor' },
      { path: '/about-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9],
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  // ── Sessions 21-30: All categories round 3 + varied filters ──
  {
    name: 'Session 21: Homepage + Cannabis + Dried Flower (CBD)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/cannabis/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0],
    filters: [
      { type: 'cbd', min: 0, max: 20 },
      { type: 'sort', value: 'price' },
    ],
  },
  {
    name: 'Session 22: Blog + Vapes + Edibles (THC range)',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/vapes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1],
    filters: [
      { type: 'thc', min: 0, max: 15 },
    ],
  },
  {
    name: 'Session 23: Terpenes + Topicals (Sort latest)',
    pages: [
      { path: '/terpenes/', checkFor: '.elementor' },
      { path: '/edibles/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2],
    filters: [
      { type: 'sort', value: 'date' },
    ],
  },
  {
    name: 'Session 24: Methods + Extracts (THC + CBD)',
    pages: [
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/cbd/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3],
    filters: [
      { type: 'thc', min: 5, max: 35 },
    ],
  },
  {
    name: 'Session 25: Oil + Capsules + Vapes (Sort price high)',
    pages: [
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4],
    filters: [
      { type: 'sort', value: 'price-desc' },
    ],
  },
  {
    name: 'Session 26: Homepage + Pre-Rolls (THC filter)',
    pages: [
      { path: '/', checkFor: 'nav#pr-nav' },
      { path: '/beverage/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    filters: [
      { type: 'thc', min: 10, max: 30 },
    ],
  },
  {
    name: 'Session 27: Getting Started + Beverages (CBD)',
    pages: [
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/topicals/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[6],
    filters: [
      { type: 'cbd', min: 0, max: 25 },
    ],
  },
  {
    name: 'Session 28: Login page + Concentrates (Sort rating)',
    pages: [
      { path: '/my-account/', checkFor: '#username' },
      { path: '/cannabis/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7],
    filters: [
      { type: 'sort', value: 'rating' },
    ],
  },
  {
    name: 'Session 29: Programs + Medical (THC)',
    pages: [
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/vapes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[8],
    filters: [
      { type: 'thc', min: 0, max: 50 },
    ],
  },
  {
    name: 'Session 30: Veterans + Accessories (Sort price)',
    pages: [
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
      { path: '/edibles/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9],
    filters: [
      { type: 'sort', value: 'price' },
    ],
  },
  // ── Sessions 31-40: All categories round 4 + different filters ──
  {
    name: 'Session 31: About + Cart + Dried Flower (Sort popularity)',
    pages: [
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/cart/', checkFor: '.woocommerce' },
    ],
    category: PUBLIC_CATEGORIES[0],
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  {
    name: 'Session 32: Capsules + Edibles (THC low range)',
    pages: [
      { path: '/capsules/', checkFor: '.elementor' },
      { path: '/beverage/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1],
    filters: [
      { type: 'thc', min: 0, max: 10 },
    ],
  },
  {
    name: 'Session 33: Contact + Topicals (Sort latest)',
    pages: [
      { path: '/contact-us/', checkFor: '.elementor, .wpcf7' },
      { path: '/extracts/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2],
    filters: [
      { type: 'sort', value: 'date' },
    ],
  },
  {
    name: 'Session 34: Blog + Extracts (CBD range)',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/topicals/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3],
    filters: [
      { type: 'cbd', min: 10, max: 50 },
    ],
  },
  {
    name: 'Session 35: Homepage + Vapes (THC high range)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/programs/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4],
    filters: [
      { type: 'thc', min: 20, max: 45 },
    ],
  },
  {
    name: 'Session 36: Vapes info + Pre-Rolls (Sort price)',
    pages: [
      { path: '/vapes/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    filters: [
      { type: 'sort', value: 'price' },
    ],
  },
  {
    name: 'Session 37: Methods + Beverages (THC)',
    pages: [
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/about-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[6],
    filters: [
      { type: 'thc', min: 5, max: 20 },
    ],
  },
  {
    name: 'Session 38: Edibles info + Concentrates (Sort rating)',
    pages: [
      { path: '/edibles/', checkFor: '.elementor' },
      { path: '/cbd/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7],
    filters: [
      { type: 'sort', value: 'rating' },
    ],
  },
  {
    name: 'Session 39: Beverage info + Medical (CBD)',
    pages: [
      { path: '/beverage/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[8],
    filters: [
      { type: 'cbd', min: 0, max: 40 },
    ],
  },
  {
    name: 'Session 40: Terpenes + Accessories (Sort popularity)',
    pages: [
      { path: '/terpenes/', checkFor: '.elementor' },
      { path: '/extracts/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9],
    filters: [
      { type: 'sort', value: 'popularity' },
    ],
  },
  // ── Sessions 41-50: All categories round 5 + mixed filters ──
  {
    name: 'Session 41: Getting Started + Dried Flower (Sort + THC)',
    pages: [
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/cannabis/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0],
    filters: [
      { type: 'thc', min: 15, max: 40 },
      { type: 'sort', value: 'date' },
    ],
  },
  {
    name: 'Session 42: Topicals info + Edibles (CBD + Sort)',
    pages: [
      { path: '/topicals/', checkFor: '.elementor' },
      { path: '/programs/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1],
    filters: [
      { type: 'cbd', min: 0, max: 35 },
      { type: 'sort', value: 'price-desc' },
    ],
  },
  {
    name: 'Session 43: Cart + Veterans + Topicals (THC)',
    pages: [
      { path: '/cart/', checkFor: '.woocommerce' },
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2],
    filters: [
      { type: 'thc', min: 0, max: 25 },
    ],
  },
  {
    name: 'Session 44: About + Extracts (Sort price high)',
    pages: [
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/edibles/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3],
    filters: [
      { type: 'sort', value: 'price-desc' },
    ],
  },
  {
    name: 'Session 45: CBD info + Vapes (THC + Sort)',
    pages: [
      { path: '/cbd/', checkFor: '.elementor' },
      { path: '/blog/', checkFor: '.elementor, article' },
    ],
    category: PUBLIC_CATEGORIES[4],
    filters: [
      { type: 'thc', min: 10, max: 35 },
      { type: 'sort', value: 'popularity' },
    ],
  },
  {
    name: 'Session 46: Homepage + Pre-Rolls (CBD filter)',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/terpenes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5],
    filters: [
      { type: 'cbd', min: 0, max: 15 },
    ],
  },
  {
    name: 'Session 47: Extracts info + Beverages (Sort latest)',
    pages: [
      { path: '/extracts/', checkFor: '.elementor' },
      { path: '/getting-started/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[6],
    filters: [
      { type: 'sort', value: 'date' },
    ],
  },
  {
    name: 'Session 48: Login + Concentrates (THC high)',
    pages: [
      { path: '/my-account/', checkFor: '#username' },
      { path: '/vapes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7],
    filters: [
      { type: 'thc', min: 25, max: 45 },
    ],
  },
  {
    name: 'Session 49: Oil info + Medical (Sort price)',
    pages: [
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/about-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[8],
    filters: [
      { type: 'sort', value: 'price' },
    ],
  },
  {
    name: 'Session 50: Veterans + Accessories (THC + CBD)',
    pages: [
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
      { path: '/', checkFor: '.custom-logo' },
    ],
    category: PUBLIC_CATEGORIES[9],
    filters: [
      { type: 'thc', min: 0, max: 30 },
    ],
  },
];
