import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
} from "@chakra-ui/react";
import { State } from "../../hooks/useCompound";
import { calculateApy, formatAmount } from "../../utils";

function Balances({
  compoundState,
  balancesLoaded,
}: {
  compoundState: State;
  balancesLoaded: boolean;
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
                    <Switch isReadOnly />
                  </Td>
                  <Td isNumeric>{balancesLoaded ? "0" : "..."}</Td>
                  <Td isNumeric>
                    {`${formatAmount(
                      calculateApy(compoundState.supplyRatePerBlock[index]),
                      2
                    )}%`}
                  </Td>
                  <Td isNumeric>{balancesLoaded ? "0" : "..."}</Td>
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
