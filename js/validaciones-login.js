// ==========================================================================
// CAPTURA DE ELEMENTOS DEL DOM
// ==========================================================================
// Referencias a los elementos HTML del formulario de inicio de sesión mediante sus ID
const formularioLogin = document.querySelector("#loginForm");
const inputCorreoLogin = document.querySelector("#correoLogin");
const inputContrasenaLogin = document.querySelector("#contrasenaLogin");

// ==========================================================================
// FUNCIONES DE VALIDACIÓN
// ==========================================================================

/**
 * Valida el correo electrónico ingresado según tres reglas:
 * 1. Que no esté vacío.
 * 2. Que no supere los 100 caracteres.
 * 3. Que coincida con los dominios permitidos mediante Expresiones Regulares (Regex).
 */
const validarCorreoLogin = (valor) => {
    const texto = valor.trim(); // Elimina espacios en blanco al inicio y al final

    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }
    if (texto.length > 100) {
        return { valido: false, mensaje: "Máximo 100 caracteres" };
    }

    // Expresión Regular para restringir dominios a: @duoc.cl, @profesor.duoc.cl o @gmail.com
    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" };
    }

    return { valido: true };
};

/**
 * Valida la contraseña según dos reglas:
 * 1. Que no esté vacía.
 * 2. Que su longitud esté en el rango de 4 a 10 caracteres.
 */
const validarContrasenaLogin = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "La contraseña es obligatoria" };
    }
    if (valor.length < 4 || valor.length > 10) {
        return { valido: false, mensaje: "Debe tener entre 4 y 10 caracteres" };
    }

    return { valido: true };
};

// ==========================================================================
// FUNCIÓN DE FEEDBACK VISUAL (PINTAR ERRORES EN EL DOM)
// ==========================================================================

/**
 * Muestra u oculta los mensajes de error dinámicamente y cambia el borde del input.
 * @param {HTMLElement} input - El campo de texto evaluado.
 * @param {string} idError - El ID del elemento <span> donde se mostrará el mensaje de error.
 * @param {Object} resultado - Objeto que contiene { valido: boolean, mensaje?: string }.
 */
const pintarResultadoLogin = (input, idError, resultado) => {
    const spanError = document.querySelector(`#${idError}`);

    if (resultado.valido) {
        // Estado válido: oculta la alerta y restablece el borde neutro
        spanError.textContent = "";
        spanError.style.display = "none";
        input.style.borderColor = "#B0BEC5";
    } else {
        // Estado inválido: muestra el mensaje de error y resalta el campo con borde rojo
        spanError.textContent = resultado.mensaje;
        spanError.style.display = "block";
        input.style.borderColor = "#c0392b";
    }
};

// ==========================================================================
// ESCUCHADORES DE EVENTOS EN TIEMPO REAL (BLUR)
// ==========================================================================

// Valida el correo cuando el usuario quita el foco (cursor) del input
inputCorreoLogin.addEventListener("blur", () => {
    pintarResultadoLogin(inputCorreoLogin, "errorCorreoLogin", validarCorreoLogin(inputCorreoLogin.value));
});

// Valida la contraseña cuando el usuario quita el foco (cursor) del input
inputContrasenaLogin.addEventListener("blur", () => {
    pintarResultadoLogin(inputContrasenaLogin, "errorContrasenaLogin", validarContrasenaLogin(inputContrasenaLogin.value));
});

// ==========================================================================
// MANEJO DE ENVÍO DEL FORMULARIO (SUBMIT)
// ==========================================================================

formularioLogin.addEventListener("submit", (evento) => {
    // Detiene el comportamiento por defecto de recargar la página al enviar
    evento.preventDefault();

    // Valida ambos campos de forma simultánea
    const resultadoCorreo = validarCorreoLogin(inputCorreoLogin.value);
    const resultadoContrasena = validarContrasenaLogin(inputContrasenaLogin.value);

    // Muestra los errores correspondientes si los hubiera
    pintarResultadoLogin(inputCorreoLogin, "errorCorreoLogin", resultadoCorreo);
    pintarResultadoLogin(inputContrasenaLogin, "errorContrasenaLogin", resultadoContrasena);

    // Si todas las validaciones son exitosas, confirma el inicio de sesión
    if (resultadoCorreo.valido && resultadoContrasena.valido) {
        alert("¡Inicio de sesión exitoso! Bienvenido/a a Pastelería Mil Sabores.");
        formularioLogin.reset(); // Reinicia los campos del formulario
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});