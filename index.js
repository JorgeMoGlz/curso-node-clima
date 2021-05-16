require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

// console.log(process.env.MAPBOX_KEY);


const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {
        opt = await inquirerMenu();

        switch(opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(termino);
                
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id==='0') continue;

                const lugarSeleccionado = lugares.find(l => l.id === id);
                
                // Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                
                // Datos del clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                
                // Mostrar resultados
                console.log('\nInformación del lugar\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('Clima: ', clima.desc);
            break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    console.log(`${i+1} ${lugar}`)
                })

                // console.log(busquedas.leerDB());

            break
        }

        if(opt !== 0) await pausa();

    } while(opt !== 0);

    console.clear();
}

main();