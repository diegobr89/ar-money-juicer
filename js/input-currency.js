class InputCurrency extends HTMLInputElement {

    constructor() {
        super();
        
        type = "number";

        this.addEventListener('change', () => {
            this.value = this.formatNumberAsString(this.value)
            this.valueAsNumber = Number.parseFloat(this.value.replace(/\./g, '').replace(',', '.'));
        }) 
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