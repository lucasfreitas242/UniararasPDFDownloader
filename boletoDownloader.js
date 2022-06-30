const {Builder, By, Key} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeDriver = require('chromedriver');
const os = require('os');
const fs = require('fs');

const sgMail = require('@sendgrid/mail');

const sleep = ms => new Promise(r => setTimeout(r, ms));

let windowsUserName = os.userInfo().username;

const downloadDirectory = `/Users/${windowsUserName}/Desktop/BoletosUniararas`;
let newPath = '';


chrome.setDefaultService(new chrome.ServiceBuilder(chromeDriver.path).build());

const sendEmail = async () => {
    sgMail.setApiKey("YOUR_API_KEY");
    let fileToBeSended = newPath;
    let attachment = fs.readFileSync(fileToBeSended).toString("base64");
    sleep(2000);
    
    const msg = {
        to: 'TO_EMAIL',
        from: 'FROM_EMAIL',
        subject: 'E-mail de teste',
        text: 'Boleto da Uniararas que vence este mês!',
        attachments: [
            {
              content: attachment,
              filename: "Boleto Uniararas.pdf",
              type: "application/pdf",
              disposition: "attachment"
            }
          ]
    };
    
    sgMail.send(msg).catch(err => {
        console.log(err)
    });
}

const validateDownloadDirectory = async () => {
    if (!fs.existsSync(downloadDirectory)){
        fs.mkdir(downloadDirectory, (err) => {
            if (err) {
                console.log(err);
                return
            }
    
            console.log("Diretório criado! =)")
        });
    } else {
        console.log('Diretório já existe!')
    }
}

const changePDFDirectory = async() => {
    let oldPath = `/Users/${windowsUserName}/Downloads/`;
    let file = fs.readdirSync(oldPath).filter(fn => fn.startsWith('Boleto_-_'))[0];
    console.log(file);
    oldPath = oldPath + file;
    updatedFile = file;
    newPath = (downloadDirectory + "/" + updatedFile);

    fs.copyFile(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Arquivo copiado com sucesso!')
      })

}


const accessPDFDownloadPage = async ()  => {

    validateDownloadDirectory();

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
    await driver.get('https://schoolnet.uniararas.br/');
    const userNameBar = await driver.findElement(By.xpath('//*[@id="usuario-input"]'));
    const userPasswordBar = await driver.findElement(By.xpath('//*[@id="senha-input"]'));
    await userNameBar.sendKeys('YOUR_STUDENT_ID');
    await sleep(1000);
    await userPasswordBar.sendKeys('YOUR_PASSWORD')
    await userPasswordBar.sendKeys(Key.ENTER);
    await sleep(1000);
    const financialOption = await driver.findElement(By.xpath('//*[@id="navbar-menu"]/li[2]/a'))
    await financialOption.sendKeys(Key.ENTER);
    await sleep(1000);
    const extractOption = await driver.findElement(By.xpath('//a[text()="Extrato"]'));
    await extractOption.sendKeys(Key.ENTER);

    const actionDownload = await driver.findElement(By.xpath('//a[contains(text(), "Baixar Boleto")]'));
    await actionDownload.click();
    const downloadButton = await driver.findElement(By.xpath('//*[@id="btn-dwnBoleto"]'));
    await sleep(2000);
    await downloadButton.click();

    await sleep(5000);
    changePDFDirectory();
    await sleep(5000);
    sendEmail();
}


accessPDFDownloadPage();

