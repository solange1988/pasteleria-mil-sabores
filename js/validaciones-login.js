// ===== Referencias a los elementos del formulario =====
const formularioLogin = document.querySelector("#loginForm");
const inputCorreoLogin = document.querySelector("#correoLogin");
const inputContrasenaLogin = document.querySelector("#contrasenaLogin");

// ===== Validación del correo (según reglas del caso) =====
const validarCorreoLogin = (valor) => {
    const texto = valor.trim();

    if (texto === "") {
        return { valido: false, mensaje: "El correo es obligatorio" };
    }
    if (texto.length > 100) {
        return { valido: false, mensaje: "Máximo 100 caracteres" };
    }

    const patron = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!patron.test(texto)) {
        return { valido: false, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com" };
    }

    return { valido: true };
};

// ===== Validación de la contraseña (según reglas del caso) =====
const validarContrasenaLogin = (valor) => {
    if (valor === "") {
        return { valido: false, mensaje: "La contraseña es obligatoria" };
    }
    if (valor.length < 4 || valor.length > 10) {
        return { valido: false, mensaje: "Debe tener entre 4 y 10 caracteres" };
    }

    return { valido: true };
};

// ===== Mostrar u ocultar mensaje de error =====
const pintarResultadoLogin = (input, idError, resultado) => {
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
inputCorreoLogin.addEventListener("blur", () => {
    pintarResultadoLogin(inputCorreoLogin, "errorCorreoLogin", validarCorreoLogin(inputCorreoLogin.value));
});

inputContrasenaLogin.addEventListener("blur", () => {
    pintarResultadoLogin(inputContrasenaLogin, "errorContrasenaLogin", validarContrasenaLogin(inputContrasenaLogin.value));
});

// ===== Al enviar el formulario =====
formularioLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultadoCorreo = validarCorreoLogin(inputCorreoLogin.value);
    const resultadoContrasena = validarContrasenaLogin(inputContrasenaLogin.value);

    pintarResultadoLogin(inputCorreoLogin, "errorCorreoLogin", resultadoCorreo);
    pintarResultadoLogin(inputContrasenaLogin, "errorContrasenaLogin", resultadoContrasena);

    if (resultadoCorreo.valido && resultadoContrasena.valido) {
        alert("¡Inicio de sesión exitoso! Bienvenido/a a Pastelería Mil Sabores.");
        formularioLogin.reset();
    } else {
        console.log("El formulario tiene errores, revisa los campos marcados.");
    }
});