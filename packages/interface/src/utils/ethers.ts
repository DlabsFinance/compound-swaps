import { ethers } from "ethers";
import { networkAPI } from "../constants";

export function getDefaultProvider(): ethers.providers.BaseProvider {
  return ethers.getDefaultProvider(networkAPI);
}
