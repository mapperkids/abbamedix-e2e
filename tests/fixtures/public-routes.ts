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
 * ============================================================
 * 10 PUBLIC BROWSING SCENARIOS — one per parallel session.
 * Each session takes a different path through the site.
 * No login needed. Tests page loads, data rendering, navigation.
 * ============================================================
 */
export const PUBLIC_SCENARIOS = [
  {
    name: 'Session 1: Homepage + About + Getting Started',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/getting-started/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0], // also browse Dried Flower
  },
  {
    name: 'Session 2: Homepage + Programs + Veterans',
    pages: [
      { path: '/', checkFor: 'nav#pr-nav' },
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1], // Edibles
  },
  {
    name: 'Session 3: Blog + Cannabis + Terpenes',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/terpenes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2], // Topicals
  },
  {
    name: 'Session 4: Learn pages - Methods + Capsules + CBD',
    pages: [
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
      { path: '/cbd/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3], // Extracts
  },
  {
    name: 'Session 5: Learn pages - Extracts + Oil + Edibles',
    pages: [
      { path: '/extracts/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/edibles/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4], // Vapes
  },
  {
    name: 'Session 6: Learn pages - Topicals + Vapes + Beverage',
    pages: [
      { path: '/topicals/', checkFor: '.elementor' },
      { path: '/vapes/', checkFor: '.elementor' },
      { path: '/beverage/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5], // Pre-Rolls
  },
  {
    name: 'Session 7: Contact + Login page + Cart',
    pages: [
      { path: '/contact-us/', checkFor: '.elementor, .wpcf7' },
      { path: '/my-account/', checkFor: '#username' },
      { path: '/cart/', checkFor: '.woocommerce' },
    ],
    category: PUBLIC_CATEGORIES[6], // Beverages
  },
  {
    name: 'Session 8: Full nav click-through top menu',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/contact-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7], // Concentrates
  },
  {
    name: 'Session 9: Homepage + deep product browse',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/blog/', checkFor: '.elementor, article' },
    ],
    category: PUBLIC_CATEGORIES[8], // Medical
  },
  {
    name: 'Session 10: All info pages rapid check',
    pages: [
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/methods-of-use/', checkFor: '.elementor' },
      { path: '/programs/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9], // Accessories
  },
  // ── Sessions 11-20: More browsing paths for 20-user concurrency test ──
  {
    name: 'Session 11: Veterans + Blog + CBD',
    pages: [
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/cbd/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[0], // Dried Flower
  },
  {
    name: 'Session 12: Getting Started + Terpenes + Oil',
    pages: [
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/terpenes/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[1], // Edibles
  },
  {
    name: 'Session 13: Programs + Capsules + Extracts',
    pages: [
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
      { path: '/extracts/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[2], // Topicals
  },
  {
    name: 'Session 14: About + Beverage + Vapes',
    pages: [
      { path: '/about-us/', checkFor: '.elementor' },
      { path: '/beverage/', checkFor: '.elementor' },
      { path: '/vapes/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[3], // Extracts
  },
  {
    name: 'Session 15: Contact + Cannabis + Methods',
    pages: [
      { path: '/contact-us/', checkFor: '.elementor, .wpcf7' },
      { path: '/cannabis/', checkFor: '.elementor' },
      { path: '/methods-of-use/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[4], // Vapes
  },
  {
    name: 'Session 16: Homepage + Edibles + Topicals',
    pages: [
      { path: '/', checkFor: '.custom-logo' },
      { path: '/edibles/', checkFor: '.elementor' },
      { path: '/topicals/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[5], // Pre-Rolls
  },
  {
    name: 'Session 17: Blog + Cart + Login page',
    pages: [
      { path: '/blog/', checkFor: '.elementor, article' },
      { path: '/cart/', checkFor: '.woocommerce' },
      { path: '/my-account/', checkFor: '#username' },
    ],
    category: PUBLIC_CATEGORIES[6], // Beverages
  },
  {
    name: 'Session 18: CBD + Oil + Capsules deep browse',
    pages: [
      { path: '/cbd/', checkFor: '.elementor' },
      { path: '/cannabis-oil/', checkFor: '.elementor' },
      { path: '/capsules/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[7], // Concentrates
  },
  {
    name: 'Session 19: Getting Started + Programs + Veterans',
    pages: [
      { path: '/getting-started/', checkFor: '.elementor' },
      { path: '/programs/', checkFor: '.elementor' },
      { path: '/coverage-for-veterans/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[8], // Medical
  },
  {
    name: 'Session 20: Full info pages reverse order',
    pages: [
      { path: '/beverage/', checkFor: '.elementor' },
      { path: '/terpenes/', checkFor: '.elementor' },
      { path: '/about-us/', checkFor: '.elementor' },
    ],
    category: PUBLIC_CATEGORIES[9], // Accessories
  },
];
