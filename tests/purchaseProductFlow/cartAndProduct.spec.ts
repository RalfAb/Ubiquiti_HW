import { chromium, Page, Browser, expect, test } from '@playwright/test';

test.describe('Cart and Product tests', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test.beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('Product Details Page Loads Correctly', async () => {
    await page.locator('.inventory_item_name').first().click();

    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('Add and Remove Product from Cart', async () => {
    await page.locator('[data-test^="add-to-cart-"]').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toBeVisible();

    await page.locator('[data-test^="remove-"]').click();
    await expect(page.locator('.cart_item')).not.toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('Successful Checkout Process', async () => {
    await page.locator('[data-test^="add-to-cart-"]').first().click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('.summary_info')).toBeVisible();
    await page.locator('[data-test="finish"]').click();

    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toBeVisible();
  });
});