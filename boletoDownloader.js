const {Builder, By, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');

const sleep = ms => new Promise(r => setTimeout(r, ms));

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

const accessPDFDownloadPage = async ()  => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://schoolnet.uniararas.br/');
    const userNameBar = await driver.findElement(By.xpath('//*[@id="usuario-input"]'));
    const userPasswordBar = await driver.findElement(By.xpath('//*[@id="senha-input"]'));
    await userNameBar.sendKeys('YOUR_STUDENT_ID');
    await sleep(3000);
    await userPasswordBar.sendKeys('YOUR_PASSWORD')
    await userPasswordBar.sendKeys(Key.ENTER);
    await sleep(3000);
    const financialOption = await driver.findElement(By.xpath('//*[@id="navbar-menu"]/li[2]/a'))
    await financialOption.sendKeys(Key.ENTER);
    await sleep(1000);
    const extractOption = await driver.findElement(By.xpath('//*[@id="navbar-menu"]/li[2]/ul/li[1]/a'));
    await extractOption.sendKeys(Key.ENTER);

    const actionDownload = await driver.findElement(By.xpath('//*[@id="6856566"]/td[8]/a'));
    await actionDownload.click();
    const downloadButton = await driver.findElement(By.xpath('//*[@id="btn-dwnBoleto"]'));
    await sleep(2000);
    await downloadButton.click();
}

accessPDFDownloadPage();
