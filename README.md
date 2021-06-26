- Swap
  - exactInput with fromToken to toToken
- Exact Output
  - Single
    1. Flash swap toToken
    2. Payback flash swap with fromToken
  - Double
    1. Flash swap toToken
    2. Swap fromToken with exactOutputSingle to payback flash swap
  - Multiple
    1. Flash swap toToken
    2. Swap fromToken with exactOutput to payback flash swap
