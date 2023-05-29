/**
 * @author Raul Galindo
 * @description Unicamente interaccion con la UI.
 */
import { getAllCostosPaquete } from '../../../modules/cotizador/application/CostosPaquete.js';
import { checkLimitesPaquete, } from '../../../modules/cotizador/application/LimitesPaquetes.js';
import { costosEnterprise, costosGrow, costosInstitutional, costosManufacturing, } from '../../../modules/cotizador/domain/CostosPaquetes.js';
import { costosTablaGrow, costosTablaInstitutional, costosTablaManufacturing, costosTablaEnterprise, } from '../../../modules/cotizador/domain/CostosTabla.js';
import { limitesEnterprise, limitesGrow, limitesInstitutional, limitesManufacturing, } from '../../../modules/cotizador/domain/LimitesPaquetes.js';
const tooltips = [
    [
        'tooltipIconHorarioAtencionEnterprises',
        'tooltipTextHorarioAtencionEnterprises',
    ],
    [
        'tooltipIconHorarioAtencionInternationalEnterprise',
        'tooltipTextHorarioAtencionInternationalEnterprise',
    ],
    [
        'tooltipIconPrecioRazonSocialAdicional',
        'tooltipTextPrecioRazonSocialAdicional',
    ],
    ['tooltipIconmigracion', 'tooltipTextmigracion'],
    ['tooltipIconcapacitacionesOnline', 'tooltipTextcapacitacionesOnline'],
    [
        'tooltipIconprecioFinalImplementacion',
        'tooltipTextprecioFinalImplementacion',
    ],
    ['tooltipIconprecioFacturacionAnual', 'tooltipTextprecioFacturacionAnual'],
    ['tooltipIconprecioPrimerAno', 'tooltipTextprecioPrimerAno'],
    ['tooltipIconcostoInicialGrow', 'tooltipTextcostoInicialGrow'],
    [
        'tooltipIconcostoInicialInstitutional',
        'tooltipTextcostoInicialInstitutional',
    ],
    [
        'tooltipIconcostoInicialManufacturing',
        'tooltipTextcostoInicialManufacturing',
    ],
    ['tooltipIconcostoInicialEnterprise', 'tooltipTextcostoInicialEnterprise'],
];
const inputsEnDOM = [
    {
        id: 'Usuarios',
        type: 'number',
        minValue: 1,
        maxValue: 10000,
    },
    {
        id: 'Empleados',
        type: 'number',
        minValue: 1,
        maxValue: 10000,
    },
    {
        id: 'Sucursales',
        type: 'number',
        minValue: 1,
        maxValue: 10000,
    },
    {
        id: 'Timbres',
        type: 'number',
        minValue: 1,
        maxValue: 10000,
    },
    // Pagos
    {
        id: 'ImplementacionMensual',
        type: 'checkbox',
    },
    {
        id: 'MembresiaMensual',
        type: 'checkbox',
    },
];
const spansCostos = [
    'precioPorUsuario',
    'precioPorUsuarioDespuesDeLimite',
    'activacion',
    'horaVirtualAdicional',
    'precioCapacitacionUsuarios',
    'upgradeVersion',
    'precioRazonSocialAdicional',
    'precioUsuarioAdicionalRazonSocial',
];
/**
 * ------------------ New Code Refactorized ------------------
 */
