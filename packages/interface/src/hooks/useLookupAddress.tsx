import { useEffect, useState } from "react";
import { ethers } from "ethers";
import useWeb3React, { Web3ReactData } from "./useWeb3React";
import { getDefaultProvider } from "../utils";

function useLookupAddress(address: string): {
  name: string;
} {
  const { provider, chainId }: Web3ReactData = useWeb3React();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (provider !== undefined) {
        const currentProvider: ethers.providers.Provider =
          chainId === 1 ? provider : getDefaultProvider();
        const getName: string = await currentProvider.lookupAddress(address);
        if (getName) {
          setName(getName);
        } else {
          setName("");
        }
      }
    };
    fetchData();
  }, [address, provider]);

  return { name };
}

export default useLookupAddress;
