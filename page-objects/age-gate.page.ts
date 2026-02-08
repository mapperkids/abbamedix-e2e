import { Page } from '@playwright/test';

export class AgeGatePage {
  constructor(private page: Page) {}

  /** Click "Yes" on the age verification popup */
  async confirmAge() {
    const yesButton = this.page.locator('button.age-gate__submit--yes');
    // Age gate may not appear if cookie already set
    if (await yesButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await yesButton.click();
      // Wait for the gate to disappear
      await this.page.locator('.age-gate__wrapper').waitFor({ state: 'hidden', timeout: 10_000 });
    }
  }
}
