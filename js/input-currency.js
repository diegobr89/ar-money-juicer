class InputCurrency extends HTMLInputElement {

    set value(value) {
        this.value = this.formatNumberAsString(value);
    }

    get valueAsNumber() {
        return Number.parseFloat(this.value.replace(/\./g, '').replace(',', '.'));
    }

    constructor() {
        super();
        this.type = "number";
    }


    formatNumberAsString(value) {

        // Eliminar todos los puntos existentes para poder formatear adecuadamente
        const newValue = value.replace(/\./g, '');

        // Obtener la parte decimal (si existe)
        const partes = newValue.split(',');
        let parteDecimal = '';
        if (partes.length > 1) {
            parteDecimal = ',' + partes.pop();
        }

        // Formatear la parte entera con un punto cada tres dígitos
        const parteEntera = partes.join('').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        // Combinar la parte entera y la decimal (si existe)
        const numeroFormateado = parteEntera + parteDecimal;

        // Asignar el valor formateado al input
        return numeroFormateado;
    }
}

customElements.define("input-currency", InputCurrency, { extends: "input" });