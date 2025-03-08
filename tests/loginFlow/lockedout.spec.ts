import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Attempt to log in with locked out user', async ({ page }) => {
  const loginPage= new LoginPage(page);
  const errormessage= (page.locator('h3'));
  await page.goto('https://www.saucedemo.com/');

  // Ensure that the page has loaded 
  await loginPage.navigateToLoginPage();
  await expect(page).toHaveTitle(/Swag Labs/);
  await loginPage.login('locked_out_user','secret_sauce');
    await expect(errormessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');

});
test('Attempt to login with standard user', async ({page}) => {
  const loginPage= new LoginPage(page);
  await loginPage.navigateToLoginPage();
  await expect(page).toHaveTitle(/Swag Labs/);
  await loginPage.login('standard_user','secret_sauce');
  const inventoryContainer = await page.locator('.inventory_container');
  await expect(inventoryContainer).toBeVisible();
});