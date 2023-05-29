/**
 * @author Raul Galindo
 * @description Datos de paquetes
 */

import { ILimitesPaquete } from "./ILimitesPaquete"

export const limitesGrow: ILimitesPaquete = {
    nombrePaquete: "Grow",
    numeroDeUsuariosPermitidos: 14,   
    numeroDeEmpleadosPermitidos: 29,
    numeroDeSucursalesPermitidas: 2, 
}

export const limitesInstitutional: ILimitesPaquete = {
    nombrePaquete: "Institutional",
    numeroDeUsuariosPermitidos: 29,   
    numeroDeEmpleadosPermitidos: 99,
    numeroDeSucursalesPermitidas:10, 
}

export const limitesManufacturing: ILimitesPaquete = {
    nombrePaquete: "Manufacturing",
    numeroDeUsuariosPermitidos: 99,   
    numeroDeEmpleadosPermitidos: 299,
    numeroDeSucursalesPermitidas: 15, 
}

export const limitesEnterprise: ILimitesPaquete = {
    nombrePaquete: "Enterprise",
    numeroDeUsuariosPermitidos: 499,   
    numeroDeEmpleadosPermitidos: 999,
    numeroDeSucursalesPermitidas: 100, 
}
