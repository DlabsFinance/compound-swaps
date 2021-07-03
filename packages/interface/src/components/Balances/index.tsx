import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import CollateralSwitch from "./CollateralSwitch";
import { State as CompoundState } from "../../hooks/useCompound";
import { State as BalancesState } from "../../hooks/useBalances";
import { calculateApy, formatAmount } from "../../utils";

function Balances({
  compoundState,
  balancesState,
}: {
  compoundState: CompoundState;
  balancesState: BalancesState;
}): JSX.Element {
  return (
    <Flex justify="center" items="center">
      <Box overflowY="auto" margin={1}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Token</Th>
              <Th>Collateral</Th>
              <Th isNumeric>Supply Balance</Th>
              <Th isNumeric>Supply APY</Th>
              <Th isNumeric>Borrow Balance</Th>
              <Th isNumeric>Borrow APY</Th>
            </Tr>
          </Thead>
          <Tbody>
            {compoundState.allMarkets.map(
              (allMarkets: string, index: number) => (
                <Tr key={allMarkets}>
                  <Td>{compoundState.symbol[index]}</Td>
                  <Td>
                    <CollateralSwitch
                      market={allMarkets}
                      balancesLoaded={balancesState.loaded}
                      assetIn={
                        balancesState.assetsIn[index] !== undefined
                          ? balancesState.assetsIn[index]
                          : false
                      }
                    />
                  </Td>
                  <Td isNumeric>{balancesState.loaded ? "0" : "..."}</Td>
                  <Td isNumeric>
                    {`${formatAmount(
                      calculateApy(compoundState.supplyRatePerBlock[index]),
                      2
                    )}%`}
                  </Td>
                  <Td isNumeric>{balancesState.loaded ? "0" : "..."}</Td>
                  <Td isNumeric>
                    {`${formatAmount(
                      calculateApy(compoundState.borrowRatePerBlock[index]),
                      2
                    )}%`}
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
}

export default Balances;
