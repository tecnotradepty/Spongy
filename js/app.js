/**
 * Master Controller - TechExchange PTY (Mobile Hub)
 * Este es el orquestador principal. No contiene lógica de negocio pesada,
 * solo captura eventos del DOM y coordina las vistas y los estados.
 */

// Importamos el gestor de estados para tenerlo listo
import { setRepairState, getRepairState, REPAIR_STATES } from './state/repairState.js';

// ================= CONSTANTES Y SELECCIÓN DE ELEMENTOS =================

// Botones de Navegación
const NAV_BUTTONS = {
    repairs: document.getElementById('nav-repairs'),
    shop: document.getElementById('nav-shop'),
    quote: document.getElementById('nav-quote'),
    info: document.getElementById('nav-info')
};

// Secciones de la Vista
const SECTIONS = {
    repairs: document.getElementById('section-repairs'),
    shop: document.getElementById('section-shop'),
    quote: document.getElementById('section-quote'),
    info: document.getElementById('section-info')
};

// Clases de Tailwind para botones Activos e Inactivos
const ACTIVE_CLASSES = ['text-teal-400', 'bg-teal-950/40', 'border-teal-800/30', 'border'];
const INACTIVE_CLASSES = ['text-gray-400', 'hover:text-gray-200'];

// ================= ENRUTADOR INTERNO (SPA ROUTER) =================

/**
 * Cambia la sección activa de la aplicación de manera limpia
 * @param {string} targetSection - La clave de la sección a activar (repairs, shop, quote, info)
 */
function navigateTo(targetSection) {
    // 1. Validar que la sección exista
    if (!SECTIONS[targetSection]) {
        console.error(`[Router Error]: La sección "${targetSection}" no existe.`);
        return;
    }

    console.log(`[Router]: Navegando a -> ${targetSection.toUpperCase()}`);

    // 2. Ocultar todas las secciones y resetear clases de navegación
    Object.keys(SECTIONS).forEach(key => {
        // Ocultar sección en el HTML
        SECTIONS[key].classList.add('hidden');
        
        // Dejar el botón con estilo Inactivo
        NAV_BUTTONS[key].classList.remove(...ACTIVE_CLASSES);
        NAV_BUTTONS[key].classList.add(...INACTIVE_CLASSES);
    });

    // 3. Mostrar la sección seleccionada
    SECTIONS[targetSection].classList.remove('hidden');

    // 4. Aplicar estilos de Activo al botón presionado
    NAV_BUTTONS[targetSection].classList.remove(...INACTIVE_CLASSES);
    NAV_BUTTONS[targetSection].classList.add(...ACTIVE_CLASSES);
}

// ================= REGISTRO DE EVENTOS (EVENT LISTENERS) =================

/**
 * Inicializa los escuchadores de eventos de la aplicación
 */
function initEventListeners() {
    // Configurar clics de navegación
    Object.keys(NAV_BUTTONS).forEach(key => {
        NAV_BUTTONS[key].addEventListener('click', () => navigateTo(key));
    });

    // Captura del Formulario de Búsqueda de Reparaciones (Placeholder inicial)
    const repairForm = document.getElementById('repair-search-form');
    if (repairForm) {
        repairForm.addEventListener('submit', handleRepairSearch);
    }
}

// ================= MANEJADORES DE EVENTOS (EVENT HANDLERS) =================

/**
 * Gestiona la búsqueda de reparaciones coordinando la interfaz con el estado
 * @param {Event} event - Evento del submit del formulario
 */
async function handleRepairSearch(event) {
    event.preventDefault(); // Evitamos que la página se recargue
    
    const codeInput = document.getElementById('repair-code');
    const searchCode = codeInput.value.trim().toUpperCase();
    const submitButton = document.getElementById('btn-search-repair');

    if (!searchCode) return;

    console.log(`[UI Handler]: Solicitando búsqueda para el código -> ${searchCode}`);

    // 1. Transición al estado LOADING (Bloqueamos UI)
    setRepairState(REPAIR_STATES.LOADING);
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="ph ph-circle-notch animate-spin"></i> <span>Buscando...</span>`;

    // 2. Simulación de retraso de red (1.5 segundos) antes de conectar con el SheetService
    setTimeout(() => {
        // Por ahora simulamos un error de "no encontrado" para probar el flujo de estados
        setRepairState(REPAIR_STATES.ERROR, null, `El ticket ${searchCode} no fue encontrado en el sistema.`);
        
        // 3. Restauramos la UI
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="ph ph-magnifying-glass"></i> <span>Buscar Estado</span>`;
        
        // Renderizamos la respuesta en consola o UI
        const state = getRepairState();
        alert(`Estado: ${state.state}\nError: ${state.error}`);
        
        // Volvemos al estado IDLE
        setRepairState(REPAIR_STATES.IDLE);
    }, 1500);
}

// ================= INICIALIZACIÓN DE LA ORQUESTA =================
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ TechExchange PTY - Mobile Hub inicializado correctamente.');
    initEventListeners();
});
