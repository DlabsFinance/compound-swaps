import { ethers } from "hardhat";
import { Wallet, Signer } from "ethers";
import { CTokenSwap, CTokenSwap__factory } from "../typechain";
import { uniswapV3FactoryAddress, wethAddress } from "../constants";

export async function migrate(owner: Wallet): Promise<CTokenSwap> {
  const cTokenSwapFactory: CTokenSwap__factory = (await ethers.getContractFactory(
    "contracts/CTokenSwap.sol:CTokenSwap",
    owner,
  )) as CTokenSwap__factory;
  const cTokenSwap: CTokenSwap = await cTokenSwapFactory.connect(owner).deploy(uniswapV3FactoryAddress, wethAddress);
  return cTokenSwap;
}

async function main() {
  const accounts: Signer[] = await ethers.getSigners();
  const owner: Wallet = <Wallet>accounts[0];
  console.log("Owner address:", owner.address);
  const cTokenSwap: CTokenSwap = await migrate(owner);
  console.log("CTokenSwap address:", cTokenSwap.address);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
