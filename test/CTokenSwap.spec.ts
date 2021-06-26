import { ethers, network } from "hardhat";
import { BigNumber, Signer, Wallet } from "ethers";
import { expect } from "chai";
import { CTokenSwap, ERC20, CTokenInterface } from "../typechain";
import {
  impersonateAddress,
  uniswapV3FactoryAddress,
  exchangeAddress,
  daiUSDCTrade,
  usdcDAITrade,
  ethDAITrade,
  daiETHTrade,
  wethAddress,
  uniDAIWETHPool,
  uniDAIWETHPoolKey,
  daiUSDCTradeFlash,
  uniUSDCWETHPool,
  uniUSDCWETHPoolKey,
  usdcDAITradeFlash,
  wethDAITradeFlash,
  daiWETHTradeFlash,
  flashCallbackTestData,
} from "../constants";
import { migrate } from "../scripts/migrate";
import { initialize, getCTokenAmount, getAmounts, Amounts } from "./shared";

describe("unit/CTokenSwap", () => {
  let accounts: Signer[];
  let owner: Wallet;
  let cTokenSwap: CTokenSwap;
  let impersonateAddressSigner: Signer;
  let DAI: ERC20;
  let USDC: ERC20;
  let WETH: ERC20;
  let cDAI: CTokenInterface;
  let cUSDC: CTokenInterface;
  let cETH: CTokenInterface;
  let daiDecimals: number;
  let daiAmount: BigNumber;
  let usdcAmount: BigNumber;
  let ethAmount: BigNumber;

  before(async () => {
    accounts = await ethers.getSigners();
    owner = <Wallet>accounts[0];
    impersonateAddressSigner = await ethers.provider.getSigner(impersonateAddress);
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [impersonateAddress],
    });
    ({ cTokenSwap } = await migrate(owner));
    ({ DAI, USDC, WETH, cDAI, cUSDC, cETH, daiDecimals, daiAmount, usdcAmount, ethAmount } = await initialize(
      impersonateAddress,
      impersonateAddressSigner,
    ));
  });

  after(async () => {
    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [impersonateAddress],
    });
  });

  describe("constructor", async () => {
    it("should set uniswapV3Factory", async () => {
      const getUniswapV3Factory: string = await cTokenSwap.uniswapV3Factory();
      expect(getUniswapV3Factory).to.equal(uniswapV3FactoryAddress);
    });

    it("should set weth", async () => {
      const getWeth: string = await cTokenSwap.weth();
      expect(getWeth).to.equal(wethAddress);
    });

    it("should set owner", async () => {
      const getOwner: string = await cTokenSwap.owner();
      expect(getOwner).to.equal(owner.address);
    });
  });

  describe("collateralSwap", async () => {
    it("swap cDAI to cUSDC", async () => {
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);
      const cUSDCBalanceImpersonate0: BigNumber = await cUSDC.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cDAI, daiAmount);
      await cDAI.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap.connect(impersonateAddressSigner).collateralSwap({
          token0Amount: daiAmount,
          cToken0Amount: cToken0Amount,
          token0: DAI.address,
          token1: USDC.address,
          cToken0: cDAI.address,
          cToken1: cUSDC.address,
          exchange: exchangeAddress,
          data: daiUSDCTrade,
        }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cDAI.address, cUSDC.address, daiAmount);

      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.lt(cDAIBalanceImpersonate0);
      const cUSDCBalanceImpersonate1: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      expect(cUSDCBalanceImpersonate1).to.be.gt(cUSDCBalanceImpersonate0);
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cUSDCBalanceCTokenSwap1: BigNumber = await cUSDC.balanceOf(cTokenSwap.address);
      expect(cUSDCBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cUSDC to cDAI", async () => {
      const cUSDCBalanceImpersonate0: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cUSDC, usdcAmount);
      await cUSDC.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap.connect(impersonateAddressSigner).collateralSwap({
          token0Amount: usdcAmount,
          cToken0Amount: cToken0Amount,
          token0: USDC.address,
          token1: DAI.address,
          cToken0: cUSDC.address,
          cToken1: cDAI.address,
          exchange: exchangeAddress,
          data: usdcDAITrade,
        }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cUSDC.address, cDAI.address, usdcAmount);

      const cUSDCBalanceImpersonate1: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      expect(cUSDCBalanceImpersonate1).to.be.lt(cUSDCBalanceImpersonate0);
      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.gt(cDAIBalanceImpersonate0);
      const cUSDCBalanceCTokenSwap1: BigNumber = await cUSDC.balanceOf(cTokenSwap.address);
      expect(cUSDCBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cETH to cDAI", async () => {
      const cETHBalanceImpersonate0: BigNumber = await cETH.balanceOf(impersonateAddress);
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cETH, ethAmount);
      await cETH.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap.connect(impersonateAddressSigner).collateralSwap({
          token0Amount: ethAmount,
          cToken0Amount: cToken0Amount,
          token0: ethers.constants.AddressZero,
          token1: DAI.address,
          cToken0: cETH.address,
          cToken1: cDAI.address,
          exchange: exchangeAddress,
          data: ethDAITrade,
        }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cETH.address, cDAI.address, ethAmount);

      const cETHBalanceImpersonate1: BigNumber = await cETH.balanceOf(impersonateAddress);
      expect(cETHBalanceImpersonate1).to.be.lt(cETHBalanceImpersonate0);
      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.gt(cDAIBalanceImpersonate0);
      const cETHBalanceCTokenSwap1: BigNumber = await cETH.balanceOf(cTokenSwap.address);
      expect(cETHBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cDAI to cETH", async () => {
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);
      const cETHBalanceImpersonate0: BigNumber = await cETH.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cDAI, daiAmount);
      await cDAI.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap.connect(impersonateAddressSigner).collateralSwap({
          token0Amount: daiAmount,
          cToken0Amount: cToken0Amount,
          token0: DAI.address,
          token1: ethers.constants.AddressZero,
          cToken0: cDAI.address,
          cToken1: cETH.address,
          exchange: exchangeAddress,
          data: daiETHTrade,
        }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cDAI.address, cETH.address, daiAmount);

      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.lt(cDAIBalanceImpersonate0);
      const cETHBalanceImpersonate1: BigNumber = await cETH.balanceOf(impersonateAddress);
      expect(cETHBalanceImpersonate1).to.be.gt(cETHBalanceImpersonate0);
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cETHBalanceCTokenSwap1: BigNumber = await cETH.balanceOf(cTokenSwap.address);
      expect(cETHBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });
  });

  describe("collateralSwapFlash", async () => {
    it("swap cDAI to cUSDC", async () => {
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);
      const cUSDCBalanceImpersonate0: BigNumber = await cUSDC.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cDAI, daiAmount);
      const { amount, amount0, amount1 }: Amounts = getAmounts(DAI.address, daiAmount, uniDAIWETHPoolKey);
      await cDAI.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap
          .connect(impersonateAddressSigner)
          .collateralSwapFlash(amount0, amount1, uniDAIWETHPool, uniDAIWETHPoolKey, {
            token0Amount: amount,
            cToken0Amount: cToken0Amount,
            token0: DAI.address,
            token1: USDC.address,
            cToken0: cDAI.address,
            cToken1: cUSDC.address,
            exchange: exchangeAddress,
            data: daiUSDCTradeFlash,
          }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cDAI.address, cUSDC.address, amount);

      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.lt(cDAIBalanceImpersonate0);
      const cUSDCBalanceImpersonate1: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      expect(cUSDCBalanceImpersonate1).to.be.gt(cUSDCBalanceImpersonate0);
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cUSDCBalanceCTokenSwap1: BigNumber = await cUSDC.balanceOf(cTokenSwap.address);
      expect(cUSDCBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cUSDC to cDAI", async () => {
      const cUSDCBalanceImpersonate0: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cUSDC, usdcAmount);
      const { amount, amount0, amount1 }: Amounts = getAmounts(USDC.address, usdcAmount, uniUSDCWETHPoolKey);
      await cUSDC.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap
          .connect(impersonateAddressSigner)
          .collateralSwapFlash(amount0, amount1, uniUSDCWETHPool, uniUSDCWETHPoolKey, {
            token0Amount: amount,
            cToken0Amount: cToken0Amount,
            token0: USDC.address,
            token1: DAI.address,
            cToken0: cUSDC.address,
            cToken1: cDAI.address,
            exchange: exchangeAddress,
            data: usdcDAITradeFlash,
          }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cUSDC.address, cDAI.address, amount);

      const cUSDCBalanceImpersonate1: BigNumber = await cUSDC.balanceOf(impersonateAddress);
      expect(cUSDCBalanceImpersonate1).to.be.lt(cUSDCBalanceImpersonate0);
      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.gt(cDAIBalanceImpersonate0);
      const cUSDCBalanceCTokenSwap1: BigNumber = await cUSDC.balanceOf(cTokenSwap.address);
      expect(cUSDCBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cETH to cDAI", async () => {
      const cETHBalanceImpersonate0: BigNumber = await cETH.balanceOf(impersonateAddress);
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cETH, ethAmount);
      const { amount, amount0, amount1 }: Amounts = getAmounts(WETH.address, ethAmount, uniDAIWETHPoolKey);
      await cETH.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap
          .connect(impersonateAddressSigner)
          .collateralSwapFlash(amount0, amount1, uniDAIWETHPool, uniDAIWETHPoolKey, {
            token0Amount: amount,
            cToken0Amount: cToken0Amount,
            token0: WETH.address,
            token1: DAI.address,
            cToken0: cETH.address,
            cToken1: cDAI.address,
            exchange: exchangeAddress,
            data: wethDAITradeFlash,
          }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cETH.address, cDAI.address, amount);

      const cETHBalanceImpersonate1: BigNumber = await cETH.balanceOf(impersonateAddress);
      expect(cETHBalanceImpersonate1).to.be.lt(cETHBalanceImpersonate0);
      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.gt(cDAIBalanceImpersonate0);
      const cETHBalanceCTokenSwap1: BigNumber = await cETH.balanceOf(cTokenSwap.address);
      expect(cETHBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });

    it("swap cDAI to cETH", async () => {
      const cDAIBalanceImpersonate0: BigNumber = await cDAI.balanceOf(impersonateAddress);
      const cETHBalanceImpersonate0: BigNumber = await cETH.balanceOf(impersonateAddress);

      const cToken0Amount: BigNumber = await getCTokenAmount(cDAI, daiAmount);
      const { amount, amount0, amount1 }: Amounts = getAmounts(DAI.address, daiAmount, uniDAIWETHPoolKey);
      await cDAI.connect(impersonateAddressSigner).approve(cTokenSwap.address, cToken0Amount);
      await expect(
        cTokenSwap
          .connect(impersonateAddressSigner)
          .collateralSwapFlash(amount0, amount1, uniDAIWETHPool, uniDAIWETHPoolKey, {
            token0Amount: amount,
            cToken0Amount: cToken0Amount,
            token0: DAI.address,
            token1: ethers.constants.AddressZero,
            cToken0: cDAI.address,
            cToken1: cETH.address,
            exchange: exchangeAddress,
            data: daiWETHTradeFlash,
          }),
      )
        .to.emit(cTokenSwap, "CollateralSwap")
        .withArgs(impersonateAddress, cDAI.address, cETH.address, amount);

      const cDAIBalanceImpersonate1: BigNumber = await cDAI.balanceOf(impersonateAddress);
      expect(cDAIBalanceImpersonate1).to.be.lt(cDAIBalanceImpersonate0);
      const cETHBalanceImpersonate1: BigNumber = await cETH.balanceOf(impersonateAddress);
      expect(cETHBalanceImpersonate1).to.be.gt(cETHBalanceImpersonate0);
      const cDAIBalanceCTokenSwap1: BigNumber = await cDAI.balanceOf(cTokenSwap.address);
      expect(cDAIBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const cETHBalanceCTokenSwap1: BigNumber = await cETH.balanceOf(cTokenSwap.address);
      expect(cETHBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
    });
  });

  describe("uniswapV3FlashCallback", async () => {
    it("should revert if not uniswap pair", async () => {
      await expect(
        cTokenSwap
          .connect(impersonateAddressSigner)
          .uniswapV3FlashCallback(BigNumber.from("0"), BigNumber.from("0"), flashCallbackTestData),
      ).to.be.revertedWith("Transaction reverted without a reason string");
    });
  });

  describe("transferToken", async () => {
    it("should revert if not owner", async () => {
      await expect(
        cTokenSwap.connect(impersonateAddressSigner).transferToken(ethers.constants.AddressZero),
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should transfer token", async () => {
      const daiTransferAmount: BigNumber = ethers.utils.parseUnits("100", daiDecimals);
      await DAI.connect(impersonateAddressSigner).transfer(cTokenSwap.address, daiTransferAmount);

      const daiBalanceCTokenSwap0: BigNumber = await DAI.balanceOf(cTokenSwap.address);
      expect(daiBalanceCTokenSwap0).to.equal(daiTransferAmount);
      const daiBalanceOwner0: BigNumber = await DAI.balanceOf(owner.address);

      await cTokenSwap.connect(owner).transferToken(DAI.address);

      const daiBalanceCTokenSwap1: BigNumber = await DAI.balanceOf(cTokenSwap.address);
      expect(daiBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const daiBalanceOwner1: BigNumber = await DAI.balanceOf(owner.address);
      expect(daiBalanceOwner1).to.equal(daiBalanceOwner0.add(daiTransferAmount));
    });

    it("should transfer ether", async () => {
      const ethTransferAmount: BigNumber = ethers.utils.parseEther("1");
      await impersonateAddressSigner.sendTransaction({ value: ethTransferAmount, to: cTokenSwap.address });

      const ethBalanceCTokenSwap0: BigNumber = await ethers.provider.getBalance(cTokenSwap.address);
      expect(ethBalanceCTokenSwap0).to.equal(ethTransferAmount);
      const ethBalanceOwner0: BigNumber = await ethers.provider.getBalance(owner.address);

      await cTokenSwap.connect(owner).transferToken(ethers.constants.AddressZero);

      const ethBalanceCTokenSwap1: BigNumber = await ethers.provider.getBalance(cTokenSwap.address);
      expect(ethBalanceCTokenSwap1).to.equal(BigNumber.from("0"));
      const ethBalanceOwner1: BigNumber = await ethers.provider.getBalance(owner.address);
      expect(ethBalanceOwner1).to.be.gt(ethBalanceOwner0);
    });
  });
});
