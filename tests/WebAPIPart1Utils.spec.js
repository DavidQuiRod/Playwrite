const { test, expect, request } = require('@playwright/test');
//para obtener el cuerpo de la solicitud podemos revisar en network y en el apartado de payload para obtener el cuerpo de la solicitud
//lo mismo aplica para la respuesta del api podemos revisar en el response
const loginPayLoad = { "userEmail": "brigael.bmp@gmail.com", "userPassword": "Practica12345" }
const orderPayload={orders: [{country: "Mexico", productOrderedId: "68a961959320a140fe1ca57e"}]}
let token; //Se declara la variable global token para almacenar el valor que nos va a regresar como respuesta la api
//const orderId;
let orderId; //Se declara como variable global
test.beforeAll(async () => {  //Este es un test como antes de comensar has lo que este dentro de esto
    const apiContext = await request.newContext(); //Creamos una nueva variable para poder generar un request(solicitud al api)
    //para obtener el url del api es buscar en network del navegador y en headers
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", //mandamos la solicitud a la url que obtenemos del navegador
        { //agregamos el Body(cuerpo) de la solicitud
            data: loginPayLoad
         }    );
         expect(loginResponse.ok()).toBeTruthy(); //Esperamos que sea una respuesta del rango de 200 al 299 En caso de ser otro codigo marca error
         const loginResponJson=await loginResponse.json(); //obtenemos la respuesta del aplicativo en formato JSON
         token= loginResponJson.token; //cuando revisamos la respuesta del api podemos obtener los valores con la opcion de los atributos de regreso
         console.log(token); //imprimimos el token para ver lo que nos trae
         //api para generar orden de compra
         const orderResponse= await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
            data:orderPayload, //mandamos el cuerpo de la solicitud
            headers:{ //agregamos los headers para la peticion
                'Authorization':token, // agregamos la autorizacion para ver quien nos da acceso o si se sincorniza con el login que se hizo con el api
                'Content-Type': 'application/json' //declaramos que tipo de cuerpo tendra
            },
         })
         const orderResponseJson= await orderResponse.json();
         console.log(orderResponseJson);
         orderId=orderResponseJson.orders[0];

});

test.beforeEach(() => {

});
//Para poder hacer el uso de consumo de apis con playwright preguntale a tu desarrollador como se guarda la información que se manda.

// beforetest 1, test2, test 3
test('Client App Login with APIs and clean code', async ({ page }) => {
    //Al obtener un token con ayuda de la api se puede evitar uno el paso de login.
    await page.addInitScript(value => {  //creamos un scrips de javascript para ejecutar al inicio del test de playwright
        window.localStorage.setItem('token',value); //utilizamos la opcion de window y localeStorage para mandar un item, que se le asignar el valor
    }, token) //mandamos el valor que va a obtener
    //Con el script anterior ya no necesitamos hacer el proceso de login que es ingresar usuario contraseña y dar click en el boton
    //Nota si no ponemos la siguente url despues del consumo de la API este test nos va a fallar porque estariamos buscando una URL distinta a la que  nos dejo avanzar el api
    await page.goto("https://rahulshettyacademy.com/client/"); //para que continue el proceso de acciones del test se agrega la url donde va a iniciar el proceso de paso a paso 
    await page.locator("button[routerlink*='myorders']").waitFor();
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
    await page.pause();
    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    //await page.pause();

});

//Verify if order created is showing in history page
//Precondition - create order --
//api para crear ordenes https://rahulshettyacademy.com/api/ecom/order/create-order
//{orders: [{country: "Mexico", productOrderedId: "68a961959320a140fe1ca57e"}]}