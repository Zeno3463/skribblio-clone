import { test, expect } from '@playwright/test';

test('join a room', async ({page}) => {
	await page.goto('http://localhost:3000/');
	await page.fill('#username', 'a');
	await page.click('#join-room');
	await expect(page.locator('#users')).toContainText('a');
})

test('update chat', async ({page}) => {
	await page.goto('http://localhost:3000/');
	await page.fill('#username', 'b');
	await page.click('#join-room');
	await expect(page.locator('#users')).toContainText('a');
	await expect(page.locator('#users')).toContainText('b');
	await page.fill('#chat-input', 'hello');
	await page.click('#chat-input');
	await page.keyboard.press('Enter');
	await expect(page.locator('#chat-log')).toContainText('b: hello');
})