// Refactorizar es demasiado grande.
function togglePaqueteView(idContenedorElement, idBtnCotizarElement, idBtnContratarElement, idContainerActivacion, idContainerMigracion, idContainerCapacitacion, idContainerPrecioImplementacion, idContainerPrecioBase, idContainerFacturacionAnual, idContainerPrecioParaIniciar, idErrorSpan, mensajeDeError, enable) {
    const contenedor = document.getElementById(idContenedorElement);
    const btnCotizar = document.getElementById(idBtnCotizarElement);
    const btnContratar = document.getElementById(idBtnContratarElement);
    const error = document.getElementById(idErrorSpan);
    const contenedorActivacion = document.getElementById(idContainerActivacion);
    const contenedorMigracion = document.getElementById(idContainerMigracion);
    const contenedorCapacitacion = document.getElementById(idContainerCapacitacion);
    const contenedorPrecioImplementacion = document.getElementById(idContainerPrecioImplementacion);
    const contenedorPrecioBase = document.getElementById(idContainerPrecioBase);
    const contenedorFacturacionAnual = document.getElementById(idContainerFacturacionAnual);
    const contenedorPrecioParaIniciar = document.getElementById(idContainerPrecioParaIniciar);
    btnCotizar.classList.toggle('hidden', !enable);
    btnContratar.classList.toggle('hidden', !enable);
    error.classList.replace('text-white', !enable ? 'text-red-400' : 'text-white');
    const toggleOpacityAndBlur = (element, enable) => {
        element.classList.toggle('opacity-50', !enable);
        element.classList.toggle('blur-[0.65px]', !enable);
    };
    const togglePointerEvents = (element, enable) => {
        element.classList.toggle('pointer-events-none', !enable);
    };
    toggleOpacityAndBlur(contenedor, enable);
    toggleOpacityAndBlur(contenedorActivacion, enable);
    toggleOpacityAndBlur(contenedorMigracion, enable);
    toggleOpacityAndBlur(contenedorCapacitacion, enable);
    toggleOpacityAndBlur(contenedorPrecioImplementacion, enable);
    toggleOpacityAndBlur(contenedorPrecioBase, enable);
    toggleOpacityAndBlur(contenedorFacturacionAnual, enable);
    toggleOpacityAndBlur(contenedorPrecioParaIniciar, enable);
    togglePointerEvents(contenedorActivacion, enable);
    togglePointerEvents(contenedorMigracion, enable);
    togglePointerEvents(contenedorCapacitacion, enable);
    togglePointerEvents(contenedorPrecioImplementacion, enable);
    togglePointerEvents(contenedorPrecioBase, enable);
    togglePointerEvents(contenedorFacturacionAnual, enable);
    togglePointerEvents(contenedorPrecioParaIniciar, enable);
    error.textContent = mensajeDeError;
}
function printLabelDePaqueteRecomendado(atributosDinamicos, ...limitesPaquetes) {
    let paqueteRecomendado = limitesPaquetes.find((paquete) => atributosDinamicos.cantidadUsuariosRequeridos <=
        paquete.numeroDeUsuariosPermitidos &&
        atributosDinamicos.cantidadEmpleadosAgregados <=
            paquete.numeroDeEmpleadosPermitidos &&
        atributosDinamicos.cantidadSucursalesAgregadas <=
            paquete.numeroDeSucursalesPermitidas);
    if (paqueteRecomendado) {
        limitesPaquetes.forEach((paquete) => {
            const elemento = document.getElementById(`containerRecomendacion${paquete.nombrePaquete}`);
            elemento.classList.toggle('hidden', paquete !== paqueteRecomendado);
        });
    }
}
function reloadLabelDePaqueteRecomendado() {
    const atributosDinamicos = getAllAtributosDinamicosDeCotizador();
    if (atributosDinamicos.cantidadEmpleadosAgregados > 1 ||
        atributosDinamicos.cantidadSucursalesAgregadas > 1 ||
        atributosDinamicos.cantidadTimbresRequeridos > 1 ||
        atributosDinamicos.cantidadUsuariosRequeridos > 1) {
        printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
    }
}
function getAllAtributosDinamicosDeCotizador() {
    const timbresAgregados = document.getElementById('Timbres');
    const empleadosAgregados = document.getElementById('Empleados');
    const usuariosAgregados = document.getElementById('Usuarios');
    const sucursalesAgregados = document.getElementById('Sucursales');
    const isPagoImplementacionMensual = document.getElementById('ImplementacionMensual');
    const isPagoMembresiaMensual = document.getElementById('MembresiaMensual');
    const moneda = localStorage.getItem('moneda');
    const atributosDeCostosDinamicosPaquetes = {
        cantidadTimbresRequeridos: parseInt(timbresAgregados.value),
        cantidadEmpleadosAgregados: parseInt(empleadosAgregados.value),
        cantidadUsuariosRequeridos: parseInt(usuariosAgregados.value),
        cantidadSucursalesAgregadas: parseInt(sucursalesAgregados.value),
        isPagoImplementacionMensual: Boolean(isPagoImplementacionMensual.checked),
        isModalidadRentaMensual: Boolean(isPagoMembresiaMensual.checked),
        moneda,
    };
    return atributosDeCostosDinamicosPaquetes;
}
function printCostosPaquete(costosPaquete, atributosDeCostosDinamicosCotizador, nombrePaqueteCapitalize) {
    const costosPaquetes = getAllCostosPaquete(atributosDeCostosDinamicosCotizador, costosPaquete);
    for (const costo in costosPaquetes) {
        const selector = `${costo}${nombrePaqueteCapitalize}`;
        let costoFinal = costosPaquetes[costo];
        // if (atributosDeCostosDinamicosCotizador.moneda === 'usd') {
        //     costoFinal = cambiarDeDivisa(Dolar, costoFinal)
        // }
        const spans = document.querySelectorAll(`.${selector}`);
        spans.forEach((elemento) => {
            const costoFormateado = `${costoFinal
                .toLocaleString()
                .replace(/\./g, ',')}`;
            elemento.textContent = costoFormateado;
        });
    }
}
function checkLimitsPaquete(limitesPaquete, nombrePaqueteCapitalize, costosPaquete) {
    const atributosDinamicos = getAllAtributosDinamicosDeCotizador();
    const mensajeDeError = checkLimitesPaquete(atributosDinamicos.cantidadUsuariosRequeridos, atributosDinamicos.cantidadEmpleadosAgregados, atributosDinamicos.cantidadSucursalesAgregadas, limitesPaquete);
    const enablePrint = mensajeDeError === '';
    togglePaqueteView(`container${nombrePaqueteCapitalize}`, `btnCotizar${nombrePaqueteCapitalize}`, `btnContratar${nombrePaqueteCapitalize}`, `containerActivacion${nombrePaqueteCapitalize}`, `containerMigracion${nombrePaqueteCapitalize}`, `containerCapacitacion${nombrePaqueteCapitalize}`, `containerPrecioImplementacion${nombrePaqueteCapitalize}`, `containerPrecioBase${nombrePaqueteCapitalize}`, `containerFacturacionAnual${nombrePaqueteCapitalize}`, `containerPrecioParaIniciar${nombrePaqueteCapitalize}`, `error${nombrePaqueteCapitalize}`, mensajeDeError, enablePrint);
    const atributosDeCostos = enablePrint
        ? atributosDinamicos
        : {
            cantidadUsuariosRequeridos: limitesPaquete.numeroDeUsuariosPermitidos,
            cantidadEmpleadosAgregados: atributosDinamicos.cantidadEmpleadosAgregados,
            cantidadSucursalesAgregadas: atributosDinamicos.cantidadSucursalesAgregadas,
            cantidadTimbresRequeridos: atributosDinamicos.cantidadTimbresRequeridos,
            isPagoImplementacionMensual: atributosDinamicos.isPagoImplementacionMensual,
            isModalidadRentaMensual: atributosDinamicos.isModalidadRentaMensual,
            moneda: atributosDinamicos.moneda,
        };
    printCostosPaquete(costosPaquete, atributosDeCostos, nombrePaqueteCapitalize);
}
function changeLabelsPagosPaquetesCards() {
    const labelPrimerPgo = document.querySelectorAll('.spanPrimerPago');
    const labelSegundoPago = document.querySelectorAll('.spanSegundoPago');
    const { isModalidadRentaMensual, isPagoImplementacionMensual } = getAllAtributosDinamicosDeCotizador();
    if (isModalidadRentaMensual && !isPagoImplementacionMensual) {
        labelPrimerPgo.forEach((elemento) => {
            elemento.textContent = `Precio para iniciar:`;
        });
        labelSegundoPago.forEach((elemento) => {
            elemento.textContent = `Precio del 2.º mes:`;
        });
    }
    else {
        labelPrimerPgo.forEach((elemento) => {
            elemento.textContent = `Precio para iniciar el 1.º año:`;
        });
        labelSegundoPago.forEach((elemento) => {
            elemento.textContent = `Contrata hoy y el 2° año te costara:`;
        });
    }
}
function setInformationFromPackageSelectedToLocalStorage(costosPaquete) {
    const atributosDinamicosActuales = getAllAtributosDinamicosDeCotizador();
    const { costoPrimerAno, costoSegundoAno, costoSiguienteUsuario } = getAllCostosPaquete(atributosDinamicosActuales, costosPaquete);
    const moneda = localStorage.getItem('moneda');
    const data = {
        // informacion del paquete
        nombrePaqueteCapitalize: costosPaquete.nombre,
        cantidadUsuarios: atributosDinamicosActuales.cantidadUsuariosRequeridos,
        cantidadSucursales: atributosDinamicosActuales.cantidadSucursalesAgregadas,
        cantidadTimbres: atributosDinamicosActuales.cantidadTimbresRequeridos,
        cantidadEmpleados: atributosDinamicosActuales.cantidadEmpleadosAgregados,
        precioPrimerAno: costoPrimerAno,
        precioSegundoAno: costoSegundoAno,
        isModalidadRentaMensual: atributosDinamicosActuales.isModalidadRentaMensual,
        isPagoImplementacionMensual: atributosDinamicosActuales.isPagoImplementacionMensual,
        costoUsuarioExtra: costoSiguienteUsuario,
        moneda: moneda,
    };
    Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
    });
}
/**
 * ------------------ Finish new Code Refactorized ------------------
 */
