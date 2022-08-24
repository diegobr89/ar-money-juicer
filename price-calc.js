const MONTHS_IN_YEAR = 12;

class RealPrice{

  constructor(){
    this.estimatedAnualInflation = 0;
    this.actualDollarPrice = 0;
    this.productPrice = 0;
    this.quotaQty = 0;
    this.minimalPrice = 0;
  }

  calculate(dollarFollowsInflation = true){
    const monthlyInflation = this.estimatedAnualInflation / MONTHS_IN_YEAR;
    const monthlyQuotaPrice = this.productPrice / this.quotaQty;
    const firtQuota = {
      costInUsd: monthlyQuotaPrice / this.actualDollarPrice,
      costInArs: monthlyQuotaPrice
    };
    const result = this._looper(firtQuota, monthlyQuotaPrice, monthlyInflation, dollarFollowsInflation, this.quotaQty - 1);
    const effectiveRate = this._effectiveRate(this.minimalPrice, result.costInArs);
    return { effectiveRate, ...result }
  }

  _looper(accumulator, quotaPrice, monthlyInflation, dynamicDollar , quotaQty = 0){
    if(quotaQty == 0)
      return accumulator

    const effectivePercent = monthlyInflation / 100;
    const newQuotaPrice = quotaPrice * (1 - effectivePercent);
    const dollarPriceEstimation = this.actualDollarPrice*(1 + effectivePercent);
    const resultUsd = newQuotaPrice / (dynamicDollar ? dollarPriceEstimation : this.actualDollarPrice);
    accumulator.costInArs += newQuotaPrice;
    accumulator.costInUsd += resultUsd;

    return this._looper(accumulator, newQuotaPrice, monthlyInflation, dynamicDollar, quotaQty-1);
  }

  _effectiveRate(cashPrice, inQuotaPrice) {
    return ((inQuotaPrice * 100) / cashPrice) / 100
  }

}

const realPrice = new RealPrice();
realPrice.estimatedAnualInflation = 100; //Inflacion anual estimada
realPrice.actualDollarPrice = 303; //Precio del dolar blue al dia de la fecha
realPrice.productPrice = 106800; //Precio final del producto en cuotas
realPrice.quotaQty = 6; //Cantidad de cuotas
realPrice.minimalPrice = 94500; // Precio que se puede conseguir el producto en contado efectivo
const { costInArs, costInUsd, effectiveRate } = realPrice.calculate(true); // si se pasa false se estima que el precio del dolar no se mueve

const methodSuggest = realPrice.minimalPrice > costInArs ? 'En cuotas' : 'En efectivo';

const output =
` ------------------------------------ \n` +
`| Inflacion estimada:    ${realPrice.estimatedAnualInflation}% \n` +
`| Precio dolar actual:   $${realPrice.actualDollarPrice}       \n` +
`| Precio final:          $${realPrice.productPrice}            \n` +
`| Cantidad de cuotas:    ${realPrice.quotaQty}                 \n` +
`| Precio en efectivo:    $${realPrice.minimalPrice}           \n` +
` ------------------------------------ \n` +
`\n` +
`·Costo efectivo en pesos ---- ($ARS): ${costInArs.toFixed(2)} \n` +
`·Costo efectivo en dolares -- ($USD): ${costInUsd.toFixed(2)} \n`+
`·Tasa efectiva en ctas --------- (%): ${effectiveRate.toFixed(2)} \n` +
`### Metodo de pago sugerido -> ${methodSuggest}`;

console.log(output);
