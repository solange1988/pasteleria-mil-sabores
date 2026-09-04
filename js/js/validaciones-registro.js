// ===== Referencias a los elementos del formulario =====
const formularioRegistro = document.querySelector("#registroForm");
const inputNombreCompleto = document.querySelector("#nombreCompleto");
const inputCorreoRegistro = document.querySelector("#correoRegistro");
const inputConfirmarCorreo = document.querySelector("#confirmarCorreo");
const inputContrasena = document.querySelector("#contrasena");
const inputConfirmarContrasena = document.querySelector("#confirmarContrasena");

// ===== Validación del nombre =====
const validarNombreCompleto = (valor) => {
    const texto = valor.trim();
    if (texto === "") {
        return { valido: false, mensaje: "El nombre es obligatorio" };
    }
    if (texto.length > 50) {
        return { valido: false, mensaje: "Máximo 50 caracteres" };
    }
    return { valido: true };
};

// ===== Validación de correo (solo dominios permitidos) =====
const validarCorreoRegistro = (valor) => {
    const texto = valor.trim();
    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }
    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" };
    }
    return { valido: true };
};

// ===== Validación de confirmación de correo =====
const validarConfirmarCorreo = (valor) => {
    if (valor.trim() === "") {
        return { valido: false, mensaje: "Debes confirmar tu correo" };
    }
    if (valor.trim() !== inputCorreoRegistro.value.trim()) {
        return { valido: false, mensaje: "Los correos no coinciden" };
    }
    return { valido: true };
};

// ===== Validación de contraseña =====
const validarContrasena = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "La contraseña es obligatoria" };
    }
    if (valor.length < 4 || valor.length > 10) {
        return { valido: false, mensaje: "Debe tener entre 4 y 10 caracteres" };
    }
    return { valido: true };
};

// ===== Validación de confirmación de contraseña =====
const validarConfirmarContrasena = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "Debes confirmar tu contraseña" };
    }
    if (valor !== inputContrasena.value) {
        return { valido: false, mensaje: "Las contraseñas no coinciden" };
    }
    return { valido: true };
};

// ===== Mostrar u ocultar mensaje de error =====
const pintarResultadoRegistro = (input, idError, resultado) => {
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

// ===== Validar en tiempo real =====
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

// ===== Al enviar el formulario =====
formularioRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = [
        validarNombreCompleto(inputNombreCompleto.value),
        validarCorreoRegistro(inputCorreoRegistro.value),
        validarConfirmarCorreo(inputConfirmarCorreo.value),
        validarContrasena(inputContrasena.value),
        validarConfirmarContrasena(inputConfirmarContrasena.value)
    ];

    pintarResultadoRegistro(inputNombreCompleto, "errorNombreCompleto", resultados[0]);
    pintarResultadoRegistro(inputCorreoRegistro, "errorCorreoRegistro", resultados[1]);
    pintarResultadoRegistro(inputConfirmarCorreo, "errorConfirmarCorreo", resultados[2]);
    pintarResultadoRegistro(inputContrasena, "errorContrasena", resultados[3]);
    pintarResultadoRegistro(inputConfirmarContrasena, "errorConfirmarContrasena", resultados[4]);

    const todoValido = resultados.every((r) => r.valido);

    if (todoValido) {
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        formularioRegistro.reset();
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});