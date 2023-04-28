const { Builder, Browser, By, until } = require("selenium-webdriver");

let driver;

beforeEach(async () => {
	driver = await new Builder().forBrowser(Browser.CHROME).build();
});

afterEach(async () => {
	await driver.quit();
});

describe("Duel Duo tests", () => {
	test("page loads with title", async () => {
		await driver.get("http://localhost:8000");
		await driver.wait(until.titleIs("Duel Duo"), 1000);
	});

	test("Draw button displays div bot cards", async () => {
		await driver.get("http://localhost:8000");
		await driver.wait(until.titleIs("Duel Duo"), 1000);
		await driver.findElement(By.id("draw")).click();
		await driver.findElement(By.css('div[class="bot-card outline"]'));
	});

	test("Add to duo display player-duo div", async () => {
		await driver.get("http://localhost:8000");
		await driver.wait(until.titleIs("Duel Duo"), 1000);
		await driver.findElement(By.id("draw")).click();
		await driver.findElement(By.css('div[class="bot-card outline"]'));
		await driver
			.findElement(By.xpath("//button[text()[contains(.,'Add to Duo')]]"))
			.click();
		await driver.findElement(
			By.xpath("//button[text()[contains(.,'Remove from Duo')]]")
		);
	});
});

// Was going to do more tests, but didn't have enough time :(
