import { test, expect } from '@playwright/test';
import { REGISTRATION_DATA } from '../fixtures/test-data';
import { AgeGatePage } from '../../page-objects/age-gate.page';
import { RegistrationPage } from '../../page-objects/registration.page';

/**
 * ============================================================
 * ACCOUNT REGISTRATION — 10 concurrent new patients
 *
 * Each test:
 *  1. Navigates to /my-account/, handles age gate
 *  2. Scrolls to "DON'T HAVE AN ACCOUNT?" registration form
 *  3. Fills patient info, address, (optional) caregiver
 *  4. Checks marketing consent, clicks reCAPTCHA
 *  5. Clicks REGISTER NOW
 *  6. Verifies success
 *
 * Uses { page } fixture for automatic video embedding.
 * 10 registrations across 10 shards = 10 concurrent VMs.
 * Run: npm run test:registration
 * ============================================================
 */

for (let i = 0; i < REGISTRATION_DATA.length; i++) {
  const data = REGISTRATION_DATA[i];

  test(`Registration ${i + 1}: ${data.firstName} ${data.lastName}`, async ({ page }) => {
    const reg = new RegistrationPage(page);

    // ── 1. Navigate to /my-account/ + age gate ──
    await page.goto('/my-account/', { waitUntil: 'domcontentloaded' });
    const ageGate = new AgeGatePage(page);
    await ageGate.confirmAge();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-01-my-account.png` });

    // ── 2. Scroll to registration form ──
    await reg.scrollToRegistrationForm();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-02-registration-form.png` });

    // ── 3. Fill patient information ──
    await reg.fillPatientInfo({
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      dob: data.dob,
      email: data.email,
      phone: data.phone,
      altPhone: data.altPhone,
      gender: data.gender,
      veteran: data.veteran,
    });
    await page.screenshot({ path: `./test-results/reg-${i + 1}-03-patient-info.png` });

    // ── 4. Fill address ──
    await reg.fillAddress(data.address);
    await page.screenshot({ path: `./test-results/reg-${i + 1}-04-address.png` });

    // ── 5. Caregiver section (if applicable) ──
    if (data.hasCaregiver && data.caregiver) {
      await reg.checkCaregiver();
      await reg.fillCaregiverDetails({
        firstName: data.caregiver.firstName,
        lastName: data.caregiver.lastName,
        dob: data.caregiver.dob,
        email: data.caregiver.email,
        phone: data.caregiver.phone,
        gender: data.caregiver.gender,
      });
      await page.screenshot({ path: `./test-results/reg-${i + 1}-05-caregiver-details.png` });

      await reg.fillCaregiverAddress(data.caregiver.address);
      await page.screenshot({ path: `./test-results/reg-${i + 1}-06-caregiver-address.png` });
    }

    // ── 6. Marketing consent ──
    await reg.checkMarketingConsent();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-07-consent.png` });

    // ── 7. reCAPTCHA ──
    await reg.clickRecaptcha();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-08-recaptcha.png` });

    // ── 8. Register ──
    await reg.clickRegisterNow();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-09-clicked-register.png` });

    // ── 9. Verify success ──
    await reg.expectRegistrationSuccess();
    await page.screenshot({ path: `./test-results/reg-${i + 1}-10-success.png` });
    console.log(`[Registration ${i + 1}] ${data.firstName} ${data.lastName} registered successfully`);
  });
}
