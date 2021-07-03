import { Switch } from "@chakra-ui/react";
import { Signer } from "ethers";
import useWeb3React from "../../hooks/useWeb3React";
import { Comptroller__factory, Comptroller } from "../../types";
import { addresses } from "../../constants";

function CollateralSwitch({
  balancesLoaded,
  assetIn,
  market,
}: {
  balancesLoaded: boolean;
  assetIn: boolean;
  market: string;
}): JSX.Element {
  const { provider, chainId } = useWeb3React();

  const onChange = async () => {
    if (balancesLoaded && provider !== undefined) {
      const signer: Signer = await provider.getSigner();
      const comptroller: Comptroller = Comptroller__factory.connect(
        addresses[chainId].comptroller,
        signer
      );
      if (assetIn) {
        await comptroller.exitMarket(market);
      } else {
        await comptroller.enterMarkets([market]);
      }
    }
  };

  return (
    <Switch
      isReadOnly={!balancesLoaded}
      isChecked={assetIn}
      onChange={onChange}
    />
  );
}

export default CollateralSwitch;
