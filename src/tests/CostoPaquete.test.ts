/**
 * @author Raul Galindo
 * @description Tests para metodos de costos paquetes
 */

import {
    calcularCostoCapacitacion,
    calcularCostoActivacion,
    calcularCostoMigracion,
    calcularCostoImplementacion,
    calcularCostoPrecioBase,
    calcularCostoFacturacionAnualDelPrecioBase,
    calcularCostoImplementacionUnicoPago,
    calcularCostoTimbres,
    calcularCostoUsuario,
    calcularCostoPrimerAno,
    calcularDescuentoPorUnPagoDeImplementacion,
    calcularCostoSiguienteUsuario,
} from '../modules/cotizador/application/CostosPaquete'

import {
    costosEnterprise,
    costosManufacturing,
} from '../modules/cotizador/domain/CostosPaquetes'

import { IAtributosDeCostosDinamicosPaquetes } from '../modules/cotizador/domain/ICostosPaquete'

const atributosDeCostosDinamicos: IAtributosDeCostosDinamicosPaquetes = {
    cantidadTimbresRequeridos: 100,
    cantidadUsuariosRequeridos: 1,
    cantidadEmpleadosAgregados: 1,
    cantidadSucursalesAgregadas: 1,
    // pagos
    isPagoImplementacionMensual: false,
    isModalidadRentaMensual: false,
    moneda: 'mxn',
}

describe('😁 - Calcular costos de paquetes', () => {
    // describe('🎨 Pruebas generales de cada metodo', () => {
    //     // --------------- Implementacion ---------------
    it('Costo activacion', () => {
        expect(
            calcularCostoActivacion(
                costosManufacturing.costoBaseActivacionEnElPaquete
            )
        ).toBe(19000)
    })

    it('Costo capacitacion', () => {
        expect(
            calcularCostoCapacitacion(
                costosManufacturing.costoBaseCapacitacionEnElPaquete,
                atributosDeCostosDinamicos.cantidadUsuariosRequeridos, // cantidadUsuariosRequeridos
                costosManufacturing.usuariosGratisIncluidosEnCapacitacionDelPaquete,
                costosManufacturing.costoCapacitacionUsuarioExtraDelPaquete,
                costosManufacturing.hasCapacitacionChecked
            )
        ).toBe(49000)
    })

    it('Costo migracion', () => {
        expect(
            calcularCostoMigracion(
                costosManufacturing.costoBaseMigracionEnElPaquete,
                costosManufacturing.hasMigracionChecked
            )
        ).toBe(29000)
    })

    it('Costo implementacion', () => {
        const costoFinalCapacitacion = calcularCostoCapacitacion(
            costosManufacturing.costoBaseCapacitacionEnElPaquete, // costoBaseCapacitacionEnElPaquete
            atributosDeCostosDinamicos.cantidadUsuariosRequeridos,
            costosManufacturing.usuariosGratisIncluidosEnCapacitacionDelPaquete,
            costosManufacturing.costoCapacitacionUsuarioExtraDelPaquete,
            costosManufacturing.hasCapacitacionChecked
        )

        const costoFinalMigracion = calcularCostoMigracion(
            costosManufacturing.costoBaseMigracionEnElPaquete,
            costosManufacturing.hasMigracionChecked
        )

        const costoFinalActivacion = calcularCostoActivacion(
            costosManufacturing.costoBaseActivacionEnElPaquete
        )

        expect(
            calcularCostoImplementacion(
                costoFinalActivacion,
                costoFinalMigracion,
                costoFinalCapacitacion,
                true // isPagoImplementacionMensual
            )
        ).toBe(8083)
    })

    it('Costo implementacion unico pago', () => {
        expect(
            calcularCostoImplementacionUnicoPago(
                costosManufacturing.costoBaseActivacionEnElPaquete,
                costosManufacturing.costoBaseMigracionEnElPaquete,
                costosManufacturing.costoBaseCapacitacionEnElPaquete
            )
        ).toBe(97000)
    })

    // --------------- Precio Base ---------------
    it('Costo precio base mensual', () => {
        expect(
            calcularCostoPrecioBase(
                costosManufacturing.precioBaseMensualDelPaquete,
                true
            )
        ).toBe(14990)
    })

    it('Costo precio base anual', () => {
        expect(
            calcularCostoPrecioBase(
                costosManufacturing.precioBaseMensualDelPaquete,
                false
            )
        ).toBe(179880)
    })

    it('Costo usuarios', () => {
        expect(
            calcularCostoUsuario(
                50,
                costosManufacturing.cantidadUsuariosGratisIncluidos,
                costosManufacturing.costoUsuariosExtraSinDescuento,
                costosManufacturing.hasPrecioUsuarioExtraVariable,
                costosManufacturing.costoUsuariosExtraConDescuento,
                costosManufacturing.cantidadUsuariosSinDescuento
            )
        ).toBe(40291)
    })

    it('Costo facturacion anual del precio base', () => {
        const costoUsuarios = calcularCostoUsuario(
            1,
            costosManufacturing.cantidadUsuariosGratisIncluidos,
            costosManufacturing.costoUsuariosExtraSinDescuento,
            costosManufacturing.hasPrecioUsuarioExtraVariable,
            costosManufacturing.costoUsuariosExtraConDescuento,
            costosManufacturing.cantidadUsuariosSinDescuento
        )

        expect(
            calcularCostoFacturacionAnualDelPrecioBase(
                costosManufacturing.precioBaseMensualDelPaquete,
                costoUsuarios
            )
        ).toBe(179880)
    })

    it('Costo usuarios correcto de acuerdo a limites', () => {
        expect(
            calcularCostoSiguienteUsuario(
                48,
                costosEnterprise.costoUsuariosExtraSinDescuento,
                costosEnterprise.hasPrecioUsuarioExtraVariable,
                costosEnterprise.costoUsuariosExtraConDescuento,
                costosEnterprise.cantidadUsuariosSinDescuento
            )
        ).toBe(998)
    })

    //     // --------------- Timbres ---------------
    //     it('Costo timbres', () => {
    //         expect(
    //             calcularCostoTimbres(
    //                 atributosDeCostosDinamicos.cantidadTimbresRequeridos,
    //                 costosManufacturing.timbresGratisIncluidosEnElPaquete,
    //                 costosManufacturing.costoTimbreExtraDelPaquete
    //             )
    //         ).toBe(0)
    //     })

    //     // --------------- Usuarios ---------------
    //     // * Usuarios no dinamico para poder testearlo *

    //     // --------------- Descuentos ---------------
    //     // * isModalidadRentaMensual no dinamico para poder testearlo *
    //     it('Costo promocion implementacion por elegir 1 pago con descuento', () => {
    //         const precioBaseFinal = calcularCostoPrecioBase(
    //             costosManufacturing.precioBaseMensualDelPaquete,
    //             false,
    //         )

    //         expect(
    //             calcularDescuentoPorUnPagoDeImplementacion(
    //                 precioBaseFinal,
    //                 costosManufacturing.precioBaseMensualDelPaquete
    //             )
    //         ).toBe(32890)
    //     })
    // })
})
