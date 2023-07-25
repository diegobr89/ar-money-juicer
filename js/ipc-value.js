class IPCValue {
  constructor() {
    this._internalHtml = null;
  }

  async _getInternalHtml() {
    if (this._internalHtml) return this._internalHtml;

    const url =
      "https://corsproxy.io/?" + encodeURIComponent("https://datosmacro.expansion.com/ipc-paises/argentina");
    const request = new Request(url);

    const response = await fetch(request);
    this._internalHtml = await response.text();

    return this._internalHtml;
  }

  async getCurrentValue() {
    const html = await this._getInternalHtml();
    var domParser = new DOMParser();
    var domDocument = domParser.parseFromString(html, "text/html");
		const interanual = domDocument.body.querySelector('#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(2)').innerHTML;
		const varMensual = domDocument.body.querySelector('#tb1_415 > tbody > tr:nth-child(1) > td:nth-child(6)').innerHTML;

		const percentToNum = (strValue) => Number(strValue.replace('%', '').replace(',', '.'));

    return percentToNum(interanual) + percentToNum(varMensual) ;
  }
}


