import { useEffect, useRef, useReducer } from "react";
import { ethers, BigNumber } from "ethers";
import { State as CompoundState } from "./useCompoundState";
import { getBalances } from "../utils";

export interface State {
  loaded: boolean;
  error: boolean;
  assetsIn: boolean[];
  balanceOfUnderlying: BigNumber[];
  borrowBalanceCurrent: BigNumber[];
  balanceOf: BigNumber[];
  cTokenSwapAllowance: BigNumber[];
}

enum ActionType {
  FETCHED_PROVIDER,
  SET_ERROR,
}

type Action =
  | {
      type: ActionType.FETCHED_PROVIDER;
      payload: Omit<State, "loaded" | "error">;
    }
  | {
      type: ActionType.SET_ERROR;
    };

export const initialState: State = {
  loaded: false,
  error: false,
  assetsIn: [],
  balanceOfUnderlying: [],
  borrowBalanceCurrent: [],
  balanceOf: [],
  cTokenSwapAllowance: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.FETCHED_PROVIDER: {
      const {
        assetsIn,
        balanceOfUnderlying,
        borrowBalanceCurrent,
        balanceOf,
        cTokenSwapAllowance,
      } = action.payload;
      return {
        ...state,
        loaded: true,
        error: false,
        assetsIn,
        balanceOfUnderlying,
        borrowBalanceCurrent,
        balanceOf,
        cTokenSwapAllowance,
      };
    }
    case ActionType.SET_ERROR: {
      if (state.loaded) {
        return { ...state };
      } else {
        return {
          ...state,
          error: true,
        };
      }
    }
    default:
      throw new Error();
  }
}

function useBalancesState(
  provider: ethers.providers.Web3Provider | undefined,
  chainId: number,
  address: string,
  compoundState: CompoundState
): State {
  const [state, dispatch] = useReducer<(state: State, action: Action) => State>(
    reducer,
    initialState
  );
  const mountedRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      mountedRef.current = true;
      try {
        if (
          provider &&
          address !== ethers.constants.AddressZero &&
          compoundState.loaded
        ) {
          const fetchBalances = await getBalances(
            provider,
            chainId,
            address,
            compoundState.allMarkets
          );
          if (mountedRef.current) {
            dispatch({
              type: ActionType.FETCHED_PROVIDER,
              payload: fetchBalances,
            });
          }
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: ActionType.SET_ERROR,
        });
      }
    };
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [provider, chainId, address, compoundState]);

  return state;
}

export default useBalancesState;
