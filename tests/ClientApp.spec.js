const { test, expect } = require('@playwright/test');
const { assert, Console } = require('console');
//const {expect}= require('../playwright.config'); //<- forma de importa librerias o archivos

test('Practica del curso de playwright', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

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
    const titulos = await page.locator(".card-body b").allTextContents();
    console.log(titulos);
    //await page.locator("//b[contains(text(), 'ZARA COAT 3')]").textContent();

});
//Caso de prueba desarrollado por mi
test('Practica 2 del curso con un caso de End to End con playwright', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const email = 'brigael.bmp@gmail.com';
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    //Paso 1 hacer Login
    await page.locator('//*[@id="userEmail"]').fill(email);
    await page.locator('//*[@id="userPassword"]').fill("Practica12345");
    await page.locator('//*[@id="login"]').click();
    //Paso 2 Ingresar al mercado digital y obtener el titulo de los tenis
    await page.locator(".card-body b").nth(1).waitFor(); //esperamos a que cargue el valor de la etiqueta
    const producto = await page.locator(".card-body b").nth(1).textContent();
    console.log(producto);
    //Paso 3 Seleccionar para comprar
    await page.locator("button.w-10").nth(1).click();
    console.log('Se agregan el producto ' + producto);
    //Paso 4 Ir a la cesta del carrito
    await page.locator("button.btn-custom").nth(2).waitFor(); //Esperamos a que cargue el valor del carrito
    await page.locator("button.btn-custom").nth(2).click();
    console.log('Se dio click al boton de carrito');
    //Paso 5 Verificar que sea el mismo producto que nosotros pusimos
    const Etiqueta = page.locator("div.cartSection h3");
    await Etiqueta.waitFor();
    console.log('Esperamos a que cargue la pagina');
    //const productoDeLaCanasta=await Etiqueta.textContent();
    await expect(Etiqueta).toContainText(producto);
    console.log('Si es el mismo producto');
    //Paso 6 Seleccionar botón checkout
    await page.locator("li.totalRow button").click();
    console.log('Click al botón del checkout');
    //Paso 7 revisar que la etiqueta del producto y cantidad sea la misma despues del checkout sea la misma
    const etiquetaFinalDeCompras = page.locator("div.item__title");
    await etiquetaFinalDeCompras.waitFor();
    console.log('Esperamos a que cargue la ultima pagina para comprar');
    await expect(etiquetaFinalDeCompras).toContainText(producto);
    console.log('El producto final si es el mismo que el inicial');
    //Obtener texto de etiqueta
    const textoDeProductos = await page.locator("div.item__quantity").textContent(); //Obtenemos la cadena
    console.log(textoDeProductos); //Imprimimos la cadena
    const dividirTexto = textoDeProductos.split(':'); //dividimos la cadena
    console.log(dividirTexto);
    const totalDeProducto = dividirTexto[1].split(" ")[1];
    //const totalDeProducto=dividirTexto[1].replace(" ","");
    console.log(totalDeProducto);
    console.log('El numero obtenido es : ' + totalDeProducto);
    //await expect(totalDeProducto).toContain('1');
    await expect(totalDeProducto).toEqual('1');
    console.log('Si es la misma cantidad de productos');
    //Pao 8 Completar los demas campos
    const txtCampos = await page.locator("input.input");
    await txtCampos.nth(1).fill('666'); //Ingresamos el CVV
    await txtCampos.nth(5).fill('United States'); //Ingresamos el pais
    //Revisar que sea el mismo correo que ingresamos en el inicio de sesion
    const revisarCorreo = await page.locator('div.user__name label').textContent(); //Obtenemos el correo de la etiqueta
    console.log('El correo obtenido es: '+revisarCorreo);
    await expect(revisarCorreo).toEqual(email); //Validamos si son iguales en caso de que no truena el programa
    console.log('Si son los mismos correos');
    await txtCampos.nth(3).fill('rahulshettyacademy');//ingresamos el cupon de validacion
    await page.locator('button.mt-1').click(); //damos click en el boton de aplicar cupon
    await page.locator('p.mt-1').waitFor(); //Esperamos a que cargue el servicio de cange
    expect(await page.locator('p.mt-1')).toBeVisible();//Validamos si es visible la etiqueta
    console.log('Si es visible la etiqueta de canjeo');
    await page.locator('a.action__submit').click(); //Se da click a la orden de compra
    //Se queda pendiente la automatizacion empezo a fallar el sitio de pruebas

    //await page.locator("div.item__quantity").textContent();
    //await page.pause();
});

