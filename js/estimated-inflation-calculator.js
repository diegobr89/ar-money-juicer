import { FetchIPC } from "./fetch-ipc.js";

export class EstimatedInflationCalculator {
  static async calculate() {
    const [
      { date: interannualDate, value: interannualValue },
      lastTwelveMonthsInfo,
    ] = await Promise.all([
      FetchIPC.fetchInterannual(),
      FetchIPC.fetchLastTwelveMonthsInflation(),
    ]);

    const monthMultiplier = 11 - interannualDate.getMonth();

    const medianValue = this._getMedianValue(
      lastTwelveMonthsInfo.map(({ value }) => value)
    );

    return interannualValue + monthMultiplier * medianValue;
  }

  static _getMedianValue(arr) {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);

    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  }
}
