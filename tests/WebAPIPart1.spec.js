const {test, expect, request}= require('@playwright/test');
const loginPayload={"userEmail": "brigael.bmp@gmail.com", "userPassword": "Practica12345"}

test.beforeAll(async ()=>
    {
        const apiContext= await request.newContext();
        //await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", data:loginPayload )

    });

test.beforeEach(()=>
    {

    });

    // beforetest 1, test2, test 3
test('Client App Login with APIs', async ({ browser }) => {
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

