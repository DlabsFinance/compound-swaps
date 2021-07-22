# Compound Swaps
https://www.youtube.com/watch?v=339tBmIPgAo

Description
This project allows you to swap your collateral on Compound, without having to migrate to a smart wallet.

Smart wallets like Instadapp and DefiSaver already allow you to do collateral swaps, however they require you to migrate your Compound position into their smart wallet to access those features.

This project uses flash loans to allow you to do collateral swaps without having to migrate your position. This makes it easier and faster to swap collateral.

Compound Swaps showcase

How it's made
This project uses Solidity for the contracts to perform the swaps, and Hardhat/TypeScript for the dev environment to write the contracts. Next.js/TypeScript is used for the frontend, along with Ethers.js.

The contract interacts with Uniswap V3 for flash loan liquidity, and Compound for supplying/withdrawing the CTokens. The contract can interact with any DEX, in the frontend I'm using the 1inch API to fetch the swap calldata. The 0x API can be used as well.




Swapping your compound collateral

CTokenSwap contract address: https://etherscan.io/address/0x6B33DF549823f6e9dE7b86485BC1567A97F57f8d
