const {test, expect}= require('@playwright/test');
const { assert, Console } = require('console');
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

    test.only('Practica 2 del curso con un caso de End to End con playwright', async ({browser})=>
        {
            const context= await browser.newContext();
        const page=await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
        console.log(await page.title());
        //Paso 1 hacer Login
        await page.locator('//*[@id="userEmail"]').fill("brigael.bmp@gmail.com");
        await page.locator('//*[@id="userPassword"]').fill("Practica12345");
        await page.locator('//*[@id="login"]').click();
        //Paso 2 Ingresar al mercado digital y obtener el titulo de los tenis
        await page.locator(".card-body b").nth(1).waitFor(); //esperamos a que cargue el valor de la etiqueta
        const producto=await page.locator(".card-body b").nth(1).textContent();
        console.log(producto); 
        //Paso 3 Seleccionar para comprar
        await page.locator("button.w-10").nth(1).click();
        console.log('Se agregan el producto ' + producto);
        //Paso 4 Ir a la cesta del carrito
        await page.locator("button.btn-custom").nth(2).waitFor(); //Esperamos a que cargue el valor del carrito
        await page.locator("button.btn-custom").nth(2).click();
        console.log('Se dio click al boton de carrito');
        //Paso 5 Verificar que sea el mismo producto que nosotros pusimos
        const Etiqueta=page.locator("div.cartSection h3");
        await Etiqueta.waitFor();
        console.log('Esperamos a que cargue la pagina');
        //const productoDeLaCanasta=await Etiqueta.textContent();
        await expect(Etiqueta).toContainText(producto);
        console.log('Si es el mismo producto');
        //Paso 6 Seleccionar botón checkout
        await page.locator("li.totalRow button").click();
        console.log('Click al botón del checkout');
        //Paso 7 revisar que la etiqueta del producto y cantidad sea la misma despues del checkout sea la misma
        const etiquetaFinalDeCompras=page.locator("div.item__title");
        await etiquetaFinalDeCompras.waitFor();
        console.log('Esperamos a que cargue la ultima pagina para comprar');
        await expect(etiquetaFinalDeCompras).toContainText(producto);
        console.log('El producto final si es el mismo que el inicial');
        //Obtener texto de etiqueta
        const textoDeProductos= await page.locator("div.item__quantity").textContent(); //Obtenemos la cadena
        console.log(textoDeProductos); //Imprimimos la cadena
        const dividirTexto=textoDeProductos.split(':'); //dividimos la cadena
        console.log(dividirTexto);
        const totalDeProducto=dividirTexto[1].split(" ")[1];
        //const totalDeProducto=dividirTexto[1].replace(" ","");
        console.log(totalDeProducto);
        console.log('El numero obtenido es : '+ totalDeProducto);
        await expect(totalDeProducto).toContain('1');
        console.log('Si es la misma cantidad de productos');
        //await page.locator("div.item__quantity").textContent();
        //await page.pause();
        });
