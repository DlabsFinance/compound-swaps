import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { State } from "../../hooks/useCompound";

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
              <Th isNumeric>Supply Balance</Th>
              <Th isNumeric>Borrow Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {compoundState.allMarkets.map(
              (allMarkets: string, index: number) => (
                <Tr key={allMarkets}>
                  <Td>{compoundState.symbol[index]}</Td>
                  <Td isNumeric>{balancesLoaded ? "0" : "..."}</Td>
                  <Td isNumeric>{balancesLoaded ? "0" : "..."}</Td>
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
