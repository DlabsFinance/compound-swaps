import {
  Box,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
  Button,
  Select,
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";

function Swap(): JSX.Element {
  return (
    <Box>
      <Center marginBottom={1}>
        <Badge colorScheme="gray" marginRight={1}>
          Balance:{" "}
        </Badge>
        <Badge colorScheme="gray" marginLeft={1}>
          APY:{" "}
        </Badge>
      </Center>
      <Center marginBottom={1}>
        <Box minW={{ base: 300, sm: 400 }} display={"flex"}>
          <Select maxW={100} marginRight={1}></Select>
          <InputGroup>
            <Input type="number" />
            <InputRightElement width="4rem">
              <Button h="1.75rem" size="sm">
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
      </Center>
      <Center marginTop={1} marginBottom={1}>
        <IconButton aria-label="Flip" rounded="md" icon={<ArrowDownIcon />} />
      </Center>
      <Center marginBottom={1} marginTop={1}>
        <Badge colorScheme="gray" marginRight={1}>
          Balance:{" "}
        </Badge>
        <Badge colorScheme="gray" marginLeft={1}>
          APY:{" "}
        </Badge>
      </Center>
      <Center>
        <Box minW={{ base: 300, sm: 400 }} display={"flex"}>
          <Select maxW={100} marginRight={1}></Select>
          <InputGroup>
            <Input type="number" />
          </InputGroup>
        </Box>
      </Center>
      <Center marginTop={1}>
        <Button marginRight={1}>Approve</Button>
        <Button marginLeft={1}>Swap</Button>
      </Center>
    </Box>
  );
}

export default Swap;
