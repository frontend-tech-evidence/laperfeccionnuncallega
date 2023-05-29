/**
 * @author Raul Galindo
 * @description Responsabilidad: Retornar los costos relacionado con un paquete en especifico.
 */

import { Dolar } from '../domain/Divisas.js'
import {
    IAtributosDeCostosDinamicosPaquetes,
    ICostosPaquete,
} from '../domain/ICostosPaquete.js'
import { cambiarDeDivisa } from './Divisas.js'

// ----- Implementacion -----
export function calcularCostoActivacion(
    costoBaseActivacionEnElPaquete: number
): number {
    return costoBaseActivacionEnElPaquete
}

export function calcularCostoCapacitacion(
    costoBaseCapacitacionEnElPaquete: number,
    cantidadUsuariosRequeridos: number,
    usuariosGratisIncluidosEnCapacitacionDelPaquete: number,
    costoCapacitacionUsuarioExtraDelPaquete: number,
    hasCapacitacionChecked: boolean = true
): number {
    if (!hasCapacitacionChecked) {
        return 0
    }

    const cantidadUsuariosExtrasQueSeCobraran = Math.max(
        cantidadUsuariosRequeridos -
            usuariosGratisIncluidosEnCapacitacionDelPaquete,
        0
    )

    const costoUsuariosExtrasCapacitaciones =
        cantidadUsuariosExtrasQueSeCobraran *
        costoCapacitacionUsuarioExtraDelPaquete

    return costoBaseCapacitacionEnElPaquete + costoUsuariosExtrasCapacitaciones
}

export function calcularCostoMigracion(
    costoBaseMigracionEnElPaquete: number,
    hasMigracionChecked: boolean = true
): number {
    return hasMigracionChecked ? costoBaseMigracionEnElPaquete : 0
}

export function calcularCostoImplementacion(
    costoActivacion: number,
    costoMigracion: number,
    costoCapacitacion: number,
    isPagoImplementacionMensual: boolean = false
): number {
    const costo = costoActivacion + costoMigracion + costoCapacitacion
    const numeroMeses = 12
    if (isPagoImplementacionMensual) {
        return Math.floor(costo / numeroMeses)
    }
    return costo
}

export function calcularCostoImplementacionUnicoPago(
    costoActivacion: number,
    costoMigracion: number,
    costoCapacitacion: number
): number {
    return costoActivacion + costoMigracion + costoCapacitacion
}

// ----- Precio Base -----
export function calcularCostoPrecioBase(
    precioBaseMensualDelPaquete: number,
    isModalidadRentaMensual = false
): number {
    const mesesDelAño = 12

    return isModalidadRentaMensual
        ? precioBaseMensualDelPaquete
        : precioBaseMensualDelPaquete * mesesDelAño
}

export function calcularCostoFacturacionAnualDelPrecioBase(
    precioBaseMensualDelPaquete: number,
    costoDeUsuarios: number
): number {
    const mesesDelAño = 12
    return precioBaseMensualDelPaquete * mesesDelAño + costoDeUsuarios
}

// ----- Timbres -----
export function calcularCostoTimbres(
    timbresRequeridos: number,
    timbresGratisIncluidosEnElPaquete: number,
    costoTimbreExtraDelPaquete: number
): number {
    let costo = 0

    if (timbresRequeridos > timbresGratisIncluidosEnElPaquete) {
        costo =
            (timbresRequeridos - timbresGratisIncluidosEnElPaquete) *
            costoTimbreExtraDelPaquete
    }

    return costo
}

// ----- Usuarios -----
export function calcularCostoUsuario(
    cantidadUsuariosRequeridos: number,
    cantidadUsuariosGratisIncluidos: number,
    costoUsuariosExtraSinDescuento: number,
    hasPrecioUsuarioExtraVariable = false,
    costoUsuariosExtraConDescuento,
    cantidadUsuariosSinDescuento
) {
    if (hasPrecioUsuarioExtraVariable) {
        if (cantidadUsuariosRequeridos > cantidadUsuariosSinDescuento) {
            const cantidadAntesDelRango =
                cantidadUsuariosSinDescuento - cantidadUsuariosGratisIncluidos
            const cantidadDespuesDelRango =
                cantidadUsuariosRequeridos - cantidadUsuariosSinDescuento
            const costoDespuesDelLimite =
                cantidadDespuesDelRango * costoUsuariosExtraConDescuento
            const costoAntesDelLimite =
                cantidadAntesDelRango * costoUsuariosExtraSinDescuento
            return costoDespuesDelLimite + costoAntesDelLimite
        }
    }

    return Math.abs(
        (cantidadUsuariosGratisIncluidos - cantidadUsuariosRequeridos) *
            costoUsuariosExtraSinDescuento
    )
}

