import { Page, expect } from '@playwright/test';

export class RegistrationPage {
  constructor(private page: Page) {}

  /** Scroll past the login form to the registration section */
  async scrollToRegistrationForm() {
    // Wait for page content to fully render
    await this.page.waitForLoadState('networkidle');
    // Heading may use curly apostrophe (') or straight (') — match either
    const heading = this.page.getByText(/DON.T HAVE AN ACCOUNT/i);
    await heading.waitFor({ state: 'visible', timeout: 30_000 });
    await heading.scrollIntoViewIfNeeded();
  }

  /** Fill Patient Information section */
  async fillPatientInfo(data: {
    firstName: string; middleName: string; lastName: string;
    dob: { year: string; month: string; day: string };
    email: string; phone: string; altPhone: string;
    gender: string; veteran: string;
  }) {
    // Name fields — use first matching placeholder (patient section is first on page)
    await this.page.getByPlaceholder('First Name *').first().fill(data.firstName);
    if (data.middleName) {
      await this.page.getByPlaceholder('Middle Name').fill(data.middleName);
    }
    await this.page.getByPlaceholder('Last Name *').first().fill(data.lastName);

    // Date of Birth — use CSS attribute contains to avoid exact-match whitespace issues
    await this.page.locator('input[placeholder*="Year"]').first().fill(data.dob.year);
    await this.page.locator('input[placeholder*="Month"]').first().fill(data.dob.month);
    await this.page.locator('input[placeholder*="Day"]').first().fill(data.dob.day);

    // Contact info
    await this.page.getByPlaceholder('Email *').first().fill(data.email);
    await this.page.getByPlaceholder('Phone No.*').fill(data.phone);
    if (data.altPhone) {
      await this.page.getByPlaceholder('Alternate Phone No.').fill(data.altPhone);
    }

    // Gender radio — patient section has the first pair of Male/Female radios
    const genderSection = this.page.locator('text=Gender *').first().locator('..');
    if (data.gender === 'Male') {
      await genderSection.getByText('Male', { exact: true }).click();
    } else {
      await genderSection.getByText('Female', { exact: true }).click();
    }

    // Veteran radio
    if (data.veteran === 'Yes') {
      await this.page.locator('text=Are you a veteran?').locator('..').getByText('Yes', { exact: true }).click();
    } else {
      await this.page.locator('text=Are you a veteran?').locator('..').getByText('No', { exact: true }).click();
    }
  }

  /** Fill Address Information section */
  async fillAddress(data: {
    poBox: string; street: string; city: string;
    province: string; postalCode: string;
  }) {
    // Address Information is the first set of address fields
    if (data.poBox) {
      await this.page.getByPlaceholder('P.O. Box').first().fill(data.poBox);
    }
    await this.page.getByPlaceholder('Street *').first().fill(data.street);
    await this.page.getByPlaceholder('City *').first().fill(data.city);

    // Province dropdown — exclude hidden flatpickr month selects
    const provinceSelect = this.page.locator('select:not(.flatpickr-monthDropdown-months)').first();
    await provinceSelect.selectOption({ label: data.province });

    await this.page.getByPlaceholder('Postal Code *').first().fill(data.postalCode);
  }

  /** Check "Do you have a Caregiver?" checkbox */
  async checkCaregiver() {
    const checkbox = this.page.getByText('Do you have a Caregiver?');
    await checkbox.scrollIntoViewIfNeeded();
    await checkbox.click();
    // Wait for caregiver section to appear
    await this.page.getByText('Caregiver Details').waitFor({ state: 'visible', timeout: 5_000 });
  }

  /** Fill Caregiver Details — uses the caregiver section's fields (second set on page) */
  async fillCaregiverDetails(data: {
    firstName: string; lastName: string; dob: string;
    email: string; phone: string; gender: string;
  }) {
    // Caregiver section has "Firsst Name *" (typo on site)
    await this.page.getByPlaceholder('Firsst Name *').fill(data.firstName);
    // Caregiver Last Name is the second "Last Name *" on page
    await this.page.getByPlaceholder('Last Name *').nth(1).fill(data.lastName);
    // Caregiver DOB is a single field "Date of Birth *"
    await this.page.getByPlaceholder('Date of Birth *').fill(data.dob);
    // Caregiver Email is the second "Email *" on page
    await this.page.getByPlaceholder('Email *').nth(1).fill(data.email);
    // Caregiver Phone is "Phone Number *"
    await this.page.getByPlaceholder('Phone Number *').fill(data.phone);

    // Caregiver Gender — second Gender section on page
    const genderSection = this.page.locator('text=Gender *').nth(1).locator('..');
    if (data.gender === 'Male') {
      await genderSection.getByText('Male', { exact: true }).click();
    } else {
      await genderSection.getByText('Female', { exact: true }).click();
    }
  }

  /** Fill Caregiver Address Information — last set of address fields on page */
  async fillCaregiverAddress(data: {
    street: string; city: string; province: string; postalCode: string;
  }) {
    // Caregiver address fields are the last Street/City/Province/PostalCode on page
    await this.page.getByPlaceholder('Street *').last().fill(data.street);
    await this.page.getByPlaceholder('City *').last().fill(data.city);

    // Caregiver province dropdown — exclude hidden flatpickr month selects
    const provinceSelect = this.page.locator('select:not(.flatpickr-monthDropdown-months)').last();
    await provinceSelect.selectOption({ label: data.province });

    await this.page.getByPlaceholder('Postal Code *').last().fill(data.postalCode);
  }

  /** Check marketing consent checkbox */
  async checkMarketingConsent() {
    const consent = this.page.getByText('I consent to marketing emails');
    await consent.scrollIntoViewIfNeeded();
    await consent.click();
  }

  /** Click reCAPTCHA checkbox inside its iframe */
  async clickRecaptcha() {
    // Scroll the reCAPTCHA iframe into view on the main page first
    const recaptchaIframe = this.page.locator('iframe[title*="reCAPTCHA"]');
    await recaptchaIframe.scrollIntoViewIfNeeded();
    // Click the checkbox inside the iframe
    const recaptchaFrame = this.page.frameLocator('iframe[title*="reCAPTCHA"]');
    await recaptchaFrame.locator('#recaptcha-anchor').click({ timeout: 10_000 });
    // Wait for the checkmark to appear (green tick)
    await this.page.waitForTimeout(2_000);
  }

  /** Click REGISTER NOW button */
  async clickRegisterNow() {
    const btn = this.page.getByRole('button', { name: /register now/i });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
  }

  /** Verify registration success — check for redirect or success message */
  async expectRegistrationSuccess() {
    // After registration, site may show a success message, redirect to dashboard,
    // or show "check your email". Wait for any of these indicators.
    await expect(
      this.page.locator(
        '.woocommerce-message, .woocommerce-MyAccount-navigation, .woocommerce-MyAccount-content'
      ).first()
    ).toBeVisible({ timeout: 30_000 });
  }
}
