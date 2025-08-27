const { test, expect } = require('@playwright/test');

test('@Webst Client App Login with Special locators', async ({ page }) => {
    const email = 'brigael.bmp@gmail.com';
    const products = await page.locator(".card-body");
    const productName = 'ADIDAS ORIGINAL';
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    //Paso 1 hacer Login
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Practica12345");
    await page.getByRole("button", { name: 'Login' }).click();
    await page.waitForLoadState('networkidle'); //La funcion waitForLoadStates espera que se realicen y completen los llamados de los microservicios
    await page.locator(".card-body b").first().waitFor();//tenemos que poner esta linea despues de networkidle para que carguen bien las etiquetas HTML
    await page.locator(".card-body").filter({ hasText: productName }).getByRole("button", { name: ' Add To Cart' }).click();
    await page.getByRole('listitem').getByRole("button", { name: 'Cart' }).click();
    await page.locator("div li").first().waitFor(); //Aqui se encuentran todos las cartas que salen en el carrito de compras
    //await page.locator("h3:has-text('ADIDAS ORIGINAL')").waitFor(); //Cuando se vaya a realizar un proceso de visible hay que poner esta sentencia porque tarda en cargar el navegador
    await expect(page.getByText(productName)).toBeVisible();
    console.log("Si es visible el valor"); //Este es un mensaje que quiero visualizar en la consola
    await page.getByRole('button', { name: 'Checkout' }).click();
    console.log("Se da click en el boton de checkout");
    await page.getByPlaceholder('Select Country').pressSequentially('United ST'); //pressSequentially es un nuevo metodo para ingresar texto tecla por tecla
    //otra forma de aplicar el metodo de tecla por tecla es pressSequentially('United',{ delay: 150})
    const dropdown= page.locator(".ta-results");
    await dropdown.waitFor(); //Recuerda siempre poner los await para que cargue bien la pagina
    //await page.getByRole('button', { name: 'United States' }).nth(3).click();
    await page.getByRole("button",{name: "United States"}).nth(0).click();
    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
    console.log("Es visible la etiqueta")

});

test('@Webst Client App login Codigo del curso Special Locators', async ({ page }) => {
   //js file- Login js, DashboardPage
   const email = "anshika@gmail.com";
   const productName = 'ZARA COAT 3';
   const products = page.locator(".card-body");
   await page.goto("https://rahulshettyacademy.com/client");
   await page.getByPlaceholder("email@example.com").fill(email);
   await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
   await page.getByRole('button',{name:"Login"}).click();
   await page.waitForLoadState('networkidle');
   await page.locator(".card-body b").first().waitFor();
   
   await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add to Cart"}).click();
 
   await page.getByRole("listitem").getByRole('button',{name:"Cart"}).click();
 
   //await page.pause();
   await page.locator("div li").first().waitFor();
   await expect(page.getByText("ZARA COAT 3")).toBeVisible();
 
   await page.getByRole("button",{name :"Checkout"}).click();
 
   await page.getByPlaceholder("Select Country").pressSequentially("ind");
 
   await page.getByRole("button",{name :"India"}).nth(1).click();
   await page.getByText("PLACE ORDER").click();
 
   await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});