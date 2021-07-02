import { ethers } from "hardhat";
import { Signer, BigNumber } from "ethers";
import { ERC20, CTokenInterface, CErc20Interface, ComptrollerInterface, CEtherInterface } from "../../typechain";
import {
  daiAddress,
  usdcAddress,
  cDAIAddress,
  cUSDCAddress,
  comptrollerAddress,
  daiMintAmount,
  usdcMintAmount,
  cETHAddress,
  ethMintAmount,
  wethAddress,
} from "../../constants";

export interface Initialize {
  DAI: ERC20;
  USDC: ERC20;
  WETH: ERC20;
  cDAI: CTokenInterface;
  cUSDC: CTokenInterface;
  cETH: CTokenInterface;
  daiDecimals: number;
  usdcDecimals: number;
  comptroller: ComptrollerInterface;
  daiAmount: BigNumber;
  usdcAmount: BigNumber;
  ethAmount: BigNumber;
}

export async function initialize(impersonateAddress: string, impersonateAddressSigner: Signer): Promise<Initialize> {
  const DAI: ERC20 = (await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    daiAddress,
  )) as ERC20;
  const USDC: ERC20 = (await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    usdcAddress,
  )) as ERC20;
  const WETH: ERC20 = (await ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20",
    wethAddress,
  )) as ERC20;
  const cDAI: CTokenInterface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CTokenInterface",
    cDAIAddress,
  )) as CTokenInterface;
  const cUSDC: CTokenInterface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CTokenInterface",
    cUSDCAddress,
  )) as CTokenInterface;
  const cETH: CTokenInterface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CTokenInterface",
    cETHAddress,
  )) as CTokenInterface;
  const cDAIToken: CErc20Interface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CErc20Interface",
    cDAIAddress,
  )) as CErc20Interface;
  const cUSDCToken: CErc20Interface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CErc20Interface",
    cUSDCAddress,
  )) as CErc20Interface;
  const cETHToken: CEtherInterface = (await ethers.getContractAt(
    "contracts/interfaces/CTokenInterfaces.sol:CEtherInterface",
    cETHAddress,
  )) as CEtherInterface;
  const comptroller: ComptrollerInterface = (await ethers.getContractAt(
    "contracts/interfaces/ComptrollerInterface.sol:ComptrollerInterface",
    comptrollerAddress,
  )) as ComptrollerInterface;

  const cDAIBalance: BigNumber = await cDAI.balanceOf(impersonateAddress);
  if (cDAIBalance.gt(BigNumber.from("0"))) await cDAIToken.connect(impersonateAddressSigner).redeem(cDAIBalance);
  const cUSDCBalance: BigNumber = await cUSDC.balanceOf(impersonateAddress);
  if (cUSDCBalance.gt(BigNumber.from("0"))) await cUSDCToken.connect(impersonateAddressSigner).redeem(cUSDCBalance);
  const cETHBalance: BigNumber = await cETH.balanceOf(impersonateAddress);
  if (cETHBalance.gt(BigNumber.from("0"))) await cETHToken.connect(impersonateAddressSigner).redeem(cETHBalance);

  const daiDecimals: number = await DAI.decimals();
  const usdcDecimals: number = await USDC.decimals();

  const daiAmount: BigNumber = ethers.utils.parseUnits(daiMintAmount, daiDecimals);
  const usdcAmount: BigNumber = ethers.utils.parseUnits(usdcMintAmount, usdcDecimals);
  const ethAmount: BigNumber = ethers.utils.parseEther(ethMintAmount);
  await DAI.connect(impersonateAddressSigner).approve(cDAIToken.address, daiAmount.mul(2));
  await cDAIToken.connect(impersonateAddressSigner).mint(daiAmount.mul(2));
  await USDC.connect(impersonateAddressSigner).approve(cUSDCToken.address, usdcAmount.mul(2));
  await cUSDCToken.connect(impersonateAddressSigner).mint(usdcAmount.mul(2));
  await cETHToken.connect(impersonateAddressSigner).mint({ value: ethAmount.mul(2) });

  return {
    DAI,
    USDC,
    WETH,
    cDAI,
    cUSDC,
    cETH,
    daiDecimals,
    usdcDecimals,
    daiAmount,
    usdcAmount,
    ethAmount,
    comptroller,
  };
}
