import { FetchHtml } from './fetch-html.js';

const HTML_SOURCE_URL = 'https://dolarhoy.com';

const DOLLAR_TYPES = {
  MEP: "mep",
  CCL: "ccl",
  BLUE: "blue",
  BCRA: "bcra",
};

const HTML_SELECTORS = {
  [DOLLAR_TYPES.BLUE]:
    "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-5 > div > div.values > div.venta > div.val",
  [DOLLAR_TYPES.MEP]:
    "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-7.is-vertical > div:nth-child(3) > div > div.venta > div.val",
  [DOLLAR_TYPES.CCL]:
    "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-7.is-vertical > div:nth-child(4) > div > div.venta > div.val",
  [DOLLAR_TYPES.BCRA]:
    "#home_0 > div.modulo.modulo_bloque > section > div > div > div > div.tile.is-parent.is-9.cotizacion.is-vertical > div > div.tile.is-parent.is-7.is-vertical > div:nth-child(2) > div > div.venta > div.val",
};

export class FetchDollarValue {
  static get DOLLAR_TYPES() {
    return DOLLAR_TYPES;
  }

  static async _fetchDocument() {
    if (!this._document)
      this._document = await FetchHtml.fetchDocument(HTML_SOURCE_URL);
    return this._document;
  }

  static async fetchByType(dollarType = this.DOLLAR_TYPES.BCRA) {
    const extDocument = await this._fetchDocument();
    const selectorByType =
      HTML_SELECTORS[dollarType] ||
      (() => {
        throw new Error("Invalid dollar type");
      })();
    const value = extDocument.body.querySelector(selectorByType).innerHTML;
    return Number(value.replace("$", ""));
  }
}
