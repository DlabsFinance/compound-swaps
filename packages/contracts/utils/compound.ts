import { Signer, BigNumber } from "ethers";
import { CTokenInterface } from "../typechain";

export async function getCTokenAmount(cToken: CTokenInterface, tokenAmount: BigNumber): Promise<BigNumber> {
  const exchangeRate: BigNumber = await cToken.exchangeRateStored();
  const cTokenAmount = tokenAmount.mul((10 ** 18).toString()).div(exchangeRate);
  return cTokenAmount;
}

export async function getCTokenCurrentAmount(
  cToken: CTokenInterface,
  impersonateAddressSigner: Signer,
  tokenAmount: BigNumber,
): Promise<BigNumber> {
  const exchangeRate: BigNumber = await cToken.connect(impersonateAddressSigner).callStatic.exchangeRateCurrent();
  const cTokenAmount = tokenAmount.mul((10 ** 18).toString()).div(exchangeRate);
  return cTokenAmount;
}
