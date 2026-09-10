/**
 * Objeto JS que actúa como base de datos local de Regiones y sus Comunas.
 * Las claves (rm, araucania, nuble) coinciden exactamente con los "value"
 * de los <option> del selector de región en el HTML.
 */
const regionesComunas = {
    rm: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú"],
    araucania: ["Temuco", "Villarrica", "Angol", "Pucón"],
    nuble: ["Chillán", "San Carlos", "Bulnes"]
};

// Captura de referencias de los elementos <select> del DOM mediante sus IDs
const selectRegion = document.querySelector("#region");
const selectComuna = document.querySelector("#comuna");

/**
 * Escuchador de eventos (Event Listener) para detectar cuando el usuario cambia
 * la opción seleccionada en el menú desplegable de Región.
 */
selectRegion.addEventListener("change", () => {
    // Obtiene el valor (clave) de la región seleccionada por el usuario
    const regionElegida = selectRegion.value;

    // Reinicia el selector de comunas dejando solo la opción por defecto
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    // Verifica si hay una región válida seleccionada y si existe en el objeto regionesComunas
    if (regionElegida && regionesComunas[regionElegida]) {
        
        // Recorre el arreglo de comunas de la región seleccionada
        regionesComunas[regionElegida].forEach((comuna) => {
            // Crea un nuevo elemento <option> en el DOM
            const opcion = document.createElement("option");
            
            // Asigna el nombre de la comuna en minúsculas como valor técnico
            opcion.value = comuna.toLowerCase();
            
            // Asigna el nombre de la comuna como texto visible para el usuario
            opcion.textContent = comuna;
            
            // Agrega la nueva opción dentro del selector de comunas
            selectComuna.appendChild(opcion);
        });
    }
});