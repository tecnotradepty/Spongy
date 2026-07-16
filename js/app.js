/**
 * Master Controller - TechExchange PTY (Mobile Hub)
 * Este es el orquestador principal. No contiene lógica de negocio pesada,
 * solo captura eventos del DOM y coordina las vistas y los estados.
 */

// Importamos el gestor de estados (Nota: Obligatorio el ./ y el .js para GitHub Pages)
import { setRepairState, getRepairState, REPAIR_STATES } from './state/repairState.js';

// ================= CONSTANTES Y SELECCIÓN DE ELEMENTOS =================

// Botones de Navegación del Header
const NAV_BUTTONS = {
    repairs: document.getElementById('nav-repairs'),
    shop: document.getElementById('nav-shop'),
    quote: document.getElementById('nav-quote'),
    info: document.getElementById('nav-info')
};

// Secciones principales de la Vista (Los contenedores que se ocultan/muestran)
const SECTIONS = {
    repairs: document.getElementById('section-repairs'),
    shop: document.getElementById('section-shop'),
    quote: document.getElementById('section-quote'),
    info: document.getElementById('section-info')
};

// Clases de Tailwind para mutar visualmente los botones de navegación
const ACTIVE_CLASSES = ['text-teal-400', 'bg-teal-950/40', 'border-teal-800/30', 'border'];
const INACTIVE_CLASSES = ['text-gray-400', 'hover:text-gray-200'];

// ================= ENRUTADOR INTERNO (SPA ROUTER) =================

/**
 * Cambia la sección activa de la aplicación de manera limpia forzando el CSS nativo
 * @param {string} targetSection - La clave de la sección a activar (repairs, shop, quote, info)
 */
function navigateTo(targetSection) {
    // 1. Validar que la sección que intentamos abrir realmente exista en el HTML
    if (!SECTIONS[targetSection]) {
        console.error(`[Router Error]: La sección "${targetSection}" no existe en el DOM.`);
        return;
    }

    console.log(`[Router]: Navegando a -> ${targetSection.toUpperCase()}`);

    // 2. Apagar todas las secciones y resetear los colores de los botones
    Object.keys(SECTIONS).forEach(key => {
        // Forzamos el ocultado con CSS directo, inmune a conflictos de Tailwind CDN
        SECTIONS[key].style.display = 'none';
        
        // Dejar el botón con estilo Inactivo
        NAV_BUTTONS[key].classList.remove(...ACTIVE_CLASSES);
        NAV_BUTTONS[key].classList.add(...INACTIVE_CLASSES);
    });

    // 3. Encender únicamente la sección seleccionada
    SECTIONS[targetSection].style.display = 'block';

    // 4. Aplicar los colores de Activo (verde/teal) al botón presionado
    NAV_BUTTONS[targetSection].classList.remove(...INACTIVE_CLASSES);
    NAV_BUTTONS[targetSection].classList.add(...ACTIVE_CLASSES);
}

// ================= REGISTRO DE EVENTOS (EVENT LISTENERS) =================

/**
 * Inicializa los escuchadores de clics y formularios de la aplicación
 */
function initEventListeners() {
    // Asignar el evento de clic a cada botón del menú de navegación
    Object.keys(NAV_BUTTONS).forEach(key => {
        if (NAV_BUTTONS[key]) {
            NAV_BUTTONS[key].addEventListener('click', () => navigateTo(key));
        }
    });

    // Capturar el envío del Formulario de Búsqueda de Reparaciones
    const repairForm = document.getElementById('repair-search-form');
    if (repairForm) {
        repairForm.addEventListener('submit', handleRepairSearch);
    }
}

// ================= MANEJADORES DE EVENTOS (EVENT HANDLERS) =================

/**
 * Gestiona la búsqueda de reparaciones coordinando la interfaz con la Máquina de Estados
 * @param {Event} event - Evento del submit del formulario
 */
async function handleRepairSearch(event) {
    // Evitamos que la página web intente recargarse y nos borre la vista actual
    event.preventDefault(); 
    
    const codeInput = document.getElementById('repair-code');
    const searchCode = codeInput.value.trim().toUpperCase();
    const submitButton = document.getElementById('btn-search-repair');

    // Validar que el usuario no envíe un código vacío
    if (!searchCode) return;

    console.log(`[UI Handler]: Solicitando búsqueda en la base de datos para -> ${searchCode}`);

    // 1. Transición al estado LOADING (Bloqueamos UI para evitar clics repetidos)
    setRepairState(REPAIR_STATES.LOADING);
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="ph ph-circle-notch animate-spin text-xl"></i> <span class="ml-2">Buscando...</span>`;

    // 2. Simulación de retraso de red (1.5 segundos) para simular la futura conexión con Google Sheets
    setTimeout(() => {
        // Simulamos que el ticket no se encontró en el sistema para probar la UI
        setRepairState(REPAIR_STATES.ERROR, null, `El ticket ${searchCode} no existe.`);
        
        // 3. Restauramos la interfaz visual del botón
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="ph ph-magnifying-glass font-bold text-xl"></i> <span class="ml-2">Buscar Estado</span>`;
        
        // Extraemos el estado actual para verificar que la máquina funciona
        const state = getRepairState();
        alert(`Búsqueda Finalizada\nEstado del Sistema: ${state.state}\nDetalle: ${state.error}`);
        
        // 4. Volvemos al estado IDLE (Listo para una nueva búsqueda)
        setRepairState(REPAIR_STATES.IDLE);
        codeInput.value = ''; // Limpiamos el input
    }, 1500);
}

// ================= INICIALIZACIÓN DE LA ORQUESTA =================

// Esperamos a que todo el HTML se dibuje en pantalla antes de ejecutar los scripts
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ Orquesta TechExchange PTY inicializada. Sistema en línea.');
    
    // Conectar todos los cables de eventos
    initEventListeners();
    
    // Forzar el estado inicial: Mostrar siempre "Seguimiento de Reparaciones" al abrir la web
    navigateTo('repairs'); 
});
