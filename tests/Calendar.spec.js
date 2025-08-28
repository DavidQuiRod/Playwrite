const {test, expect}= require("@playwright/test");


test("Calendar Validations", async ({page})=>
    {

        const monthNumber="6";  // se declara la variable de mes
        const date="15"; // se declara la variable de dia
        const year="2027";  // Se declara la variable de año
        const expectedList=[monthNumber,date,year];  // Se declara esta lista de lo esperado 

        await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");  //URL del mercadito
        await page.locator(".react-date-picker__calendar-button").click(); //Click en el icono de calendario
        await page.locator(".react-calendar__navigation__label__labelText").click();// click en el boton de dia para cambiar a mes
        await page.locator(".react-calendar__navigation__label__labelText").click(); // clien de nuevo en el boton de mes para cambiar a año
        await page.getByText(year).click(); //Seleccionamos el año
        await page.locator(".react-calendar__year-view__months__month").first().waitFor(); //Esperamos a que cargue la primera etiqueta de meses
        await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click(); // Seleccionamos el mes deseado
        await page.locator("//abbr").first().waitFor();// esperamos a que cargue la primer etiqueta de los dias
        await page.locator("//abbr[text()='"+date+"']").click(); // seleccionamos el dia

        const inputs= page.locator('.react-date-picker__inputGroup__input'); //Se declara la variable global para los inputs donde se alojan los valores que mandamos

        for(let i=0; i<expectedList.length; i++){ //Ciclo for para ir validando que coincidan los valores esperados en los campos de dia, año y mes
            const value= await inputs.nth(i).inputValue();
            console.log(value);
            expect(value).toEqual(expectedList[i]);
        }






    });