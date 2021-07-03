import { createContext, useContext, Context, ReactNode } from "react";
import useCompoundState, { initialState, State } from "./useCompoundState";

const CompoundContext: Context<State> = createContext<State>(initialState);

function useCompound(): State {
  return useContext(CompoundContext);
}

export function CompoundProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const compoundState = useCompoundState();
  return (
    <CompoundContext.Provider value={compoundState}>
      {children}
    </CompoundContext.Provider>
  );
}

export type { State };
export default useCompound;
