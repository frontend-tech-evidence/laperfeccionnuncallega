/**
 * @author Raul Galindo
 * @description Responsabilidad: Retornar los limites del paquete.
 */

import { ILimitesPaquete } from '../domain/ILimitesPaquete'

export function checkLimitesPaquete(
  usuariosRequeridos: number,
  empleadosRequeridos: number,
  sucursalesRequeridos: number,
  limites: ILimitesPaquete
): string {  
  
    const {  
      numeroDeUsuariosPermitidos,
      numeroDeEmpleadosPermitidos,
      numeroDeSucursalesPermitidas,
    } = limites;

    const errores: string[] = [];

    if (usuariosRequeridos > numeroDeUsuariosPermitidos) {
      errores.push("Límite de usuarios alcanzado.");
    }

    if (empleadosRequeridos > numeroDeEmpleadosPermitidos) {
      errores.push("Límite de empleados alcanzado.");
    }

    if (sucursalesRequeridos > numeroDeSucursalesPermitidas) {
      errores.push("Límite de sucursales alcanzado.");
    }

    const mensajeDeError = errores.join(" ");

  return mensajeDeError;
}

export function checkLimitesPaquetes(
  usuariosRequeridos: number,
  empleadosRequeridos: number,
  sucursalesRequeridos: number,
  ...limites: ILimitesPaquete[]
): { mensajeError: string, nombrePaquete: string }[] {
  const resultados: { nombrePaquete: string, mensajeError: string}[] = [];

  for (const limite of limites) {
    const {
      nombrePaquete,
      numeroDeUsuariosPermitidos,
      numeroDeEmpleadosPermitidos,
      numeroDeSucursalesPermitidas,
    } = limite;

    const errores: string[] = [];

    if (usuariosRequeridos > numeroDeUsuariosPermitidos) {
      errores.push("Límite de usuarios alcanzado.");
    }

    if (empleadosRequeridos > numeroDeEmpleadosPermitidos) {
      errores.push("Límite de empleados alcanzado.");
    }

    if (sucursalesRequeridos > numeroDeSucursalesPermitidas) {
      errores.push("Límite de sucursales alcanzado.");
    }

    const mensajeDeError = errores.join(" ");
    resultados.push({nombrePaquete: nombrePaquete, mensajeError: mensajeDeError});
  }

  return resultados;
}

  

