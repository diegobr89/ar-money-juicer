const HTML_SELECTORS = {
  blue: "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val",
  mep: "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-7.is-vertical > div:nth-child(3) > div > div.venta > div.val",
  ccl: "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-7.is-vertical > div:nth-child(4) > div > div.venta > div.val",
};

class ActualDollarValue {
  constructor() {
    this._internalHtml = null;
  }

  async _getInternalHtml() {
    if (this._internalHtml) return this._internalHtml;

    const url =
      "https://corsproxy.io/?" + encodeURIComponent("https://dolarhoy.com");
    const request = new Request(url);

    const response = await fetch(request);
    this._internalHtml = await response.text();

    return this._internalHtml;
  }

  async getCurrentValue(type = "mep") {
    const html = await this._getInternalHtml();
    var domParser = new DOMParser();
    var domDocument = domParser.parseFromString(html, "text/html");
    const selectorByType = HTML_SELECTORS[type] || HTML_SELECTORS.mep;
    const value = domDocument.body.querySelector(selectorByType).innerHTML;

    return Number(value.replace('$', ''));
  }
}
