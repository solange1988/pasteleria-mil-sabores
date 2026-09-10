// ==========================================================================
// CAPTURA DE ELEMENTOS DEL DOM
// ==========================================================================
// Obtención de referencias a los elementos del formulario de registro por sus ID
const formularioRegistro = document.querySelector("#registroForm");
const inputNombreCompleto = document.querySelector("#nombreCompleto");
const inputCorreoRegistro = document.querySelector("#correoRegistro");
const inputConfirmarCorreo = document.querySelector("#confirmarCorreo");
const inputContrasena = document.querySelector("#contrasena");
const inputConfirmarContrasena = document.querySelector("#confirmarContrasena");

// ==========================================================================
// FUNCIONES DE VALIDACIÓN DE CAMPOS
// ==========================================================================

/**
 * Valida el nombre completo del usuario.
 * Requisitos: No puede estar vacío y debe tener un máximo de 50 caracteres.
 */
const validarNombreCompleto = (valor) => {
    const texto = valor.trim(); // Elimina espacios antes y después
    if (texto === "") {
        return { valido: false, mensaje: "El nombre es obligatorio" };
    }
    if (texto.length > 50) {
        return { valido: false, mensaje: "Máximo 50 caracteres" };
    }
    return { valido: true };
};

/**
 * Valida el correo principal ingresado.
 * Requisitos: Obligatorio y debe cumplir el patrón de dominios específicos mediante Regex.
 */
const validarCorreoRegistro = (valor) => {
    const texto = valor.trim();
    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }
    // Expresión regular para admitir únicamente dominios @duoc.cl, @profesor.duoc.cl o @gmail.com
    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" };
    }
    return { valido: true };
};

/**
 * Valida la confirmación de correo.
 * Requisitos: No puede estar vacío y su valor debe coincidir exactamente con el correo principal.
 */
const validarConfirmarCorreo = (valor) => {
    if (valor.trim() === "") {
        return { valido: false, mensaje: "Debes confirmar tu correo" };
    }
    if (valor.trim() !== inputCorreoRegistro.value.trim()) {
        return { valido: false, mensaje: "Los correos no coinciden" };
    }
    return { valido: true };
};

/**
 * Valida la contraseña principal.
 * Requisitos: Obligatoria y debe tener un largo entre 4 y 10 caracteres.
 */
const validarContrasena = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "La contraseña es obligatoria" };
    }
    if (valor.length < 4 || valor.length > 10) {
        return { valido: false, mensaje: "Debe tener entre 4 y 10 caracteres" };
    }
    return { valido: true };
};

/**
 * Valida la confirmación de contraseña.
 * Requisitos: No puede estar vacía y debe coincidir exactamente con la contraseña principal.
 */
const validarConfirmarContrasena = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "Debes confirmar tu contraseña" };
    }
    if (valor !== inputContrasena.value) {
        return { valido: false, mensaje: "Las contraseñas no coinciden" };
    }
    return { valido: true };
};

// ==========================================================================
// FUNCIÓN DE FEEDBACK VISUAL EN EL DOM
// ==========================================================================

/**
 * Actualiza la interfaz gráfica mostrando u ocultando mensajes de error y
 * cambiando el color de borde del campo de texto evaluado.
 * 
 * @param {HTMLElement} input - Campo de entrada evaluado.
 * @param {string} idError - ID del elemento <span> para la alerta.
 * @param {Object} resultado - Objeto { valido: boolean, mensaje?: string }.
 */
const pintarResultadoRegistro = (input, idError, resultado) => {
    const spanError = document.querySelector(`#${idError}`);
    if (resultado.valido) {
        // Campo correcto: oculta el mensaje y limpia el borde
        spanError.textContent = "";
        spanError.style.display = "none";
        input.style.borderColor = "#B0BEC5";
    } else {
        // Campo con errores: muestra mensaje y marca el borde en rojo
        spanError.textContent = resultado.mensaje;
        spanError.style.display = "block";
        input.style.borderColor = "#c0392b";
    }
};

// ==========================================================================
// ESCUCHADORES DE EVENTOS EN TIEMPO REAL (BLUR)
// ==========================================================================

inputNombreCompleto.addEventListener("blur", () => {
    pintarResultadoRegistro(inputNombreCompleto, "errorNombreCompleto", validarNombreCompleto(inputNombreCompleto.value));
});

inputCorreoRegistro.addEventListener("blur", () => {
    pintarResultadoRegistro(inputCorreoRegistro, "errorCorreoRegistro", validarCorreoRegistro(inputCorreoRegistro.value));
});

inputConfirmarCorreo.addEventListener("blur", () => {
    pintarResultadoRegistro(inputConfirmarCorreo, "errorConfirmarCorreo", validarConfirmarCorreo(inputConfirmarCorreo.value));
});

inputContrasena.addEventListener("blur", () => {
    pintarResultadoRegistro(inputContrasena, "errorContrasena", validarContrasena(inputContrasena.value));
});

inputConfirmarContrasena.addEventListener("blur", () => {
    pintarResultadoRegistro(inputConfirmarContrasena, "errorConfirmarContrasena", validarConfirmarContrasena(inputConfirmarContrasena.value));
});

// ==========================================================================
// MANEJO DEL ENVÍO DEL FORMULARIO (SUBMIT)
// ==========================================================================

formularioRegistro.addEventListener("submit", (evento) => {
    // Evita el refresco automático del navegador al enviar el formulario
    evento.preventDefault();

    // Ejecuta todas las funciones de validación y almacena sus resultados en un arreglo
    const resultados = [
        validarNombreCompleto(inputNombreCompleto.value),
        validarCorreoRegistro(inputCorreoRegistro.value),
        validarConfirmarCorreo(inputConfirmarCorreo.value),
        validarContrasena(inputContrasena.value),
        validarConfirmarContrasena(inputConfirmarContrasena.value)
    ];

    // Muestra en la interfaz el resultado visual de cada campo
    pintarResultadoRegistro(inputNombreCompleto, "errorNombreCompleto", resultados[0]);
    pintarResultadoRegistro(inputCorreoRegistro, "errorCorreoRegistro", resultados[1]);
    pintarResultadoRegistro(inputConfirmarCorreo, "errorConfirmarCorreo", resultados[2]);
    pintarResultadoRegistro(inputContrasena, "errorContrasena", resultados[3]);
    pintarResultadoRegistro(inputConfirmarContrasena, "errorConfirmarContrasena", resultados[4]);

    // Comprueba si TODOS los objetos del arreglo tienen la propiedad 'valido' en true
    const todoValido = resultados.every((r) => r.valido);

    if (todoValido) {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        formularioRegistro.reset(); // Limpia todos los campos del formulario
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});