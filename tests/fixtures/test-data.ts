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

/**
 * ============================================================
 * REGISTRATION DATA — 10 new patient registrations.
 * 5 with caregiver (#2, #4, #6, #8, #10), 3 veterans (#3, #6, #9).
 * Each gets a unique Canadian address across different provinces.
 * Run: npm run test:registration
 * ============================================================
 */
export const REGISTRATION_DATA = [
  {
    email: 'raymond.lee+20@wilcompute.com',
    firstName: 'Raymond', middleName: '', lastName: 'Lee',
    dob: { year: '1985', month: '03', day: '15' },
    phone: '6045551020', altPhone: '',
    gender: 'Male', veteran: 'No',
    address: { poBox: '', street: '100 Maple St', city: 'Vancouver', province: 'British Columbia', postalCode: 'V5K 0A1' },
    mailingAddress: null,
    hasCaregiver: false,
    caregiver: null,
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+21@wilcompute.com',
    firstName: 'Sarah', middleName: 'Jane', lastName: 'Mitchell',
    dob: { year: '1990', month: '07', day: '22' },
    phone: '4165552130', altPhone: '4165552131',
    gender: 'Female', veteran: 'No',
    address: { poBox: '', street: '221 Queen St W', city: 'Toronto', province: 'Ontario', postalCode: 'M5V 2T6' },
    mailingAddress: null,
    hasCaregiver: true,
    caregiver: {
      firstName: 'Mark', lastName: 'Mitchell',
      dob: '1988-05-10',
      email: 'mark.mitchell+cg@wilcompute.com', phone: '4165552140',
      gender: 'Male',
      address: { street: '225 Queen St W', city: 'Toronto', province: 'Ontario', postalCode: 'M5V 2T6' },
    },
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+22@wilcompute.com',
    firstName: 'James', middleName: '', lastName: 'Thompson',
    dob: { year: '1978', month: '11', day: '08' },
    phone: '7805553240', altPhone: '',
    gender: 'Male', veteran: 'Yes',
    address: { poBox: '', street: '456 Jasper Ave', city: 'Edmonton', province: 'Alberta', postalCode: 'T5J 1R5' },
    mailingAddress: null,
    hasCaregiver: false,
    caregiver: null,
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+23@wilcompute.com',
    firstName: 'Emily', middleName: 'Rose', lastName: 'Rodriguez',
    dob: { year: '1995', month: '01', day: '30' },
    phone: '5145554350', altPhone: '5145554351',
    gender: 'Female', veteran: 'No',
    address: { poBox: '', street: '789 Rue Sainte-Catherine', city: 'Montreal', province: 'Quebec', postalCode: 'H3B 1A4' },
    mailingAddress: null,
    hasCaregiver: true,
    caregiver: {
      firstName: 'Carlos', lastName: 'Rodriguez',
      dob: '1965-09-22',
      email: 'carlos.rodriguez+cg@wilcompute.com', phone: '5145554360',
      gender: 'Male',
      address: { street: '791 Rue Sainte-Catherine', city: 'Montreal', province: 'Quebec', postalCode: 'H3B 1A4' },
    },
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+24@wilcompute.com',
    firstName: 'Michael', middleName: '', lastName: 'Chen',
    dob: { year: '1982', month: '06', day: '12' },
    phone: '6045555460', altPhone: '',
    gender: 'Male', veteran: 'No',
    address: { poBox: '', street: '321 Robson St', city: 'Vancouver', province: 'British Columbia', postalCode: 'V6B 3K9' },
    mailingAddress: null,
    hasCaregiver: false,
    caregiver: null,
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+25@wilcompute.com',
    firstName: 'Lisa', middleName: 'Marie', lastName: 'Nguyen',
    dob: { year: '1988', month: '09', day: '04' },
    phone: '2045556570', altPhone: '2045556571',
    gender: 'Female', veteran: 'Yes',
    address: { poBox: '', street: '555 Portage Ave', city: 'Winnipeg', province: 'Manitoba', postalCode: 'R3C 0G3' },
    mailingAddress: null,
    hasCaregiver: true,
    caregiver: {
      firstName: 'Tran', lastName: 'Nguyen',
      dob: '1960-03-15',
      email: 'tran.nguyen+cg@wilcompute.com', phone: '2045556580',
      gender: 'Male',
      address: { street: '557 Portage Ave', city: 'Winnipeg', province: 'Manitoba', postalCode: 'R3C 0G3' },
    },
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+26@wilcompute.com',
    firstName: 'David', middleName: '', lastName: 'Patel',
    dob: { year: '1975', month: '12', day: '20' },
    phone: '3065557680', altPhone: '',
    gender: 'Male', veteran: 'No',
    address: { poBox: '', street: '678 Albert St', city: 'Regina', province: 'Saskatchewan', postalCode: 'S4R 2P6' },
    mailingAddress: null,
    hasCaregiver: false,
    caregiver: null,
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+27@wilcompute.com',
    firstName: 'Jennifer', middleName: 'Soo', lastName: 'Kim',
    dob: { year: '1992', month: '04', day: '18' },
    phone: '5065558790', altPhone: '5065558791',
    gender: 'Female', veteran: 'No',
    address: { poBox: '', street: '42 King St', city: 'Fredericton', province: 'New Brunswick', postalCode: 'E3B 1C6' },
    mailingAddress: null,
    hasCaregiver: true,
    caregiver: {
      firstName: 'Hye', lastName: 'Kim',
      dob: '1968-11-30',
      email: 'hye.kim+cg@wilcompute.com', phone: '5065558800',
      gender: 'Female',
      address: { street: '44 King St', city: 'Fredericton', province: 'New Brunswick', postalCode: 'E3B 1C6' },
    },
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+28@wilcompute.com',
    firstName: 'Robert', middleName: '', lastName: 'Wilson',
    dob: { year: '1980', month: '08', day: '25' },
    phone: '9025559900', altPhone: '',
    gender: 'Male', veteran: 'Yes',
    address: { poBox: '', street: '99 Spring Garden Rd', city: 'Halifax', province: 'Nova Scotia', postalCode: 'B3J 3L5' },
    mailingAddress: null,
    hasCaregiver: false,
    caregiver: null,
    marketingConsent: true,
  },
  {
    email: 'raymond.lee+29@wilcompute.com',
    firstName: 'Amanda', middleName: 'Lynn', lastName: 'Brown',
    dob: { year: '1993', month: '02', day: '14' },
    phone: '7095550110', altPhone: '7095550111',
    gender: 'Female', veteran: 'No',
    address: { poBox: '', street: '15 Water St', city: 'St. John\'s', province: 'Newfoundland and Labrador', postalCode: 'A1C 1A4' },
    mailingAddress: null,
    hasCaregiver: true,
    caregiver: {
      firstName: 'Patricia', lastName: 'Brown',
      dob: '1965-07-08',
      email: 'patricia.brown+cg@wilcompute.com', phone: '7095550120',
      gender: 'Female',
      address: { street: '17 Water St', city: 'St. John\'s', province: 'Newfoundland and Labrador', postalCode: 'A1C 1A4' },
    },
    marketingConsent: true,
  },
];
