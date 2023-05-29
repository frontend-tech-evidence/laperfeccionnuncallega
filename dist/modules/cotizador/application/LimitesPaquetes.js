/**
 * @author Raul Galindo
 * @description Responsabilidad: Retornar los limites del paquete.
 */
export function checkLimitesPaquete(usuariosRequeridos, empleadosRequeridos, sucursalesRequeridos, limites) {
    const { numeroDeUsuariosPermitidos, numeroDeEmpleadosPermitidos, numeroDeSucursalesPermitidas, } = limites;
    const errores = [];
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
export function checkLimitesPaquetes(usuariosRequeridos, empleadosRequeridos, sucursalesRequeridos, ...limites) {
    const resultados = [];
    for (const limite of limites) {
        const { nombrePaquete, numeroDeUsuariosPermitidos, numeroDeEmpleadosPermitidos, numeroDeSucursalesPermitidas, } = limite;
        const errores = [];
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
        resultados.push({ nombrePaquete: nombrePaquete, mensajeError: mensajeDeError });
    }
    return resultados;
}