export function calcularCostoSiguienteUsuario(
    cantidadUsuariosRequeridos: number,
    costoUsuariosExtraSinDescuento: number,
    hasPrecioUsuarioExtraVariable: boolean,
    costoUsuariosExtraConDescuento?: number,
    cantidadUsuariosSinDescuento?: number
): number {
    if (
        hasPrecioUsuarioExtraVariable &&
        cantidadUsuariosRequeridos > cantidadUsuariosSinDescuento
    ) {
        return costoUsuariosExtraConDescuento
    }

    return costoUsuariosExtraSinDescuento
}

// ----- Costos finales -----
export function calcularCostoPrimerAno(
    costoImplementacion: number,
    costoPrecioBase: number,
    costoTimbres: number,
    costoUsuarios: number,
    // dinamicos
    costoPrecioBaseMensual: number,
    isPagoImplementacionMensual: boolean,
    isModalidadRentaMensual: boolean
): number {
    if (!isPagoImplementacionMensual && isModalidadRentaMensual) {
        return costoImplementacion
    }

    if (!isPagoImplementacionMensual) {
        costoPrecioBase = calcularDescuentoPorUnPagoDeImplementacion(
            costoPrecioBase,
            costoPrecioBaseMensual
        )
    }

    let costoPrimerAno = Math.floor(
        costoImplementacion + costoPrecioBase + costoTimbres + costoUsuarios
    )

    if (!isModalidadRentaMensual) {
        costoPrimerAno = calcularDescuentoPorPagarRentaAnual(costoPrimerAno)
    }

    return costoPrimerAno
}

export function calcularCostoSegundoAno(
    CostoPrecioBase: number,
    CostoTimbres: number,
    CostoUsuarios: number
): number {
    return Math.round(CostoPrecioBase + CostoTimbres + CostoUsuarios)
}

// ----- Descuentos -----
export function calcularDescuentoPorUnPagoDeImplementacion(
    costoPrecioBaseMensual: number,
    precioBaseDelPaquete: number
): number {
    return costoPrecioBaseMensual - precioBaseDelPaquete
}

function calcularDescuentoPorPagarRentaAnual(costoPrimerAno: number): number {
    return Math.floor(costoPrimerAno * 0.9)
}

export function getAllCostosPaquete(
    atributosDeCostosDinamicosPaquetes: IAtributosDeCostosDinamicosPaquetes,
    paquete: ICostosPaquete
) {
    let costoCapacitacion = calcularCostoCapacitacion(
        paquete.costoBaseCapacitacionEnElPaquete, // costoBaseCapacitacionEnElPaquete
        atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos,
        paquete.usuariosGratisIncluidosEnCapacitacionDelPaquete,
        paquete.costoCapacitacionUsuarioExtraDelPaquete,
        paquete.hasCapacitacionChecked
    )

    let costoMigracion = calcularCostoMigracion(
        paquete.costoBaseMigracionEnElPaquete,
        paquete.hasMigracionChecked
    )

    let costoActivacion = calcularCostoActivacion(
        paquete.costoBaseActivacionEnElPaquete
    )

    let costoImplementacion = calcularCostoImplementacion(
        costoActivacion,
        costoMigracion,
        costoCapacitacion,
        atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual
    )

    let costoUsuarios = calcularCostoUsuario(
        atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos,
        paquete.cantidadUsuariosGratisIncluidos,
        paquete.costoUsuariosExtraSinDescuento,
        paquete.hasPrecioUsuarioExtraVariable,
        paquete.costoUsuariosExtraConDescuento,
        paquete.cantidadUsuariosSinDescuento
    )

    let costoSiguienteUsuario = calcularCostoSiguienteUsuario(
        atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos,
        paquete.costoUsuariosExtraSinDescuento,
        paquete.hasPrecioUsuarioExtraVariable,
        paquete.costoUsuariosExtraConDescuento,
        paquete.cantidadUsuariosSinDescuento
    )

    let costoPrecioBase = calcularCostoPrecioBase(
        paquete.precioBaseMensualDelPaquete,
        atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual
    )

    let costoTimbres = calcularCostoTimbres(
        atributosDeCostosDinamicosPaquetes.cantidadTimbresRequeridos,
        paquete.timbresGratisIncluidosEnElPaquete,
        paquete.costoTimbreExtraDelPaquete
    )

    let costoPrimerAno = calcularCostoPrimerAno(
        costoImplementacion,
        costoPrecioBase,
        costoTimbres,
        costoUsuarios,
        paquete.precioBaseMensualDelPaquete,
        atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual,
        atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual
    )

    // Extras
    let costoFacturacionAnual = calcularCostoFacturacionAnualDelPrecioBase(
        paquete.precioBaseMensualDelPaquete,
        costoUsuarios
    )

    let costoImplementacionUnicoPago = calcularCostoImplementacionUnicoPago(
        costoActivacion,
        costoMigracion,
        costoCapacitacion
    )

    let costoSegundoAno = calcularCostoSegundoAno(
        costoPrecioBase,
        costoTimbres,
        costoUsuarios
    )

    // Refactorizar
    if (atributosDeCostosDinamicosPaquetes.moneda === 'usd') {
        costoCapacitacion = cambiarDeDivisa(Dolar, costoCapacitacion)
        costoMigracion = cambiarDeDivisa(Dolar, costoMigracion)
        costoActivacion = cambiarDeDivisa(Dolar, costoActivacion)
        costoImplementacion = cambiarDeDivisa(Dolar, costoImplementacion)
        costoUsuarios = cambiarDeDivisa(Dolar, costoUsuarios)
        costoPrecioBase = cambiarDeDivisa(Dolar, costoPrecioBase)
        costoTimbres = cambiarDeDivisa(Dolar, costoTimbres)
        costoPrimerAno = cambiarDeDivisa(Dolar, costoPrimerAno)
        costoFacturacionAnual = cambiarDeDivisa(Dolar, costoFacturacionAnual)
        costoImplementacionUnicoPago = cambiarDeDivisa(
            Dolar,
            costoImplementacionUnicoPago
        )
        costoSegundoAno = cambiarDeDivisa(Dolar, costoSegundoAno)
        costoSiguienteUsuario = cambiarDeDivisa(Dolar, costoSiguienteUsuario)
    }

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
        costoSiguienteUsuario,
    }

    return costosPaquete
}

