/**
 * Gestor de Estado para Reparaciones - TechExchange PTY
 * Controla el flujo de datos de manera inmutable para evitar bugs en la UI.
 */

// 1. Definimos los únicos estados posibles en la aplicación (Evita errores tipográficos)
export const REPAIR_STATES = {
    IDLE: 'IDLE',          // Esperando a que el cliente actúe
    LOADING: 'LOADING',    // Consultando la base de datos o API
    SUCCESS: 'SUCCESS',    // Datos encontrados y listos para mostrar
    ERROR: 'ERROR'         // Fallo de red o ticket inexistente
};

// 2. Variables de estado encapsuladas (No pueden ser modificadas desde afuera sin usar la función)
let currentState = REPAIR_STATES.IDLE;
let currentRepairData = null;
let lastErrorMessage = '';

/**
 * Única vía autorizada para cambiar el estado de la aplicación.
 * @param {string} newState - Debe ser un valor de REPAIR_STATES
 * @param {Object|null} data - Datos del dispositivo (ej. modelo, porcentaje de reparación)
 * @param {string} error - Mensaje de error personalizado
 */
export function setRepairState(newState, data = null, error = '') {
    // Validación de seguridad para evitar estados fantasma
    if (!REPAIR_STATES[newState]) {
        console.error(`[State Error]: El estado "${newState}" no existe en la arquitectura.`);
        return;
    }

    // Actualización de los datos
    currentState = newState;
    currentRepairData = data;
    lastErrorMessage = error;

    // Registro silencioso en consola para facilitar tu trabajo de debugging
    console.log(`[State Transition]: 🔄 Estado actual -> ${currentState}`);
}

/**
 * Función limpia para que cualquier archivo consulte cómo está la aplicación ahora mismo
 * @returns {Object} Objeto con el estado actual, datos y errores
 */
export function getRepairState() {
    return {
        state: currentState,
        data: currentRepairData,
        error: lastErrorMessage
    };
}
