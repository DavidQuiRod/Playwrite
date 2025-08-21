const {test, expect}= require('@playwright/test');
//const {expect}= require('../playwright.config'); //<- forma de importa librerias o archivos

    test('Practica del curso de playwright', async({browser})=>
    {
        const context= await browser.newContext();
        const page=await context.newPage();

        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
        console.log(await page.title());

        //Paso 1 hacer Login
        await page.locator('//*[@id="userEmail"]').fill("brigael.bmp@gmail.com");
        await page.locator('//*[@id="userPassword"]').fill("Practica12345");
        await page.locator('//*[@id="login"]').click();
        //Paso 2 ingresar al mercado digital y obtener el titulo del primer producto
        //await page.waitForLoadState('networkidle'); //La funcion waitForLoadStates espera que se realicen y completen los llamados de los microservicios
        //Otra forma de esperar a que carguen los parametros es con la siguiente sentencia.
        await page.locator(".card-body b").first().waitFor();
        console.log(await page.locator(".card-body b").first().textContent()); 
        const titulos=await page.locator(".card-body b").allTextContents();
        console.log(titulos);
        //await page.locator("//b[contains(text(), 'ZARA COAT 3')]").textContent();
        
    });
