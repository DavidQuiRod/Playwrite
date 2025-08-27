import {test, expect} from '@playwright/test';

test.only('Plawright Special locators', async({page})=> {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click(); //con esta funcion podemos encontrar una etiqueta con el texto y dar click
    await page.getByLabel("Student").check();// tambien aplica para los radio button y checkbox
    //Para los radio button y checkbox se puede utilizar la funcion check en vez de click pero ambas funcionan bien para seleccionarlo
    await page.getByLabel("Gender").selectOption('Female');//La funcion para seleccionar un valor en un selectBox es selectOption y mandas el valor a elegir
    /*Para poder localizar un input text con leyenda en el placeholder puedes utilizar la funcion getByPlaceholder */
    await page.getByPlaceholder("Password").fill("123456");
    /*Para poder localizar una etiqueta cualquiera en el DOM de HTML podemos utilizar la funcion getByRole y nos mostrara las diferentes etiquetas que podemos ingresar ahi, ya solo sera complementar con los valores que tenga esa etiqueta */
    await page.getByRole('button',{name: 'Submit'}).click();
    /*Para localizar una etiqueta en el DOM se puede etilizar la funcion getByText para poder localizarla con el texto que esta contiene */
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    await page.getByRole('link',{name:"Shop"}).click();
    /*otra forma de encontrar etiquetas en el DOM de HTML es con un identificador que acapare todos los elementos y lo filtramos con la funcion filter({Por text,'Texto de la etiqueta'}) */
    await page.locator("app-card").filter({hasText:'Nokia Edge'}).getByRole('button',{name:'Add'}).click();
    //await page.pause();
})