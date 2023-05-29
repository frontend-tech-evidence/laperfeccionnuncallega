/**
 * @author Raul Galindo
 * @description Responsabilidad: Retornar los costos relacionado con un paquete en especifico.
 */
// ----- Implementacion -----
export function calcularCostoActivacion(costoBaseActivacionEnElPaquete) {
    return costoBaseActivacionEnElPaquete;
}
export function calcularCostoCapacitacion(costoBaseCapacitacionEnElPaquete, cantidadUsuariosRequeridos, usuariosGratisIncluidosEnCapacitacionDelPaquete, costoCapacitacionUsuarioExtraDelPaquete, hasCapacitacionChecked = true) {
    if (!hasCapacitacionChecked) {
        return 0;
    }
    const cantidadUsuariosExtrasQueSeCobraran = Math.max(cantidadUsuariosRequeridos -
        usuariosGratisIncluidosEnCapacitacionDelPaquete, 0);
    const costoUsuariosExtrasCapacitaciones = cantidadUsuariosExtrasQueSeCobraran *
        costoCapacitacionUsuarioExtraDelPaquete;
    return costoBaseCapacitacionEnElPaquete + costoUsuariosExtrasCapacitaciones;
}
export function calcularCostoMigracion(costoBaseMigracionEnElPaquete, hasMigracionChecked = true) {
    return hasMigracionChecked ? costoBaseMigracionEnElPaquete : 0;
}
export function calcularCostoImplementacion(costoActivacion, costoMigracion, costoCapacitacion, isPagoImplementacionMensual = false) {
    const costo = costoActivacion + costoMigracion + costoCapacitacion;
    const numeroMeses = 12;
    if (isPagoImplementacionMensual) {
        return Math.floor(costo / numeroMeses);
    }
    return costo;
}
export function calcularCostoImplementacionUnicoPago(costoActivacion, costoMigracion, costoCapacitacion) {
    return costoActivacion + costoMigracion + costoCapacitacion;
}
// ----- Precio Base -----
export function calcularCostoPrecioBase(precioBaseMensualDelPaquete, isModalidadRentaMensual = false) {
    const mesesDelAño = 12;
    return isModalidadRentaMensual
        ? precioBaseMensualDelPaquete
        : precioBaseMensualDelPaquete * mesesDelAño;
}
export function calcularCostoFacturacionAnualDelPrecioBase(precioBaseMensualDelPaquete, costoDeUsuarios) {
    const mesesDelAño = 12;
    return precioBaseMensualDelPaquete * mesesDelAño + costoDeUsuarios;
}
// ----- Timbres -----
export function calcularCostoTimbres(timbresRequeridos, timbresGratisIncluidosEnElPaquete, costoTimbreExtraDelPaquete) {
    let costo = 0;
    if (timbresRequeridos > timbresGratisIncluidosEnElPaquete) {
        costo =
            (timbresRequeridos - timbresGratisIncluidosEnElPaquete) *
                costoTimbreExtraDelPaquete;
    }
    return costo;
}
// ----- Usuarios -----
export function calcularCostoUsuario(cantidadUsuariosRequeridos, cantidadUsuariosGratisIncluidos, costoUsuariosExtraSinDescuento, hasPrecioUsuarioExtraVariable = false, costoUsuariosExtraConDescuento, cantidadUsuariosSinDescuento) {
    if (hasPrecioUsuarioExtraVariable) {
        if (cantidadUsuariosRequeridos > cantidadUsuariosSinDescuento) {
            const cantidadAntesDelRango = cantidadUsuariosSinDescuento - cantidadUsuariosGratisIncluidos;
            const cantidadDespuesDelRango = cantidadUsuariosRequeridos - cantidadUsuariosSinDescuento;
            const costoDespuesDelLimite = cantidadDespuesDelRango * costoUsuariosExtraConDescuento;
            const costoAntesDelLimite = cantidadAntesDelRango * costoUsuariosExtraSinDescuento;
            return costoDespuesDelLimite + costoAntesDelLimite;
        }
    }
    return Math.abs((cantidadUsuariosGratisIncluidos - cantidadUsuariosRequeridos) *
        costoUsuariosExtraSinDescuento);
}
// ----- Costos finales -----
export function calcularCostoPrimerAno(costoImplementacion, costoPrecioBase, costoTimbres, costoUsuarios, 
// dinamicos
costoPrecioBaseMensual, isPagoImplementacionMensual, isModalidadRentaMensual) {
    if (!isPagoImplementacionMensual) {
        costoPrecioBase = calcularDescuentoPorUnPagoDeImplementacion(costoPrecioBase, costoPrecioBaseMensual);
    }
    let costoPrimerAno = Math.floor(costoImplementacion + costoPrecioBase + costoTimbres + costoUsuarios);
    if (!isModalidadRentaMensual) {
        costoPrimerAno = calcularDescuentoPorPagarRentaAnual(costoPrimerAno);
    }
    return costoPrimerAno;
}
export function calcularCostoSegundoAno(CostoPrecioBase, CostoTimbres, CostoUsuarios) {
    return Math.round(CostoPrecioBase + CostoTimbres + CostoUsuarios);
}
// ----- Descuentos -----
export function calcularDescuentoPorUnPagoDeImplementacion(costoPrecioBaseMensual, precioBaseDelPaquete) {
    return costoPrecioBaseMensual - precioBaseDelPaquete;
}
function calcularDescuentoPorPagarRentaAnual(costoPrimerAno) {
    return Math.floor(costoPrimerAno * 0.9);
}
export function getAllCostosPaquetes(atributosDeCostosDinamicosPaquetes, ...paquetes) {
    let costosPaquetes = {};
    for (const paquete of paquetes) {
        const costoCapacitacion = calcularCostoCapacitacion(paquete.costoBaseCapacitacionEnElPaquete, // costoBaseCapacitacionEnElPaquete
        atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos, paquete.usuariosGratisIncluidosEnCapacitacionDelPaquete, paquete.costoCapacitacionUsuarioExtraDelPaquete, paquete.hasCapacitacionChecked);
        const costoMigracion = calcularCostoMigracion(paquete.costoBaseMigracionEnElPaquete, paquete.hasMigracionChecked);
        const costoActivacion = calcularCostoActivacion(paquete.costoBaseActivacionEnElPaquete);
        const costoImplementacion = calcularCostoImplementacion(costoActivacion, costoMigracion, costoCapacitacion, atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual);
        const costoUsuarios = calcularCostoUsuario(atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos, paquete.cantidadUsuariosGratisIncluidos, paquete.costoUsuariosExtraSinDescuento, paquete.hasPrecioUsuarioExtraVariable, paquete.costoUsuariosExtraConDescuento, paquete.cantidadUsuariosSinDescuento);
        const costoPrecioBase = calcularCostoPrecioBase(paquete.precioBaseMensualDelPaquete, atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual);
        const costoTimbres = calcularCostoTimbres(atributosDeCostosDinamicosPaquetes.cantidadTimbresRequeridos, paquete.timbresGratisIncluidosEnElPaquete, paquete.costoTimbreExtraDelPaquete);
        const costoPrimerAno = calcularCostoPrimerAno(costoImplementacion, costoPrecioBase, costoTimbres, costoUsuarios, paquete.precioBaseMensualDelPaquete, atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual, atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual);
        // Extras
        const costoFacturacionAnual = calcularCostoFacturacionAnualDelPrecioBase(paquete.precioBaseMensualDelPaquete, costoUsuarios);
        const costoImplementacionUnicoPago = calcularCostoImplementacionUnicoPago(costoActivacion, costoMigracion, costoCapacitacion);
        const costoSegundoAno = calcularCostoSegundoAno(costoPrecioBase, costoTimbres, costoUsuarios);
        const costosPaquete = {
            costoCapacitacion,
            costoMigracion,
            costoActivacion,
            costoImplementacion,
            costoUsuarios,
            costoPrecioBase,
            costoTimbres,
            costoPrimerAno,
            costoFacturacionAnual,
            costoImplementacionUnicoPago,
            costoSegundoAno,
        };
        costosPaquetes[paquete.nombre] = costosPaquete;
    }
    return costosPaquetes;
}