function convertirAInteger(cadena) {
    const cadenaSinComas = cadena.replace(/,/g, '');
    const entero = parseInt(cadenaSinComas, 10);
    return entero;
}
function cambiarSpanXML(moneda) {
    const generacionXMLGrow = document.getElementById('generacionXMLGrow');
    const generacionXMLInstitutional = document.getElementById('generacionXMLInstitutional');
    const generacionXMLManufacturing = document.getElementById('generacionXMLManufacturing');
    const generacionXMLEnterprise = document.getElementById('generacionXMLEnterprise');
    generacionXMLGrow.textContent = '1';
    generacionXMLInstitutional.textContent = '1';
    generacionXMLManufacturing.textContent = '1';
    generacionXMLEnterprise.textContent = '1';
    if (moneda === 'usd') {
        generacionXMLGrow.textContent = '0.625';
        generacionXMLGrow.textContent = '0.625';
        generacionXMLInstitutional.textContent = '0.625';
        generacionXMLManufacturing.textContent = '0.625';
        generacionXMLEnterprise.textContent = '0.625';
    }
}
function cambiarSpanDeDivisaDolares(spans, paqueteCostos, moneda) {
    for (const span in spans) {
        const spanCostoElement = document.getElementById(`${spans[span]}${paqueteCostos.nombre}`);
        if (spanCostoElement) {
            const costoFinal = Math.floor(paqueteCostos[spans[span]])
                .toLocaleString()
                .replace(/\./g, ',');
            spanCostoElement.textContent = costoFinal;
            if (moneda === 'usd') {
                const costoFinal = Math.floor(convertirAInteger(spanCostoElement.textContent) / 16)
                    .toLocaleString()
                    .replace(/\./g, ',');
                spanCostoElement.textContent = costoFinal;
            }
        }
    }
}
function cambiarElementoADolares(spanId, moneda) {
    const spanCostoElement = document.getElementById(`${spanId}`);
    if (spanCostoElement) {
        spanCostoElement.textContent = '9,800';
        if (moneda === 'usd') {
            spanCostoElement.textContent = '612';
        }
    }
}
function toggleTooltip(idTooltipText, show) {
    const tooltipText = document.getElementById(idTooltipText);
    tooltipText.classList.toggle('hidden', !show);
}
function setupTooltipEventListeners(idTooltipIcon, idTooltipText) {
    const tooltipIcon = document.getElementById(idTooltipIcon);
    tooltipIcon.addEventListener('mouseover', () => toggleTooltip(idTooltipText, true));
    tooltipIcon.addEventListener('mouseout', () => toggleTooltip(idTooltipText, false));
}
function hideShowElementHidden(id) {
    const element = document.getElementById(id);
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');
    }
    else {
        element.classList.add('hidden');
    }
}
function printModalidadPagos() {
    let isPagoMembresiaMensual = document.getElementById('MembresiaMensual');
    let sufijoPagos = 'año';
    if (isPagoMembresiaMensual.checked) {
        sufijoPagos = 'mes';
    }
    const spans = document.querySelectorAll(`.spanPagos`);
    spans.forEach((elemento) => {
        elemento.textContent = `${sufijoPagos}`;
    });
}
function printMoneda() {
    let moneda = localStorage.getItem('moneda');
    if (moneda === null) {
        moneda = 'mxn';
    }
    const spans = document.querySelectorAll(`.moneda`);
    spans.forEach((elemento) => {
        elemento.textContent = moneda;
    });
    cambiarSpanDeDivisaDolares(spansCostos, costosTablaGrow, moneda);
    cambiarSpanDeDivisaDolares(spansCostos, costosTablaInstitutional, moneda);
    cambiarSpanDeDivisaDolares(spansCostos, costosTablaManufacturing, moneda);
    cambiarSpanDeDivisaDolares(spansCostos, costosTablaEnterprise, moneda);
    cambiarElementoADolares('migracionGrow', moneda);
    cambiarSpanXML(moneda);
    updateMoneda(moneda);
}
function updateValorInputNumber(id, min, max) {
    const input = document.getElementById(id);
    if (isNaN(parseFloat(input.value))) {
        input.value = '1';
        localStorage.setItem(id, input.value);
        return;
    }
    if (parseInt(input.value) < min) {
        input.value = '1';
        localStorage.setItem(id, input.value);
        return;
    }
    if (parseInt(input.value) > max) {
        input.value = '10000';
        localStorage.setItem(id, input.value);
        return;
    }
    localStorage.setItem(id, input.value);
}
function updateValorInputSwitch(id) {
    const input = document.getElementById(id);
    const labelDescuento = document.getElementById(`${id}LabelDescuento`);
    if (input.checked) {
        localStorage.setItem(id, 'true');
        labelDescuento.classList.add('hidden');
        return;
    }
    labelDescuento.classList.remove('hidden');
    localStorage.setItem(id, 'false');
}
function updateMoneda(moneda) {
    const monedaUSD = document.getElementById('monedaUSD');
    const monedaMXN = document.getElementById('monedaMXN');
    if (moneda === 'usd') {
        monedaUSD.classList.add('bg-blue-500', 'text-white');
        monedaUSD.classList.remove('text-blue-500', 'border', 'border-blue-500');
        monedaMXN.classList.add('text-blue-500', 'border', 'border-blue-500');
        monedaMXN.classList.remove('bg-blue-500', 'text-white');
    }
    else if (moneda === 'mxn') {
        monedaUSD.classList.remove('bg-blue-500', 'text-white');
        monedaUSD.classList.add('text-blue-500', 'border', 'border-blue-500');
        monedaMXN.classList.remove('text-blue-500', 'border', 'border-blue-500');
        monedaMXN.classList.add('bg-blue-500', 'text-white');
    }
    localStorage.setItem('moneda', moneda);
}
function handleIncrementClick(inputId, minValue) {
    const input = document.getElementById(inputId);
    if (parseInt(input.value) < minValue) {
        input.value = (parseInt(input.value) + 1).toString();
        window.localStorage.setItem(input.id, input.value);
    }
}
function handleDecrementClick(inputId, maxValue) {
    const input = document.getElementById(inputId);
    if (parseInt(input.value) > maxValue) {
        input.value = (parseInt(input.value) - 1).toString();
        window.localStorage.setItem(input.id, input.value);
    }
}
function reloadValorInputSwitch(id) {
    const storedValue = window.localStorage.getItem(id);
    const inputValue = document.getElementById(id);
    const labelDescuento = document.getElementById(`${id}LabelDescuento`);
    if (storedValue && storedValue === 'true') {
        inputValue.checked = true;
        labelDescuento.classList.add('hidden');
    }
    else {
        window.localStorage.setItem(id, 'false');
    }
}
function handleClick(targetElement, entity, maxValue, minValue) {
    if (targetElement.matches(`#decrement${entity}`)) {
        handleDecrementClick(entity, minValue);
        printLabelUsuariosExtrasCapacitaciones(20);
        checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
        checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
        checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
        checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
        printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
    }
    if (targetElement.matches(`#increment${entity}`)) {
        handleIncrementClick(entity, maxValue);
        printLabelUsuariosExtrasCapacitaciones(20);
        checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
        checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
        checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
        checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
        printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
    }
}
// Refactorizar
function printLabelUsuariosExtrasCapacitaciones(usuariosGratisDeCapacitacion) {
    let usuariosRequeridos = document.getElementById('Usuarios');
    const spansUsuariosExtras = document.querySelectorAll(`.usuariosExtraCapacitacion`);
    spansUsuariosExtras.forEach((elemento) => {
        elemento.textContent = ``;
    });
    if (parseInt(usuariosRequeridos.value) > usuariosGratisDeCapacitacion) {
        const usuariosExtras = parseInt(usuariosRequeridos.value) - usuariosGratisDeCapacitacion;
        spansUsuariosExtras.forEach((elemento) => {
            elemento.textContent = `${usuariosExtras} usuarios adicionales`;
        });
    }
}
// Refactorizar
// functionprintCostosPaquete(costosGrow,"Grow" ) {
//     let timbresAgregados = document.getElementById(
//         'Timbres'
//     ) as HTMLInputElement
//     let empleadosAgregados = document.getElementById(
//         'Empleados'
//     ) as HTMLInputElement
//     let usuariosAgregados = document.getElementById(
//         'Usuarios'
//     ) as HTMLInputElement
//     let sucursalesAgregados = document.getElementById(
//         'Sucursales'
//     ) as HTMLInputElement
//     // pagos
//     let isPagoImplementacionMensual = document.getElementById(
//         'ImplementacionMensual'
//     ) as HTMLInputElement
//     let isPagoMembresiaMensual = document.getElementById(
//         'MembresiaMensual'
//     ) as HTMLInputElement
//     const atributosDeCostosDinamicosPaquetes = {
//         cantidadTimbresRequeridos: parseInt(timbresAgregados.value),
//         cantidadEmpleadosAgregados: parseInt(empleadosAgregados.value),
//         cantidadUsuariosRequeridos: parseInt(usuariosAgregados.value),
//         cantidadSucursalesAgregadas: parseInt(sucursalesAgregados.value),
//         // pagos
//         isPagoImplementacionMensual: Boolean(
//             isPagoImplementacionMensual.checked
//         ),
//         isModalidadRentaMensual: Boolean(isPagoMembresiaMensual.checked),
//     }
//     const costosPaquetes = getAllCostosPaquetes(
//         atributosDeCostosDinamicosPaquetes,
//         costosGrow,
//         costosInstitutional,
//         costosManufacturing,
//         costosEnterprise
//     )
//     let moneda = localStorage.getItem('moneda')
//     for (const paquete in costosPaquetes) {
//         const costosEnPaquete = costosPaquetes[paquete]
//         for (const costo in costosEnPaquete) {
//             const selector = `${costo}${paquete}`
//             let costoFinal = costosEnPaquete[costo]
//             if (moneda === 'usd') {
//                 costoFinal = cambiarDeDivisa(Dolar, costoFinal)
//             }
//             const spans = document.querySelectorAll(`.${selector}`)
//             spans.forEach((elemento) => {
//                 const costoFormateado = `${costoFinal
//                     .toLocaleString()
//                     .replace(/\./g, ',')}`
//                 elemento.textContent = costoFormateado
//             })
//         }
//     }
// }
// Refactorizar
function addInputListeners(inputs) {
    for (const input of inputs) {
        const inputElement = document.getElementById(input.id);
        if (input.type === 'number') {
            inputElement.addEventListener('change', () => {
                updateValorInputNumber(input.id, input.minValue, input.maxValue);
                checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
                checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
                checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
                checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
                printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
                printLabelUsuariosExtrasCapacitaciones(20);
                return;
            });
            inputElement.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    inputElement.blur();
                    updateValorInputNumber(input.id, input.minValue, input.maxValue);
                    checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
                    checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
                    checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
                    checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
                    printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
                    printLabelUsuariosExtrasCapacitaciones(20);
                    return;
                }
            });
        }
        if (input.type === 'checkbox') {
            inputElement.addEventListener('click', () => {
                updateValorInputSwitch(input.id);
                printModalidadPagos();
                checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
                checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
                checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
                checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
                changeLabelsPagosPaquetesCards();
                printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
                return;
            });
        }
    }
}
const migracionCheckboxGrow = document.getElementById('migracionCheckboxGrow');
const capacitacionCheckboxGrow = document.getElementById('capacitacionCheckboxGrow');
migracionCheckboxGrow.addEventListener('click', () => {
    costosGrow.hasMigracionChecked = migracionCheckboxGrow.checked
        ? true
        : false;
    checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
    checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
    checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
    checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
    printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
});
capacitacionCheckboxGrow.addEventListener('click', () => {
    costosGrow.hasCapacitacionChecked = capacitacionCheckboxGrow.checked
        ? true
        : false;
    checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
    checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
    checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
    checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
    printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
});
// Refactorizar
const productos = document.getElementById('btnProductos');
const childProductos = document.getElementById('childProductos');
const industrias = document.getElementById('btnIndustrias');
const childIndustrias = document.getElementById('childIndustrias');
const empresa = document.getElementById('btnEmpresa');
const childEmpresa = document.getElementById('childEmpresa');
const exploreMas = document.getElementById('btnExploreMas');
const childExploreMas = document.getElementById('childExploreMas');
const modulos = document.getElementById('btnModulos');
const childModulos = document.getElementById('childModulos');
modulos.addEventListener('mouseenter', () => {
    childModulos.style.display = 'block';
});
modulos.addEventListener('mouseleave', () => {
    childModulos.style.display = 'none';
});
productos.addEventListener('mouseenter', () => {
    childProductos.style.display = 'block';
});
productos.addEventListener('mouseleave', () => {
    childProductos.style.display = 'none';
});
industrias.addEventListener('mouseenter', () => {
    childIndustrias.style.display = 'block';
});
industrias.addEventListener('mouseleave', () => {
    childIndustrias.style.display = 'none';
});
empresa.addEventListener('mouseenter', () => {
    childEmpresa.style.display = 'block';
});
empresa.addEventListener('mouseleave', () => {
    childEmpresa.style.display = 'none';
});
exploreMas.addEventListener('mouseenter', () => {
    childExploreMas.style.display = 'block';
});
exploreMas.addEventListener('mouseleave', () => {
    childExploreMas.style.display = 'none';
});
window.document.addEventListener('click', (e) => {
    const targetElement = e.target;
    /**
     * New refactorized
     */
    if (targetElement.matches('#btnCotizarGrow')) {
        setInformationFromPackageSelectedToLocalStorage(costosGrow);
    }
    if (targetElement.matches('#btnCotizarInstitutional')) {
        setInformationFromPackageSelectedToLocalStorage(costosInstitutional);
    }
    if (targetElement.matches('#btnCotizarManufacturing')) {
        setInformationFromPackageSelectedToLocalStorage(costosManufacturing);
    }
    if (targetElement.matches('#btnCotizarEnterprise')) {
        setInformationFromPackageSelectedToLocalStorage(costosEnterprise);
    }
    /**
     * Termina new refactorized
     */
    handleClick(targetElement, 'Usuarios', 10000, 1);
    handleClick(targetElement, 'Empleados', 10000, 1);
    handleClick(targetElement, 'Timbres', 10000, 1);
    handleClick(targetElement, 'Sucursales', 10000, 1);
    if (targetElement.matches('#btnVerDemo')) {
        hideShowElementHidden('demoModal');
    }
    if (targetElement.closest('#closeModal')) {
        hideShowElementHidden('demoModal');
    }
    if (targetElement.closest('#monedaMXN')) {
        updateMoneda('mxn');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaGrow, 'mxn');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaInstitutional, 'mxn');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaManufacturing, 'mxn');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaEnterprise, 'mxn');
        cambiarSpanXML('mxn');
        cambiarElementoADolares('migracionGrow', 'mxn');
        checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
        checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
        checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
        checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
        printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
        // siempre al final
        printMoneda();
    }
    if (targetElement.closest('#monedaUSD')) {
        updateMoneda('usd');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaGrow, 'usd');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaInstitutional, 'usd');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaManufacturing, 'usd');
        cambiarSpanDeDivisaDolares(spansCostos, costosTablaEnterprise, 'usd');
        cambiarSpanXML('usd');
        cambiarElementoADolares('migracionGrow', 'usd');
        checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
        checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
        checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
        checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
        printLabelDePaqueteRecomendado(getAllAtributosDinamicosDeCotizador(), limitesGrow, limitesInstitutional, limitesManufacturing, limitesEnterprise);
        // siempre al final
        printMoneda();
    }
});
tooltips.forEach(([tooltipIcon, tooltipText]) => setupTooltipEventListeners(tooltipIcon, tooltipText));
// Reload valores de inputs anteriores.
reloadValorInputSwitch('ImplementacionMensual');
reloadValorInputSwitch('MembresiaMensual');
addInputListeners(inputsEnDOM);
// Printear valores de etiquetas.
checkLimitsPaquete(limitesGrow, 'Grow', costosGrow);
checkLimitsPaquete(limitesInstitutional, 'Institutional', costosInstitutional);
checkLimitsPaquete(limitesManufacturing, 'Manufacturing', costosManufacturing);
checkLimitsPaquete(limitesEnterprise, 'Enterprise', costosEnterprise);
reloadLabelDePaqueteRecomendado();
printModalidadPagos();
printLabelUsuariosExtrasCapacitaciones(20);
changeLabelsPagosPaquetesCards();
printMoneda();
