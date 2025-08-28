const {test, expect}= require("@playwright/test");


test("Pop up validations", async ({page})=>
    {
        await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

        // await page.goto("https://google.com");
        // await page.goBack(); //Metodo para regresar a una pagina anterior
        // await page.goForward(); // Metodo para regresar a una pagina posterior
        await expect(page.locator("#displayed-text")).toBeVisible(); //Esperamos a que sea visiblemun texto, etiqueta, etc
        await page.locator("#hide-textbox").click(); // Se da click en el boton para ocultar el texto
        await expect(page.locator("#displayed-text")).toBeHidden(); //Esperamos para que realmente este este escondido
        //await page.pause();
        page.on('dialog',dialog=>dialog.accept()); //Revisar mas a detalle no se logro identificar el pop up
        await page.locator("#confirmbtn").click();
        await page.locator("#mousehover").click();
        const framesPage= page.frameLocator("#courses-iframe"); //Se declara una variable para poder ingresar a nuevos iframes que esten dentro de la pagina y queramos interactuar con ellos
        await framesPage.locator("li a[href*='lifetime-access']:visible").click(); //Se pone el padre iframe y podemos utilizar los metodos de localizacion de playwright
        //En caso de haber mas de 1 etiqueta con esas especificacion pero una esta oculta o una visible podemos apuntar a la que es visible anexando ese pedaso de codigo :visible
        const textCheck=await framesPage.locator(".text h2").textContent();
        console.log(textCheck.split(' ')[1]);
        //framesPage.locator(".new-navbar-highlighter").nth(0).click();

        await page.pause();
        


    })