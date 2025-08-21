const {test, expect}= require('@playwright/test');
const { promises } = require('dns');
//const {expect}= require('../playwright.config'); //<- forma de importa librerias o archivos


test('Browser Context Playwright test', async ({browser})=>
    {
        //chrome -plugins/ cookies
        //Variables Globales
        const context = await browser.newContext();
        const page = await context.newPage();
        const userName=page.locator('//*[@id="username"]');
        const password=page.locator('//*[@id="password"]');
        const buttonSigIn=page.locator('//*[@id="signInBtn"]');
        const cardTitle=page.locator(".card-body a ");
        //Inicio de script
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        console.log(await page.title()); //LoginPage Practise | Rahul Shetty Academy
        // css, xpath /*Para poder ingresar un texto a un campo se utiliza el metodo fill*/ 
        await userName.fill('rahulshettyacademyMM');//Se puede utilizar el xpath para localizar los elementos en la pagina web
        await password.fill('learning');
        await buttonSigIn.click();
        console.log(await page.locator("[style*='block']").textContent());
        await expect(page.locator("[style*='block']")).toContainText('Incorrect username/password.');
        //Segunda insercion de datos pero correctos
        await userName.fill("");
        await userName.fill("rahulshettyacademy");
        await buttonSigIn.click();
        console.log(await cardTitle.first().textContent()); //Obtenemos el texto del objeto localizado en este caso es el 1 de 4
        console.log(await cardTitle.nth(1).textContent()); //Con la funcion nth(1) podemos obtener el titulo que uno dese dependiendo de los objetos el inicio de conteo es apartir del 0
        console.log(await cardTitle.allTextContents()); //Obtenemos todos los  textos de los objetos encontrados

    });

    test('UI Controls', async({page})=>{
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); //ingresar a la pagina
        const userName=page.locator('//*[@id="username"]');// variable de usuario
        const password=page.locator('//*[@id="password"]'); //variable
        const dropdown=page.locator('select.form-control'); // localizador de dropdown
        const documentLink=page.locator("[href*='documents-request']");
        await dropdown.selectOption("Consultant"); //Con la funcion selectOption se puede seleccionar el valor que le des dentro del dropdown
        await page.locator('#usertype').last().click(); //Con las funcion last puede agarrar el ultimo valor de los que tienes ese CSS en su etiqueta si hay muchos utilizar la nth(#)
        await page.locator('//*[@id="okayBtn"]').click(); //Seleccionar boton ok del pop up message
        console.log(await page.locator('#usertype').last().isChecked()); //Escribe en consola si el ultimo radio button esta checkeado
        await expect(page.locator('#usertype').last()).toBeChecked(); //Agregamos esta validadcion si es verdadera pasa en caso de que no falla
        await page.locator('//*[@id="terms"]').click(); // Damos click en el checkbox de terminos y condiciones
        console.log('Mensaje prueba : '+await page.locator('//*[@id="terms"]').isChecked()); // Escribe en consola si el checkbox de terminos y condicones esta checkeado
        await expect(page.locator('//*[@id="terms"]')).toBeChecked(); //Esperamos a que sea verdadero el checkeo en caso de que no falla el script
        await page.locator('//*[@id="terms"]').uncheck();// La funcion uncheck desmarca un checkbox.
        await expect( await page.locator('//*[@id="terms"]').isChecked()).toBeFalsy(); //Verificamos si es verdadero que el checkbox esta deschekeado
        await expect(documentLink).toHaveAttribute('class','blinkingText'); //[href*='documents-request'] //Validamos si la etiqueta contiene esa clase y ese atributo dentro de la clase
        // assertion 
        //ME quede en la leccion 20 del curso
        //await page.pause(); // funcion que hace que pare el script de playwright


    });
    test('Prueba de atraccion de correo en el campo username', async({page})=>
        { //Siempre utilizar la palabra reservada await para que funcione las sentencias de playwright con javascript
            await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); //ingresar a la pagina
            const userName=page.locator('#username');
            await userName.fill("PRUEBA");
            await page.locator('#password').fill('learning');
            await page.pause();
            const textoObtenido=await userName.inputValue(); //Para obtener un valor de una caja de texto se tiene que extraer con la funcion inputValue()
            //Si introduces la funcion textContent() no va a funcionar porque el valor es vacio el value es el que se llena
            console.log('Texto de prueba');
            console.log('Texto obtenido del cuadro de username: '+ textoObtenido);
        })
    test('Child window handled', async({browser})=>
    {
        const context= await browser.newContext();
        const page= await context.newPage();
        const userName=await page.locator('#username');
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); //ingresar a la pagina
        const documentLink=page.locator("[href*='documents-request']");
        //La siguiente variable tipo matriz es una pagina hijo para poder trabajar dentro de ella es como los frameset o similar
        const [nuevaPagina] = await Promise.all( //Se genera una variable tipo matriz para generar promesas de espera para poder abrir una nueva pestaña o pagina
            [ //La sentencia Pomise.all es para esperar a que se cumplan todas las condicones que se le ingresen dentro de la matriz
                context.waitForEvent('page'),//Espera que pase el evento para abrir una nueva pagina
                documentLink.click(), //Dar click a link que te dirigira a una nueva pagina, pestaña etc.
            ])
        const text = await nuevaPagina.locator('.red').textContent(); //Declaramos una variable para obtener el texto de la siguiente pagina
        console.log(text); //Imprimimos el texto en consola
        const arrayText =text.split('@'); //Delimitamos para que se divida en partes y quite el @ del texto quedan dos lineas de texto completas
        console.log(arrayText); //Aqui se imprime los valores separados que no incluyen el arroba y son 2 cadenas de texto con valor de 0 y 1 para el array
        const domainX=arrayText[1].split(" "); //Separamos el texto al delimitar en espacio en blanco lo que divide en 8 partes que se numeran del 0 al 7
        console.log(domainX); //Se imprimen los 8 textos separados por
        const domain = arrayText[1].split(" ")[0];//Tomamos el valor del array 1 y separamos en partes la cadena con un espacio en blanco y tomamos el valor de 0 en la array para tener el correo electronico
        console.log(domain); //Imprimimos el dominio que se agarro
        //Una vez tomado el texto del correo queremos introducirlo al campo username de la pagina padre y se hace de la siguiente manera.
        //Playwright te permite regresar a la otra pagina padre solo con introducir su legado o gerarquia
        await page.locator('#username').fill(domain);
        const textoCorreo= await page.locator('#username').inputValue();
        console.log('Se imprime el correo que se agarro:');
        console.log(textoCorreo);
        //Me quede en la sesion 23 del curso
    });

    test('Page Playwright Test', async ({page})=>
        {
            /*chrome -plugins/ cookies
            const context = await browser.newContext();
            const page = await context.newPage(); */
            //await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
            await page.goto("https://www.google.com/"); //<- pagina diferente para pver como funciona el navegador en playwright
            // get title - assertion
            console.log(await page.title());
            await expect(page).toHaveTitle("Google");
    
        });    
        /* primeros escenarios documentados por mi para el curso
//test('First playwright test',async function(){  <- Esta es una forma de utilizar en java script para las funciones
test('First playwright test',async ({browser,page})=>{ // <- esta es otra forma de utilizar las funciones
    //Playwright code -
    //Open Chrome - plugins / cookies
    //Step1 -open browser
    //Se tienen que declarar variables con los proceso para que se ubiquen mejor
    //const context = await browser.newContext();  //se crea para generar un nuevo contexto en el browser
    //const page = await context.newPage(); //Se declara page para poder abrir una pagina en el browser o navegador de tu eleccion
    //Se comentaron las variables context y page porque se declaro una variable en el inicio de la funcion
    await page.goto("rahulshettyacademy.com/loginpagePractise/");
    
    //Step2 -enter User/Passwor 2 seconds

    //Step3 - click in boton login

}); */