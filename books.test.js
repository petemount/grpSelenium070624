const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
    if (driver) {
        await driver.quit();
    }
});

test("scrapen von books to scape", async () => {
    await driver.get("http://books.toscrape.com");

    let books = await driver.findElements(By.css(".product_pod"));
    expect(books.length).toBeGreaterThan(0);

    let allTitles = [];
    for (let book of books) {
        let titleElement = await book.findElement(By.css("h3 a"));
        let title = await titleElement.getText();
        let link = await titleElement.getAttribute("href");


        // Preise ermitteln
        let priceElement = await book.findElement(By.css(".price_color"));
        let price = await priceElement.getText();

        // Verfuegbarkeit ermitteln
        let instockElement = await book.findElement(By.className("instock availability"))
        let instock = await instockElement.getText();



        allTitles.push({title,link, price, instock});
        fs.writeFileSync("books.json", JSON.stringify(allTitles, null, 2));
    }
    


});

