const MONTHS_IN_YEAR = 12;

export class PricesCalculator {

  static calculate({
    estimatedAnualInflation = 0,
    actualDollarPrice = 0,
    productPrice = 0,
    quotaQty = 0,
    priceInCash = 0
  }, {
    dollarFollowsInflation = true
  } = {}) {
    const monthlyInflation = this.estimatedAnualInflation / MONTHS_IN_YEAR;
    const monthlyQuotaPrice = this.productPrice / this.quotaQty;
    const firtQuota = {
      costInUsd: monthlyQuotaPrice / this.actualDollarPrice,
      costInArs: monthlyQuotaPrice
    };
    const result = this._looper(firtQuota, monthlyQuotaPrice, monthlyInflation, dollarFollowsInflation, this.quotaQty - 1);
    const effectiveRate = this._effectiveRate(this.priceInCash, result.costInArs);
    return { effectiveRate, ...result }
  }

  static _looper(accumulator, quotaPrice, monthlyInflation, dynamicDollar, quotaQty = 0) {
    if (quotaQty == 0)
      return accumulator

    const effectivePercent = monthlyInflation / 100;
    const newQuotaPrice = quotaPrice * (1 - effectivePercent);
    const dollarPriceEstimation = this.actualDollarPrice * (1 + effectivePercent);
    const resultUsd = newQuotaPrice / (dynamicDollar ? dollarPriceEstimation : this.actualDollarPrice);
    accumulator.costInArs += newQuotaPrice;
    accumulator.costInUsd += resultUsd;

    return this._looper(accumulator, newQuotaPrice, monthlyInflation, dynamicDollar, quotaQty - 1);
  }

  static _effectiveRate(cashPrice, inQuotaPrice) {
    const diff = inQuotaPrice - cashPrice;
    return (diff / cashPrice) * 100;
  }

}