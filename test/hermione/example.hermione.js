const { assert } = require('chai');
const webdriver = require('webdriver');


//Hermione покрывает тесты с bugId под номерами  - 4 , 5 ,6 ,8, 9, 10 , остальное проверяйте через Jest 

const bugId = '?bug_id=10' // Сюда впиши ?bug_id=9  ,  цифра = номер бага менять при тестировании разных багов

const baseUrl = `http://localhost:3000/hw/store`;


//Если не работает - установить selenium и в конфиге поставить webdriver вместо devtools https://github.com/gemini-testing/hermione#selenium-standalone

//После установки всего необходимого нужно 1) Запустить сервер npm start 2) запустить selenium  -> selenium-standalone start 3) если хочешь проверить  в gui , то еще нужно запустить сервер Hermione, в gui retry не автоматический поэтому если тест упал необходимо 1-2 раза перезапустить , если упал больше 2-х раз значит так и должно быть, спасибо за внимание )


describe('Адаптив Main страницы ', async function() {

    it('Тест главной страницы на ширину 1440', async function() {
        await this.browser.setWindowSize(1440, 800);


        await this.browser.url(`${baseUrl}${bugId}`);


        await this.browser.assertView('main1440', 'body' );
        
    });
  

    it('Главная страница на ширине меньше 576px навигационное меню должно скрываться за "гамбургер" ', async function() {

        await this.browser.setWindowSize(575, 1500);


        await this.browser.url(`${baseUrl}${bugId}`);

        
        await this.browser.assertView('main575', 'body');

    });

    
    it('при выборе элемента из меню "гамбургера", меню должно закрываться', async function() {
        
        await this.browser.setWindowSize(575, 1000);

        await this.browser.url(`${baseUrl}${bugId}`);
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


        await this.browser.url(`${baseUrl}${bugId}`);

    
        const shopLink = await this.browser.$('.nav-link');

        assert.ok(await shopLink.isExisting(), 'Ссылка на страницу магазина не найдена');

        assert.ok(await shopLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const shopHref = await shopLink.getAttribute('href');
    
        assert.ok(shopHref && shopHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
    
      it('название магазина в шапке должно быть ссылкой на главную страницу', async function() {

        await this.browser.url(`${baseUrl}${bugId}`);

        const mainLink = await this.browser.$('.Application-Brand');


        assert.ok(await mainLink.isExisting(), 'Ссылка на страницу магазина не найдена');
        assert.ok(await mainLink.isDisplayed(), 'Ссылка на страницу магазина не видима');
    
        const mainHref = await mainLink.getAttribute('href');
    
        assert.ok(mainHref && mainHref.startsWith('/hw/store/'), 'Неверная ссылка на страницу магазина');
    
      });
 
 
}); 


describe('Каталог', async function() {
    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async function() {
        await this.browser.setWindowSize(1440, 800);

        await this.browser.url(`${baseUrl}/catalog/0${bugId}`);

        await this.browser.assertView('button', '.ProductDetails-AddToCart');
        
    });
});

describe('Корзина', async function() {
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async function() {
        await this.browser.setWindowSize(1440, 800);

        await this.browser.url(`${baseUrl}${bugId}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`${baseUrl}/cart${bugId}`);


        const clearBtn = await this.browser.$('.Cart-Clear');

        await clearBtn.click();

        await this.browser.refresh();

        await this.browser.assertView('cleartCart', 'body');

    });
});

describe('Проверка формы', async function(){
  
    it('Проверка валидации полей', async function(){
    await this.browser.setWindowSize(1440, 1000);
    await this.browser.url(`${baseUrl}${bugId}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`${baseUrl}/cart${bugId}`);;
    const inputName = await this.browser.$('#f-name')
    await inputName.setValue('Ваня')
    const inputPhone = await this.browser.$('#f-phone')
    await inputPhone.setValue('7877878787')
    const inputAdress = await this.browser.$('#f-address')
    await inputAdress.setValue('улица Пушкина дом Колотушкина')
    const buttonForm = await this.browser.$('.Form-Submit')
    await buttonForm.click();
    const invalidInput = await this.browser.$('.is-invalid')
    if(await invalidInput.isDisplayed()){
        throw new Error('Input невалидный');
    }
    }),

    it('Проверка валидации отправки формы', async function(){

        await this.browser.setWindowSize(1440, 1000);
        await this.browser.url(`${baseUrl}${bugId}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`${baseUrl}/cart${bugId}`);
        const inputName = await this.browser.$('#f-name')
        await inputName.setValue('Ваня')
        const inputPhone = await this.browser.$('#f-phone')
        await inputPhone.setValue('7877878787')
        const inputAdress = await this.browser.$('#f-address')
        await inputAdress.setValue('улица Пушкина дом Колотушкина')
        const buttonForm = await this.browser.$('.Form-Submit')
        await buttonForm.click();
        
        
        
        const cartMessage = await this.browser.$('.alert-danger')
        if(await cartMessage.isDisplayed()){
            throw new Error('CartMessage другого цвета');
        }
    })
    it('Проверка отправки формы', async function(){

        await this.browser.setWindowSize(1440, 1000);
        await this.browser.url(`${baseUrl}${bugId}`);

        await this.browser.executeScript(
            'localStorage.setItem("example-store-cart", JSON.stringify({"0":{"name":"Ergonomic Mouse","count":6,"price":84}}));',
            []
          );

        await this.browser.url(`${baseUrl}/cart${bugId}`);

        const inputName = await this.browser.$('#f-name')
        await inputName.setValue('Ваня')
        const inputPhone = await this.browser.$('#f-phone')
        await inputPhone.setValue('7877878787')
        const inputAdress = await this.browser.$('#f-address')
        await inputAdress.setValue('улица Пушкина дом Колотушкина')
        const buttonForm = await this.browser.$('.Form-Submit')
        await buttonForm.click();
        
        if(await buttonForm.isDisplayed()){
            throw new Error('Заказ не отправляется, ошибка в кнопке формы');
        }
    })
});
