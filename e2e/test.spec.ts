import { test, expect } from '@playwright/test';

test('join a room', async ({page}) => {
	await page.goto('http://localhost:3000/');
	await page.fill('#username', 'a');
	await page.click('#join-room');
	await expect(page.locator('#users')).toContainText('a');
})

test('update chat', async ({context}) => {
	const page1 = await context.newPage();
	const page2 = await context.newPage();

	await page1.goto('http://localhost:3000/');
	await page1.fill('#username', 'a');
	await page1.click('#join-room');
	await expect(page1.locator('#users')).toContainText('a');

	await page2.goto('http://localhost:3000/');
	await page2.fill('#username', 'b');
	await page2.click('#join-room');
	await expect(page2.locator('#users')).toContainText('a');
	await expect(page2.locator('#users')).toContainText('b');

	await page1.fill('#chat-input', 'hello');
	await page1.click('#chat-input');
	await page1.keyboard.press('Enter');
	await expect(page1.locator('#chat-log')).toContainText('a: hello');
	await expect(page2.locator('#chat-log')).toContainText('a: hello');

	await page2.fill('#chat-input', 'world');
	await page2.click('#chat-input');
	await page2.keyboard.press('Enter');
	await expect(page1.locator('#chat-log')).toContainText('a: hello');
	await expect(page1.locator('#chat-log')).toContainText('b: world');
	await expect(page2.locator('#chat-log')).toContainText('a: hello');
	await expect(page2.locator('#chat-log')).toContainText('b: world');
})