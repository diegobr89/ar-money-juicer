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
		const diff = inQuotaPrice - cashPrice;
		return (diff/cashPrice) * 100;
  }

}