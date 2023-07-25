import { FetchHtml } from "./fetch-html.js";

const HTML_SOURCE_URL = "https://datosmacro.expansion.com/ipc-paises/argentina";

const HTML_SELECTORS = {
  interannual: "#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(2)",
  lastKnwonMonthlyInflationValue:
    "#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(6)",
};

export class FetchIPC {
  static _percentageToNumber(strValue) {
    return Number(strValue.replace("%", "").replace(",", "."));
  }

  static async _fetchDocument() {
    if (!this._document)
      this._document = await FetchHtml.fetchDocument(HTML_SOURCE_URL);
    return this._document;
  }

  static async _fetchBySelector(htmlSelector) {
    const extDocument = await this._fetchDocument();
    return extDocument.body.querySelector(HTML_SELECTORS[htmlSelector])
      .innerHTML;
  }

  static async fetchInterannual() {
    const interannual = await this._fetchBySelector("interannual");
    return this._percentageToNumber(interannual);
  }
  static async fetchLastKnwonMonthlyInflationValue() {
    const lastKnwonMonthlyInflationValue = await this._fetchBySelector(
      "lastKnwonMonthlyInflationValue"
    );
    return this._percentageToNumber(lastKnwonMonthlyInflationValue);
  }

  static async fetchEstimatedAnualInflation() {
    const interannual = await this.fetchInterannual();
    const lastKnwonMonthlyInflationValue =
      await this.fetchLastKnwonMonthlyInflationValue();
    return interannual + lastKnwonMonthlyInflationValue;
  }
}