export function getAllCostosPaquetes(
    atributosDeCostosDinamicosPaquetes: IAtributosDeCostosDinamicosPaquetes,
    ...paquetes: ICostosPaquete[]
) {
    let costosPaquetes = {}

    for (const paquete of paquetes) {
        const costoCapacitacion = calcularCostoCapacitacion(
            paquete.costoBaseCapacitacionEnElPaquete, // costoBaseCapacitacionEnElPaquete
            atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos,
            paquete.usuariosGratisIncluidosEnCapacitacionDelPaquete,
            paquete.costoCapacitacionUsuarioExtraDelPaquete,
            paquete.hasCapacitacionChecked
        )

        const costoMigracion = calcularCostoMigracion(
            paquete.costoBaseMigracionEnElPaquete,
            paquete.hasMigracionChecked
        )

        const costoActivacion = calcularCostoActivacion(
            paquete.costoBaseActivacionEnElPaquete
        )

        const costoImplementacion = calcularCostoImplementacion(
            costoActivacion,
            costoMigracion,
            costoCapacitacion,
            atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual
        )

        const costoUsuarios = calcularCostoUsuario(
            atributosDeCostosDinamicosPaquetes.cantidadUsuariosRequeridos,
            paquete.cantidadUsuariosGratisIncluidos,
            paquete.costoUsuariosExtraSinDescuento,
            paquete.hasPrecioUsuarioExtraVariable,
            paquete.costoUsuariosExtraConDescuento,
            paquete.cantidadUsuariosSinDescuento
        )

        const costoPrecioBase = calcularCostoPrecioBase(
            paquete.precioBaseMensualDelPaquete,
            atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual
        )

        const costoTimbres = calcularCostoTimbres(
            atributosDeCostosDinamicosPaquetes.cantidadTimbresRequeridos,
            paquete.timbresGratisIncluidosEnElPaquete,
            paquete.costoTimbreExtraDelPaquete
        )

        const costoPrimerAno = calcularCostoPrimerAno(
            costoImplementacion,
            costoPrecioBase,
            costoTimbres,
            costoUsuarios,
            paquete.precioBaseMensualDelPaquete,
            atributosDeCostosDinamicosPaquetes.isPagoImplementacionMensual,
            atributosDeCostosDinamicosPaquetes.isModalidadRentaMensual
        )

        // Extras
        const costoFacturacionAnual =
            calcularCostoFacturacionAnualDelPrecioBase(
                paquete.precioBaseMensualDelPaquete,
                costoUsuarios
            )

        const costoImplementacionUnicoPago =
            calcularCostoImplementacionUnicoPago(
                costoActivacion,
                costoMigracion,
                costoCapacitacion
            )

        const costoSegundoAno = calcularCostoSegundoAno(
            costoPrecioBase,
            costoTimbres,
            costoUsuarios
        )

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
        }

        costosPaquetes[paquete.nombre] = costosPaquete
    }

    return costosPaquetes
}
