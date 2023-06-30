const { assert } = require('chai');
const webdriver = require('webdriver');


const { By } = webdriver;

//Если не работает - установить selenium и в конфиге поставить webdriver вместо devtools

//иногда подлагивает тест

describe('example store', async function() {

    this.retries(3); 
    it('Тест на ширину 1440', async function() {
        await this.browser.setWindowSize(1440, 800);


        await this.browser.url('http://localhost:3000/hw/store');


        await this.browser.assertView('main1440', 'body' );
        
    });
    it('Тест на ширину 768', async function() {

        
        await this.browser.setWindowSize(768, 800);

        await this.browser.pause(1000)

        await this.browser.url('http://localhost:3000/hw/store');
        
        await this.browser.assertView('main768', 'body');

    });    

    it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер" ', async function() {

        await this.browser.setWindowSize(575, 1500);


        await this.browser.url('http://localhost:3000/hw/store');

        
        await this.browser.assertView('main575', 'body');

    });  
    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function() {
        
        await this.browser.setWindowSize(575, 1000);

        await this.browser.url('http://localhost:3000/hw/store');
        const mainLink = await this.browser.$('.Application-Brand');

        const hamburgerMenu = await this.browser.$('.Application-Toggler');
        await hamburgerMenu.click();

        const menuItems = await this.browser.$$('.nav-link');
        assert.isTrue(menuItems.length > 0, 'Меню не открыто');

        const menuItem = await this.browser.$('.nav-link:first-child');
        await menuItem.click();

        await mainLink.click();

        await this.browser.pause(1000)

        const isMenuVisible = await this.browser.$('.nav-link').isDisplayed();

        assert.isFalse(isMenuVisible, 'Меню не закрыто');

      
    }); 
 
});

describe('Проверка ссылок', async function() {
    

    it('должна содержать ссылки на страницы магазина ', async function() {

        await this.browser.setWindowSize(1440, 1000);

        await this.browser.pause(1000)


        await this.browser.url('http://localhost:3000/hw/store');

    
        const shopLink = await this.browser.$('.nav-link');

        assert.ok(await shopLink.isExisting(), 'Ссылка на страницу магазина не найдена');
        assert.ok(await shopLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const shopHref = await shopLink.getAttribute('href');
    
        assert.ok(shopHref && shopHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
    
      it('название магазина в шапке должно быть ссылкой на главную страницу', async function() {

        await this.browser.url('http://localhost:3000/hw/store');

        const mainLink = await this.browser.$('.Application-Brand');


        assert.ok(await mainLink.isExisting(), 'Ссылка на страницу магазина не найдена');
        assert.ok(await mainLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const mainHref = await mainLink.getAttribute('href');
    
        assert.ok(mainHref && mainHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
 
 
}); 
