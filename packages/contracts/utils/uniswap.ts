import { BigNumber } from "ethers";
import { PoolKey } from "../types";

const feeDenominator: BigNumber = BigNumber.from("1000000");

export function calculateFee(amount: BigNumber, fee: BigNumber): BigNumber {
  const newAmount: BigNumber = amount.mul(feeDenominator).div(feeDenominator.add(fee));
  return newAmount;
}

export function getAmounts(
  token: string,
  amount: BigNumber,
  poolKey: PoolKey,
): {
  amount: BigNumber;
  amount0: BigNumber;
  amount1: BigNumber;
} {
  const fee: BigNumber = BigNumber.from(poolKey.fee);
  const newAmount: BigNumber = calculateFee(amount, fee);
  if (token === poolKey.token0) {
    return {
      amount: newAmount,
      amount0: newAmount,
      amount1: BigNumber.from("0"),
    };
  } else if (token === poolKey.token1) {
    return {
      amount: newAmount,
      amount0: BigNumber.from("0"),
      amount1: newAmount,
    };
  } else {
    throw new Error("token not in poolKey");
  }
}
