
// Obtención de referencias a los elementos del formulario de contacto por sus ID
const formulario = document.querySelector("#contactoForm");
const inputNombre = document.querySelector("#nombre");
const inputCorreo = document.querySelector("#correo");
const inputMensaje = document.querySelector("#mensaje");

// ==========================================================================
// FUNCIONES DE VALIDACIÓN
// ==========================================================================

/**
 * Valida el nombre del usuario.
 * Requisitos:
 * 1. Campo obligatorio.
 * 2. Mínimo 3 caracteres.
 * 3. Solo letras (incluye tildes y eñes) y espacios mediante expresión regular.
 */
const validarNombre = (valor) => {
    const texto = valor.trim(); // Limpia espacios iniciales y finales

    if (texto === "") {
        return { valido: false, mensaje: "El nombre es obligatorio" };
    }
    if (texto.length < 3) {
        return { valido: false, mensaje: "Debe tener al menos 3 caracteres" };
    }
    // Regex que valida únicamente caracteres alfabéticos en español y espacios
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(texto)) {
        return { valido: false, mensaje: "Solo se permiten letras y espacios" };
    }

    return { valido: true };
};

/**
 * Valida el correo electrónico ingresado.
 * Requisitos:
 * 1. Campo obligatorio.
 * 2. Debe cumplir con un formato estándar de correo electrónico (usuario@dominio.ext).
 */
const validarCorreo = (valor) => {
    const texto = valor.trim();

    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }

    // Expresión regular estándar para correos generales
    const patron = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Escribe un correo válido, por ejemplo nombre@correo.com" };
    }

    return { valido: true };
};

/**
 * Valida el cuerpo del mensaje de contacto.
 * Requisitos:
 * 1. No puede estar vacío.
 * 2. Mínimo 10 caracteres para garantizar una consulta detallada.
 * 3. Máximo 500 caracteres para evitar spam o textos excesivamente largos.
 */
const validarMensaje = (valor) => {
    const texto = valor.trim();

    if (texto === "") {
        return { valido: false, mensaje: "El mensaje no puede estar vacío" };
    }
    if (texto.length < 10) {
        return { valido: false, mensaje: "Cuéntanos un poco más (mínimo 10 caracteres)" };
    }
    if (texto.length > 500) {
        return { valido: false, mensaje: "El mensaje es muy largo (máximo 500 caracteres)" };
    }

    return { valido: true };
};

// ==========================================================================
// FUNCIÓN DE FEEDBACK VISUAL EN EL DOM
// ==========================================================================

/**
 * Muestra u oculta mensajes de error en el DOM y cambia el estilo del campo.
 * 
 * @param {HTMLElement} input - Campo HTML evaluado.
 * @param {string} idError - ID del contenedor del mensaje de error (<span>).
 * @param {Object} resultado - Objeto con el resultado { valido: boolean, mensaje?: string }.
 */
const pintarResultado = (input, idError, resultado) => {
    const spanError = document.querySelector(`#${idError}`);

    if (resultado.valido) {
        // Estado correcto: oculta el mensaje de error y restablece el borde neutro
        spanError.textContent = "";
        spanError.style.display = "none";
        input.style.borderColor = "#B0BEC5";
    } else {
        // Estado con error: muestra el mensaje y destaca el borde con color rojo
        spanError.textContent = resultado.mensaje;
        spanError.style.display = "block";
        input.style.borderColor = "#c0392b";
    }
};

// ==========================================================================
// ESCUCHADORES DE EVENTOS EN TIEMPO REAL (BLUR)
// ==========================================================================

// Valida el campo Nombre al perder el foco
inputNombre.addEventListener("blur", () => {
    pintarResultado(inputNombre, "errorNombre", validarNombre(inputNombre.value));
});

// Valida el campo Correo al perder el foco
inputCorreo.addEventListener("blur", () => {
    pintarResultado(inputCorreo, "errorCorreo", validarCorreo(inputCorreo.value));
});

// Valida el campo Mensaje al perder el foco
inputMensaje.addEventListener("blur", () => {
    pintarResultado(inputMensaje, "errorMensaje", validarMensaje(inputMensaje.value));
});

// ==========================================================================
// MANEJO DEL ENVÍO DEL FORMULARIO (SUBMIT)
// ==========================================================================

formulario.addEventListener("submit", (evento) => {
    // Evita el envío por defecto y la recarga de la página
    evento.preventDefault();

    // Valida todos los campos al momento de presionar el botón de envío
    const resultadoNombre = validarNombre(inputNombre.value);
    const resultadoCorreo = validarCorreo(inputCorreo.value);
    const resultadoMensaje = validarMensaje(inputMensaje.value);

    // Muestra los errores correspondientes si los hubiera
    pintarResultado(inputNombre, "errorNombre", resultadoNombre);
    pintarResultado(inputCorreo, "errorCorreo", resultadoCorreo);
    pintarResultado(inputMensaje, "errorMensaje", resultadoMensaje);

    // Verifica que todos los campos sean válidos antes de procesar el mensaje
    if (resultadoNombre.valido && resultadoCorreo.valido && resultadoMensaje.valido) {
        alert("¡Gracias por tu mensaje! Te responderemos pronto.");
        formulario.reset(); // Limpia los campos del formulario tras un envío exitoso
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});