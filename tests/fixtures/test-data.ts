/**
 * ============================================================
 * TEST ACCOUNTS — Fill in your real credentials below.
 * Each account maps to one parallel session.
 * To add more sessions: just add more accounts to this array.
 * ============================================================
 */
export const TEST_ACCOUNTS = [
  { email: 'tester1@example.com', password: 'CHANGE_ME' },
  { email: 'tester2@example.com', password: 'CHANGE_ME' },
  { email: 'tester3@example.com', password: 'CHANGE_ME' },
  { email: 'tester4@example.com', password: 'CHANGE_ME' },
  { email: 'tester5@example.com', password: 'CHANGE_ME' },
  { email: 'tester6@example.com', password: 'CHANGE_ME' },
  { email: 'tester7@example.com', password: 'CHANGE_ME' },
  { email: 'tester8@example.com', password: 'CHANGE_ME' },
  { email: 'tester9@example.com', password: 'CHANGE_ME' },
  { email: 'tester10@example.com', password: 'CHANGE_ME' },
];

/**
 * ============================================================
 * SITE CONFIG — URLs and paths for the Abba Medix site
 * ============================================================
 */
export const SITE = {
  baseURL: 'https://shop-abbamedix.sandbox.onample.com',
  paths: {
    home: '/',
    myAccount: '/my-account/',
    cart: '/cart/',
    checkout: '/checkout/',
  },
};

/**
 * ============================================================
 * PRODUCT CATEGORIES — Add or remove categories to test.
 * Each entry becomes a testable route.
 * To discover more: run Playwright on the site and grab new URLs.
 * ============================================================
 */
export const CATEGORIES = [
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
 * ORDER SCENARIOS — Each one runs as an independent parallel test.
 * To add more: just add another object to this array.
 * accountIndex picks which TEST_ACCOUNT to use (0-based).
 * ============================================================
 */
export const ORDER_SCENARIOS = [
  {
    name: 'Dried Flower - single item',
    accountIndex: 0,
    category: CATEGORIES[0],
    productIndex: 0,      // pick the 1st in-stock product
    sizeLabel: '5 g',
    quantity: 1,
  },
  {
    name: 'Dried Flower - larger size',
    accountIndex: 1,
    category: CATEGORIES[0],
    productIndex: 1,
    sizeLabel: '10 g',
    quantity: 2,
  },
  {
    name: 'Edibles - single item',
    accountIndex: 2,
    category: CATEGORIES[1],
    productIndex: 0,
    sizeLabel: null, // some products may not have size swatches
    quantity: 1,
  },
  {
    name: 'Vapes - single item',
    accountIndex: 3,
    category: CATEGORIES[4],
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
  {
    name: 'Pre-Rolls - quantity 3',
    accountIndex: 4,
    category: CATEGORIES[5],
    productIndex: 0,
    sizeLabel: null,
    quantity: 3,
  },
  {
    name: 'Beverages - single item',
    accountIndex: 5,
    category: CATEGORIES[6],
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
  {
    name: 'Concentrates - single item',
    accountIndex: 6,
    category: CATEGORIES[7],
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
  {
    name: 'Extracts - single item',
    accountIndex: 7,
    category: CATEGORIES[3],
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
  {
    name: 'Topicals - quantity 2',
    accountIndex: 8,
    category: CATEGORIES[2],
    productIndex: 0,
    sizeLabel: null,
    quantity: 2,
  },
  {
    name: 'Accessories - single item',
    accountIndex: 9,
    category: CATEGORIES[9],
    productIndex: 0,
    sizeLabel: null,
    quantity: 1,
  },
];
