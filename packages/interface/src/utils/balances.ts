import { ethers, BigNumber } from "ethers";
import { Call, Multicall__factory, Multicall, CToken__factory } from "../types";
import { addresses } from "../constants";

export async function getBalances(
  provider: ethers.providers.Provider,
  chainId: number,
  address: string,
  allMarkets: string[]
): Promise<{
  balanceOfUnderlying: BigNumber[];
  borrowBalanceCurrent: BigNumber[];
  balanceOf: BigNumber[];
  cTokenSwapAllowance: BigNumber[];
}> {
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const balanceOfUnderlyingCalls: Call[] = allMarkets.map((market: string) => ({
    target: market,
    callData: CToken__factory.createInterface().encodeFunctionData(
      "balanceOfUnderlying",
      [address]
    ),
  }));
  const borrowBalanceCurrentCalls: Call[] = allMarkets.map(
    (market: string) => ({
      target: market,
      callData: CToken__factory.createInterface().encodeFunctionData(
        "borrowBalanceCurrent",
        [address]
      ),
    })
  );
  const balanceOfCalls: Call[] = allMarkets.map((market: string) => ({
    target: market,
    callData: CToken__factory.createInterface().encodeFunctionData(
      "balanceOf",
      [address]
    ),
  }));
  const cTokenSwapAllowanceCalls: Call[] = allMarkets.map((market: string) => ({
    target: market,
    callData: CToken__factory.createInterface().encodeFunctionData(
      "allowance",
      [address, addresses[chainId].cTokenSwap]
    ),
  }));

  const [
    balanceOfUnderlyingReturnData,
    borrowBalanceCurrentReturnData,
    balanceOfReturnData,
    cTokenSwapAllowanceReturnData,
  ]: [string[], string[], string[], string[]] = (
    await Promise.all([
      multicall.callStatic.aggregate(balanceOfUnderlyingCalls),
      multicall.callStatic.aggregate(borrowBalanceCurrentCalls),
      multicall.callStatic.aggregate(balanceOfCalls),
      multicall.callStatic.aggregate(cTokenSwapAllowanceCalls),
    ])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[], string[], string[], string[]];

  const balanceOfUnderlying: BigNumber[] = balanceOfUnderlyingReturnData.map(
    (returnData: string) => {
      const decoded = CToken__factory.createInterface().decodeFunctionResult(
        "balanceOfUnderlying",
        returnData
      );
      return decoded[0] as BigNumber;
    }
  );
  const borrowBalanceCurrent: BigNumber[] = borrowBalanceCurrentReturnData.map(
    (returnData: string) => {
      const decoded = CToken__factory.createInterface().decodeFunctionResult(
        "borrowBalanceCurrent",
        returnData
      );
      return decoded[0] as BigNumber;
    }
  );
  const balanceOf: BigNumber[] = balanceOfReturnData.map(
    (returnData: string) => {
      const decoded = CToken__factory.createInterface().decodeFunctionResult(
        "balanceOf",
        returnData
      );
      return decoded[0] as BigNumber;
    }
  );
  const cTokenSwapAllowance: BigNumber[] = cTokenSwapAllowanceReturnData.map(
    (returnData: string) => {
      const decoded = CToken__factory.createInterface().decodeFunctionResult(
        "allowance",
        returnData
      );
      return decoded[0] as BigNumber;
    }
  );

  return {
    balanceOfUnderlying,
    borrowBalanceCurrent,
    balanceOf,
    cTokenSwapAllowance,
  };
}