//Caso de prueba dinamico()
test('Practica 2 del curso codigo del curso', async ({ browser }) => {
    const email = 'brigael.bmp@gmail.com';
    const context = await browser.newContext();
    const page = await context.newPage();
    const products=await page.locator(".card-body");
    const productName='ADIDAS ORIGINAL';
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    //Paso 1 hacer Login
    await page.locator('//*[@id="userEmail"]').fill(email);
    await page.locator('//*[@id="userPassword"]').fill("Practica12345");
    await page.locator('//*[@id="login"]').click();
    await page.waitForLoadState('networkidle'); //La funcion waitForLoadStates espera que se realicen y completen los llamados de los microservicios
    await page.locator(".card-body b").first().waitFor();//tenemos que poner esta linea despues de networkidle para que carguen bien las etiquetas HTML
    const titles=await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count=await products.count(); //Sacamos el numero total de productos mostrados en la pagina
    console.log(count);
    for(let i=0; i<count; i++){
        if(await products.nth(i).locator("b").textContent()=== productName){
            //products.nth(i).locator("button.w-10").click();
            await products.nth(i).locator("text= Add To Cart").click();
            console.log("Se agrega el producto: "+ productName);
            break; //con esto se rompe el ciclo for y ya no va a iterar mas
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); //Aqui se encuentran todos las cartas que salen en el carrito de compras
    //await page.locator("h3:has-text('ADIDAS ORIGINAL')").waitFor(); //Cuando se vaya a realizar un proceso de visible hay que poner esta sentencia porque tarda en cargar el navegador
    const bool= await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    console.log(bool); //Este es de mi parte para ver el valor que muestra
    expect(bool).toBeTruthy(); //forma de validar si algo es verdaredo en caso de que sea false falla.
    console.log("Si es visible el valor"); //Este es un mensaje que quiero visualizar en la consola
    await page.locator("text=Checkout").click();
    console.log("Se da click en el boton de checkout");
    //await page.locator("[placeholder*='Country']").fill('United')
    await page.locator("[placeholder*='Country']").pressSequentially('United'); //pressSequentially es un nuevo metodo para ingresar texto tecla por tecla
    //otra forma de aplicar el metodo de tecla por tecla es pressSequentially('United',{ delay: 150})
    const dropdown= page.locator(".ta-results");
    await dropdown.waitFor(); //Recuerda siempre poner los await para que cargue bien la pagina
    const optionsCount=await dropdown.locator("button").count();
    console.log(optionsCount);
    for(let i=0; i<optionsCount; i++){
        const text= await dropdown.locator("button").nth(i).textContent();
        console.log("El valor del numeo "+i+" Es "+text);
        if(text.includes(" United States")){ //Metodo para saber si un etiqueta tiene el valor que mandamos
            await dropdown.locator("button").nth(i).click();
            break;
        }
        /*if(text=== ' United States'){
            await dropdown.locator("button").nth(i).click();
            console.log('Se selecciono el valor de United States');
            break;
        }*/
    }
    expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
   await page.locator(".action__submit").click();
   await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
   const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
   console.log(orderId);
 
   await page.locator("button[routerlink*='myorders']").click();
   await page.locator("tbody").waitFor();
   const rows = await page.locator("tbody tr");
 
 
   for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
         await rows.nth(i).locator("button").first().click();
         break;
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent();
   expect(orderId.includes(orderIdDetails)).toBeTruthy();
   //await page.pause();

});

