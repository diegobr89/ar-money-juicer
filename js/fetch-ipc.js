import { FetchHtml } from "./fetch-html.js";

const INTERAUNNUAL_IPC_URL =
  "https://datosmacro.expansion.com/ipc-paises/argentina";
const MONTHLY_IPC_URL =
  "https://datosmacro.expansion.com/ipc-paises/argentina?sector=IPC+General&sc=IPC-IG";

const INTERAUNNUAL_IPC_SELECTORS = {
  interannual_date:
    "body > div.dialog-off-canvas-main-canvas > div.main-container.container.js-quickedit-main-content > div > section > div > article > div > div:nth-child(5) > div > div.tabletit",
  interannual: "#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(2)",
  lastKnwonMonthlyInflationValue:
    "#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(6)",
};

const MONTHS_MAPPINGS = {
  Enero: 0,
  Febrero: 1,
  Marzo: 2,
  Abril: 3,
  Mayo: 4,
  Junio: 5,
  Julio: 6,
  Agosto: 7,
  Septiembre: 8,
  Octubre: 9,
  Noviembre: 10,
  Diciembre: 11,
};

export class FetchIPC {
  static _percentageToNumber(strValue) {
    return Number(strValue.replace("%", "").replace(",", "."));
  }

  static async _fetchDocument(url = INTERAUNNUAL_IPC_URL) {
    if (!this._document) this._document = await FetchHtml.fetchDocument(url);
    return this._document;
  }

  static async _fetchBySelector(htmlSelector) {
    const extDocument = await this._fetchDocument();
    return extDocument.body.querySelector(
      INTERAUNNUAL_IPC_SELECTORS[htmlSelector]
    ).innerHTML;
  }

  static _parseIPCDate(ipcStringDate) {
    const [yearStr, monthStr] = ipcStringDate.split(' ').reverse();
    const monthNum = MONTHS_MAPPINGS[monthStr];
    const yearNum = Number(yearStr);

    return new Date(yearNum, monthNum, 1);
  }

  static async fetchInterannual() {
    const [dateTitle, interannual] = await Promise.all([
      this._fetchBySelector("interannual_date"),
      this._fetchBySelector("interannual"),
    ]);

    return {
      date: this._parseIPCDate(dateTitle),
      value: this._percentageToNumber(interannual),
    };
  }
  static async fetchLastKnwonMonthlyInflationValue() {
    const [dateTitle, lastKnwonMonthlyInflationValue] = await Promise.all([
      this._fetchBySelector("interannual_date"),
      this._fetchBySelector("lastKnwonMonthlyInflationValue"),
    ]);

    return {
      date: this._parseIPCDate(dateTitle),
      value: this._percentageToNumber(lastKnwonMonthlyInflationValue),
    };
  }

  static async fetchLastTwelveMonthsInflation() {
    const extDocument = await this._fetchDocument(MONTHLY_IPC_URL);

    return Array.from(
      extDocument.body.querySelectorAll("#tb1_415 > tbody > tr")
    ).map((trDomNode) => {
      const ipcDateStr = trDomNode.querySelector("td:nth-child(1)").innerHTML;
      const ipcMonthCumulative =
        trDomNode.querySelector("td:nth-child(6)").innerHTML;

      return {
        date: this._parseIPCDate(ipcDateStr),
        value: this._percentageToNumber(ipcMonthCumulative),
      };
    });
  }
}
