import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
test('has title', async ({ page }) => {
  const loginPage= new LoginPage(page);
  const errormessage= (page.locator('h3'));
  await page.goto('https://www.saucedemo.com/');

  // Ensure that the page has loaded 
  await loginPage.navigateToLoginPage();
  await expect(page).toHaveTitle(/Swag Labs/);
  await loginPage.login('standard_user','secret_sauce');
  await page.locator('.product_sort_container').selectOption('lohi');

  const products = await page.locator('.inventory_item').all();
  await products[products.length - 1].locator('[data-test^="add-to-cart-"]').click();

  await page.locator('.product_sort_container').selectOption('az');

  await page.locator('.inventory_item').first().locator('[data-test^="add-to-cart-"]').click();

  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  const cartItems = await page.locator('.cart_item').all();
  if (cartItems.length !== 2) {
    throw new Error(`Expected 2 items in cart, but found ${cartItems.length}`);
  }

  await page.locator('[data-test="finish"]').click();
})

