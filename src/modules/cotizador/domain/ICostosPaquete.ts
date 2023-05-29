/**
 * @author Raul Galindo
 * @description Entidad paquete
 */

export interface ICostosPaquete {
    nombre: string
    // costo implementacion
    costoBaseActivacionEnElPaquete: number
    costoBaseMigracionEnElPaquete: number
    costoBaseCapacitacionEnElPaquete: number
    // costo base
    precioBaseMensualDelPaquete: number
    // costo timbres
    timbresGratisIncluidosEnElPaquete: number
    costoTimbreExtraDelPaquete: number
    // costo usuarios
    cantidadUsuariosGratisIncluidos: number
    costoUsuariosExtraSinDescuento: number
    hasPrecioUsuarioExtraVariable: boolean     
    cantidadUsuariosSinDescuento?: number   
    costoUsuariosExtraConDescuento?: number          
    // costo capacitaciones
    usuariosGratisIncluidosEnCapacitacionDelPaquete: number
    costoCapacitacionUsuarioExtraDelPaquete: number
    //
    hasMigracionChecked?: boolean
    hasCapacitacionChecked?: boolean
}

export interface IAtributosDeCostosDinamicosPaquetes {
    cantidadTimbresRequeridos: number
    cantidadUsuariosRequeridos: number
    cantidadEmpleadosAgregados: number
    cantidadSucursalesAgregadas: number
    // pagos
    isPagoImplementacionMensual: boolean
    isModalidadRentaMensual: boolean
    moneda: string
}
