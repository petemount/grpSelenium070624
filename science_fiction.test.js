const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");

let driver;

jest.setTimeout(60000); // Setzt den Timeout für den gesamten Test auf 30000 ms

beforeAll(async () => {
    driver = await new Builder().forBrowser("chrome").build();
});

afterAll(async () => {
    if (driver) {
        await driver.quit();
    }
});

test("scrapen von books to scape by Kategorie Science Fiction", async () => {
    await driver.get("http://books.toscrape.com");

    const mouseClick = await driver.findElement(
        By.xpath('//*[@id="default"]/div/div/div/aside/div[2]/ul/li/ul/li[15]/a')
    // Science-Fiction-xpath: //*[@id="default"]/div/div/div/aside/div[2]/ul/li/ul/li[15]/a    
    );
    await mouseClick.click();

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

        // Navigiere zur Detailseite jedes Buches auf der ersten Seite (Unterseiten zu kompliziert)
        await titleElement.click();  // Erkennt den jeweiligen link der Detailseite!

        //Warten bis Detailseite geladen ist
        await driver.wait(until.elementLocated(By.css('.product_main')), 10000);

        // Bild und Beschreibung des aktiven Buchs extrahieren
        let imgElement = await driver.findElement(By.css('.thumbnail img'))
        let img = await imgElement.getAttribute("src");

        let prodDescElement = driver.findElement(By.css("#product_description ~ p"));
        let description = await prodDescElement.getText();

        // Testlog
        // console.log(title,link,price,instock,img,description)
        
        allTitles.push({ title,link,price,instock,img,description });
        fs.writeFileSync("autobio.json", JSON.stringify(allTitles, null, 2));

        // Zurück zur Home-Page
        await driver.navigate().back();

        // Zeit zum Laden der Homepage
        await driver.sleep(2000);        

        
    }    
});