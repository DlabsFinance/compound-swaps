import { ethers } from "hardhat";
import { Signer, Wallet } from "ethers";
import { CTokenSwap } from "../typechain";
import { migrate as migrateCTokenSwap } from "./CTokenSwap";

export interface Migration {
  cTokenSwap: CTokenSwap;
}

export async function migrate(owner: Wallet, isTest: boolean = true): Promise<Migration> {
  const cTokenSwap = await migrateCTokenSwap(owner);
  if (!isTest) console.log("CTokenSwap address:", cTokenSwap.address);
  return { cTokenSwap };
}

async function main() {
  const accounts: Signer[] = await ethers.getSigners();
  const owner: Wallet = <Wallet>accounts[0];
  console.log("Owner address:", owner.address);
  await migrate(owner, false);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
