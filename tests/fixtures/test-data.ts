/**
 * ============================================================
 * TEST ACCOUNTS — Fill in your real credentials below.
 * Each account maps to one parallel session.
 * To add more sessions: just add more accounts to this array.
 * ============================================================
 */
export const TEST_ACCOUNTS = [
  { clientId: '2246-3594-5067-6181', password: 'WCSandbox321' },
  { clientId: '6624-6029-3419-7992', password: 'WCSandbox321' },
  { clientId: '9766-3751-4801-3208', password: 'WCSandbox321' },
  { clientId: '9281-7590-3959-9291', password: 'WCSandbox321' },
  { clientId: '3879-3132-5322-0516', password: 'WCSandbox321' },
  { clientId: '6049-9580-9576-5153', password: 'WCSandbox321' },
  { clientId: '9388-7517-1232-3269', password: 'WCSandbox321' },
  { clientId: '7067-2719-0010-1968', password: 'WCSandbox321' },
  { clientId: '7650-1889-1132-9212', password: 'WCSandbox321' },
  { clientId: '2969-6953-7775-7863', password: 'WCSandbox321' },
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
 * ORDER SCENARIOS — 10 concurrent order placements.
 * Each account picks 3 RANDOM products from RANDOM categories,
 * removes 1 from cart, then places order with remaining 2.
 * First product always gets qty=2. Categories are shuffled
 * per account and empty ones are automatically skipped.
 * Uses Veteran's Affairs policy for $0.00 total.
 * ============================================================
 */
// Skip Account 4 (index 3, shipping bug) and Account 10 (index 9, 0 GR remaining)
const ACTIVE_ACCOUNT_INDICES = [0, 1, 2, 4, 5, 6, 7, 8];

export const ORDER_SCENARIOS = ACTIVE_ACCOUNT_INDICES.map((accountIndex, i) => ({
  accountIndex,
  removeFromCart: i % 3, // vary remove position: 0, 1, or 2
}));

/**
 * ============================================================
 * CARD TEST DATA — Unique billing info per account for card tests.
 * Index matches TEST_ACCOUNTS index.
 * ============================================================
 */
export const CARD_TEST_DATA = [
  { firstName: 'Alice',   lastName: 'Anderson', street: 'Maple St',    streetNumber: '101', postalCode: 'V5K 0A1' },
  { firstName: 'Bob',     lastName: 'Baker',    street: 'Oak Ave',     streetNumber: '202', postalCode: 'M5V 2T6' },
  { firstName: 'Carol',   lastName: 'Carter',   street: 'Pine Rd',     streetNumber: '303', postalCode: 'T2P 1J9' },
  { firstName: 'David',   lastName: 'Davis',    street: 'Elm Blvd',    streetNumber: '404', postalCode: 'K1A 0B1' },
  { firstName: 'Eve',     lastName: 'Edwards',  street: 'Cedar Ln',    streetNumber: '505', postalCode: 'R3C 4A5' },
  { firstName: 'Frank',   lastName: 'Fisher',   street: 'Birch Dr',    streetNumber: '606', postalCode: 'S4P 3Y2' },
  { firstName: 'Grace',   lastName: 'Garcia',   street: 'Spruce Way',  streetNumber: '707', postalCode: 'E1C 1B5' },
  { firstName: 'Henry',   lastName: 'Hughes',   street: 'Willow Ct',   streetNumber: '808', postalCode: 'A1B 3X9' },
  { firstName: 'Irene',   lastName: 'Irving',   street: 'Aspen Pl',    streetNumber: '909', postalCode: 'C1A 4K9' },
  { firstName: 'Jack',    lastName: 'Johnson',  street: 'Poplar Cres', streetNumber: '110', postalCode: 'G1R 4P5' },
];

/**
 * ============================================================
 * TEST CARD — Stripe test Visa card for sandbox payment tests.
 * ============================================================
 */
export const TEST_CARD = {
  number: '4242424242424242',
  expiry: '12/28',
  cvc: '123',
};
