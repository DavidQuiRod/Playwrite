const { test, expect, request } = require('@playwright/test');
//para obtener el cuerpo de la solicitud podemos revisar en network y en el apartado de payload para obtener el cuerpo de la solicitud
//lo mismo aplica para la respuesta del api podemos revisar en el response
const loginPayLoad = { "userEmail": "brigael.bmp@gmail.com", "userPassword": "Practica12345" }
let token; //Se declara la variable global token para almacenar el valor que nos va a regresar como respuesta la api
test.beforeAll(async () => {  //Este es un test como antes de comensar has lo que este dentro de esto
    const apiContext = await request.newContext(); //Creamos una nueva variable para poder generar un request(solicitud al api)
    //para obtener el url del api es buscar en network del navegador y en headers
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", //mandamos la solicitud a la url que obtenemos del navegador
        { //agregamos el Body(cuerpo) de la solicitud
            data: loginPayLoad
         }    )
         expect(loginResponse.ok()).toBeTruthy(); //Esperamos que sea una respuesta del rango de 200 al 299 En caso de ser otro codigo marca error
         const loginResponJson=await loginResponse.json(); //obtenemos la respuesta del aplicativo en formato JSON
         token= loginResponJson.token; //cuando revisamos la respuesta del api podemos obtener los valores con la opcion de los atributos de regreso
         console.log(token); //imprimimos el token para ver lo que nos trae
});

test.beforeEach(() => {

});
//Para poder hacer el uso de consumo de apis con playwright preguntale a tu desarrollador como se guarda la información que se manda.

// beforetest 1, test2, test 3
test('Client App Login with APIs', async ({ page }) => {
    //Al obtener un token con ayuda de la api se puede evitar uno el paso de login.
    // await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    // console.log(await page.title());
    // //Paso 1 hacer Login
    // await page.locator('//*[@id="userEmail"]').fill(email);
    // await page.locator('//*[@id="userPassword"]').fill("Practica12345");
    // await page.locator('//*[@id="login"]').click();
    // await page.waitForLoadState('networkidle'); //La funcion waitForLoadStates espera que se realicen y completen los llamados de los microservicios
    await page.addInitScript(value => {  //creamos un scrips de javascript para ejecutar al inicio del test de playwright
        window.localStorage.setItem('token',value); //utilizamos la opcion de window y localeStorage para mandar un item, que se le asignar el valor
    }, token) //mandamos el valor que va a obtener
    //Con el script anterior ya no necesitamos hacer el proceso de login que es ingresar usuario contraseña y dar click en el boton
    const email = 'brigael.bmp@gmail.com';
    const products = await page.locator(".card-body");
    const productName = 'ADIDAS ORIGINAL';
    //Nota si no ponemos la siguente url despues del consumo de la API este test nos va a fallar porque estariamos buscando una URL distinta a la que  nos dejo avanzar el api
    await page.goto("https://rahulshettyacademy.com/client/"); //para que continue el proceso de acciones del test se agrega la url donde va a iniciar el proceso de paso a paso 
    await page.locator(".card-body b").first().waitFor();//tenemos que poner esta linea despues de networkidle para que carguen bien las etiquetas HTML
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count(); //Sacamos el numero total de productos mostrados en la pagina
    console.log(count);
    for (let i = 0; i < count; i++) {
        if (await products.nth(i).locator("b").textContent() === productName) {
            //products.nth(i).locator("button.w-10").click();
            await products.nth(i).locator("text= Add To Cart").click();
            console.log("Se agrega el producto: " + productName);
            break; //con esto se rompe el ciclo for y ya no va a iterar mas
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); //Aqui se encuentran todos las cartas que salen en el carrito de compras
    //await page.locator("h3:has-text('ADIDAS ORIGINAL')").waitFor(); //Cuando se vaya a realizar un proceso de visible hay que poner esta sentencia porque tarda en cargar el navegador
    const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    console.log(bool); //Este es de mi parte para ver el valor que muestra
    expect(bool).toBeTruthy(); //forma de validar si algo es verdaredo en caso de que sea false falla.
    console.log("Si es visible el valor"); //Este es un mensaje que quiero visualizar en la consola
    await page.locator("text=Checkout").click();
    console.log("Se da click en el boton de checkout");
    //await page.locator("[placeholder*='Country']").fill('United')
    await page.locator("[placeholder*='Country']").pressSequentially('United'); //pressSequentially es un nuevo metodo para ingresar texto tecla por tecla
    //otra forma de aplicar el metodo de tecla por tecla es pressSequentially('United',{ delay: 150})
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor(); //Recuerda siempre poner los await para que cargue bien la pagina
    const optionsCount = await dropdown.locator("button").count();
    console.log(optionsCount);
    for (let i = 0; i < optionsCount; i++) {
        const text = await dropdown.locator("button").nth(i).textContent();
        console.log("El valor del numeo " + i + " Es " + text);
        if (text.includes(" United States")) { //Metodo para saber si un etiqueta tiene el valor que mandamos
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

//Verify if order created is showing in history page
//Precondition - create order --
//api para crear ordenes https://rahulshettyacademy.com/api/ecom/order/create-order
//{orders: [{country: "Mexico", productOrderedId: "68a961959320a140fe1ca57e"}]}