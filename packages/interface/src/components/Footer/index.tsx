import { Container, Stack, Text, Box, Link } from "@chakra-ui/react";

function Footer(): JSX.Element {
  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      py={4}
      direction={{ base: "column", md: "row" }}
      spacing={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      <Box></Box>
      <Box>
        <Link href="https://github.com/gg2001/compound-swaps" isExternal>
          <Text as="u">GitHub</Text>
        </Link>{" "}
        •{" "}
        <Link
          href="https://etherscan.io/address/0xdC3d8ba3CBDa63953DE5456ae0a1a13E5cC796E8"
          isExternal
        >
          <Text as="u">Etherscan</Text>
        </Link>{" "}
        • By{" "}
        <Link href="https://twitter.com/GauthamGE" isExternal>
          <Text as="u">@GauthamGE</Text>
        </Link>
      </Box>
    </Container>
  );
}

export default Footer;
