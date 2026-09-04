// ===== Referencias a los elementos del formulario =====
const formulario = document.querySelector("#contactoForm");
const inputNombre = document.querySelector("#nombre");
const inputCorreo = document.querySelector("#correo");
const inputMensaje = document.querySelector("#mensaje");

// ===== Validación del nombre =====
const validarNombre = (valor) => {
    const texto = valor.trim();

    if (texto === "") {
        return { valido: false, mensaje: "El nombre es obligatorio" };
    }
    if (texto.length < 3) {
        return { valido: false, mensaje: "Debe tener al menos 3 caracteres" };
    }
    if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(texto)) {
        return { valido: false, mensaje: "Solo se permiten letras y espacios" };
    }

    return { valido: true };
};

// ===== Validación del correo =====
const validarCorreo = (valor) => {
    const texto = valor.trim();

    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }

    const patron = /^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Escribe un correo válido, por ejemplo nombre@correo.com" };
    }

    return { valido: true };
};

// ===== Validación del mensaje =====
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

// ===== Función para mostrar u ocultar el mensaje de error =====
const pintarResultado = (input, idError, resultado) => {
    const spanError = document.querySelector(`#${idError}`);

    if (resultado.valido) {
        spanError.textContent = "";
        spanError.style.display = "none";
        input.style.borderColor = "#B0BEC5";
    } else {
        spanError.textContent = resultado.mensaje;
        spanError.style.display = "block";
        input.style.borderColor = "#c0392b";
    }
};

// ===== Validar en tiempo real cuando el usuario sale de cada campo =====
inputNombre.addEventListener("blur", () => {
    pintarResultado(inputNombre, "errorNombre", validarNombre(inputNombre.value));
});

inputCorreo.addEventListener("blur", () => {
    pintarResultado(inputCorreo, "errorCorreo", validarCorreo(inputCorreo.value));
});

inputMensaje.addEventListener("blur", () => {
    pintarResultado(inputMensaje, "errorMensaje", validarMensaje(inputMensaje.value));
});

// ===== Al enviar el formulario, validar todo de nuevo =====
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultadoNombre = validarNombre(inputNombre.value);
    const resultadoCorreo = validarCorreo(inputCorreo.value);
    const resultadoMensaje = validarMensaje(inputMensaje.value);

    pintarResultado(inputNombre, "errorNombre", resultadoNombre);
    pintarResultado(inputCorreo, "errorCorreo", resultadoCorreo);
    pintarResultado(inputMensaje, "errorMensaje", resultadoMensaje);

    if (resultadoNombre.valido && resultadoCorreo.valido && resultadoMensaje.valido) {
        alert("¡Gracias por tu mensaje! Te responderemos pronto.");
        formulario.reset();
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});