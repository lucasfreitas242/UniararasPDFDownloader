const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');
const { elementLocated } = require('selenium-webdriver/lib/until');

const sleep = ms => new Promise(r => setTimeout(r, ms));

chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

const accessPDFDownloadPage = async ()  => {
    let driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://schoolnet.uniararas.br/');
    await driver.manage().window().maximize();

    const res = await driver.wait(until.elementLocated(By.id('usuario-input')),5000);
    if (Boolean(res)) console.log('Elemento usuario-input localizado com sucesso!');

    const userNameBar = await driver.findElement(By.xpath('//*[@id="usuario-input"]'));
    const userPasswordBar = await driver.findElement(By.xpath('//*[@id="senha-input"]'));
    await userNameBar.sendKeys('YOUR_STUDENT_ID');
    await sleep(500);
    await userPasswordBar.sendKeys('YOUR_PASSWORD')
    await userPasswordBar.sendKeys(Key.ENTER);
    await sleep(500);
    const financialOption = await driver.findElement(By.xpath('//*[@id="navbar-menu"]/li[2]/a'))
    await financialOption.sendKeys(Key.ENTER);
    await sleep(500);
    const extractOption = await driver.findElement(By.xpath('//a[text()="Extrato"]'));
    await extractOption.sendKeys(Key.ENTER);
    
    const actionDownload = await driver.findElements(By.xpath('//a[contains(text(), "Baixar Boleto")]'));
    console.log("Lista de actionDownload: "+actionDownload.length);

    // for (let i = 0; i < actionDownload.length; i++) {
    //     const element = actionDownload[i];
    //     element.click();
    //     await sleep(1000);

    //     const res = await driver.wait(until.elementLocated(By.xpath('//*[@id="btn-dwnBoleto"]')),5000);
    //     if (Boolean(res)) console.log('Botao localizado com sucesso!');

    //     await sleep(1000);
    //     const script = "return document.getElementById('btn-dwnBoleto').click()";
    //     await driver.executeScript(script);

    //     await sleep(1000);
    //     const buttonClose = await driver.findElement(By.xpath('//*[@id="avisoSenhaBoletoModal"]/div/div/div[3]/button'));
    //     buttonClose.click();

    //     sleep(1000);
    // }

    actionDownload.forEach(async element => {
        await element.click();
        await sleep(1000);
        const res = await driver.wait(until.elementLocated(By.id('btn-dwnBoleto')),5000);
        if (Boolean(res)) console.log('Botao de download localizado com sucesso!');

        await sleep(1000);
        const buttonDownload = await driver.findElement(By.xpath('//*[@id="btn-dwnBoleto"]'));
        await buttonDownload.click();

        await sleep(1000);
        const buttonClose = await driver.findElement(By.xpath('//*[@id="avisoSenhaBoletoModal"]/div/div/div[3]/button'));
        await buttonClose.click();
        await sleep(2000);
    });
    await sleep(2000);
}

accessPDFDownloadPage();
