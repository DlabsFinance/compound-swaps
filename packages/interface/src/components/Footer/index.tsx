import { Container, Stack, Text, Box, Link } from "@chakra-ui/react";

function Footer(): JSX.Element {
  return (
    <Container
      as={Stack}
      maxW={"6xl"}
      py={4}
      direction={{ base: "row" }}
      spacing={4}
      justify={{ base: "center", md: "space-between" }}
      align={{ base: "center", md: "center" }}
    >
      <Box></Box>
      <Box>
        <Link href="https://twitter.com/Shakestats" isExternal>
          <Text as="u">Twitter</Text>
        </Link>{" "}
        •{" "}
        <Link href="https://discord.com/invite/b9XryHrqAh" isExternal>
          <Text as="u">Discord</Text>
        </Link>{" "}
        •{" "}
        <Link href="mailto:handshakestats@gmail.com">
          <Text as="u">Email</Text>
        </Link>
      </Box>
    </Container>
  );
}

export default Footer;
