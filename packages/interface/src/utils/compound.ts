import { ethers, BigNumber } from "ethers";
import {
  Call,
  Market,
  Comptroller,
  Multicall__factory,
  Comptroller__factory,
  Multicall,
  CToken__factory,
} from "../types";
import { addresses } from "../constants";

export async function getCompoundAllMarkets(
  provider: ethers.providers.Provider,
  chainId: number
): Promise<string[]> {
  const comptroller: Comptroller = Comptroller__factory.connect(
    addresses[chainId].comptroller,
    provider
  );

  const getAllMarkets: string[] = await comptroller.getAllMarkets();

  return getAllMarkets;
}

export async function getCompoundMarkets(
  provider: ethers.providers.Provider,
  chainId: number,
  allMarkets: string[]
): Promise<{ markets: Market[]; underlying: string[] }> {
  const comptrollerAddress: string = addresses[chainId].comptroller;
  const multicall: Multicall = Multicall__factory.connect(
    addresses[chainId].multicall,
    provider
  );

  const marketsCalls: Call[] = allMarkets.map((market: string) => ({
    target: comptrollerAddress,
    callData: Comptroller__factory.createInterface().encodeFunctionData(
      "markets",
      [market]
    ),
  }));
  const underlyingCalls: Call[] = allMarkets.map((market: string) => ({
    target: market,
    callData:
      CToken__factory.createInterface().encodeFunctionData("underlying"),
  }));

  const [marketsReturnData, underlyingReturnData]: [string[], string[]] = (
    await Promise.all([
      multicall.callStatic.aggregate(marketsCalls),
      multicall.callStatic.aggregate(underlyingCalls),
    ])
  ).map(
    (aggregateReturn: {
      blockNumber: ethers.BigNumber;
      returnData: string[];
    }) => aggregateReturn.returnData
  ) as [string[], string[]];

  const markets: Market[] = marketsReturnData.map((returnData: string) => {
    const decoded = Comptroller__factory.createInterface().decodeFunctionResult(
      "markets",
      returnData
    );
    return {
      isListed: decoded[0] as boolean,
      collateralFactorMantissa: decoded[1] as BigNumber,
      isComped: decoded[2] as boolean,
    };
  });
  const underlying: string[] = underlyingReturnData.map(
    (returnData: string) => {
      if (returnData === "0x") {
        return ethers.constants.AddressZero;
      } else {
        const decoded = CToken__factory.createInterface().decodeFunctionResult(
          "underlying",
          returnData
        );
        return decoded[0] as string;
      }
    }
  );

  return { markets, underlying };
}
