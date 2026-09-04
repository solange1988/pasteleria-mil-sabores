// ===== Datos de regiones y sus comunas =====
const regionesComunas = {
    rm: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú"],
    araucania: ["Temuco", "Villarrica", "Angol", "Pucón"],
    nuble: ["Chillán", "San Carlos", "Bulnes"]
};

// ===== Referencias a los selects =====
const selectRegion = document.querySelector("#region");
const selectComuna = document.querySelector("#comuna");

// ===== Cuando cambia la región, actualizar las comunas =====
selectRegion.addEventListener("change", () => {
    const regionElegida = selectRegion.value;

    // Limpiar comunas anteriores
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    if (regionElegida && regionesComunas[regionElegida]) {
        regionesComunas[regionElegida].forEach((comuna) => {
            const opcion = document.createElement("option");
            opcion.value = comuna.toLowerCase();
            opcion.textContent = comuna;
            selectComuna.appendChild(opcion);
        });
    }
});