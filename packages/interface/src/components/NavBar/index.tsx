import { useCallback } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Image from "next/image";
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Collapse,
  Link,
  useDisclosure,
  HStack,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { NavItem } from "./NavItemChildren";
import Search from "./Search";

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Swap",
    href: "/",
  },
  {
    label: "Swap & Repay",
    href: "/repay",
  },
  {
    label: "Docs ↗",
    href: "https://github.com/gg2001/compound-swaps",
  },
  {
    label: "Compound ↗",
    href: "https://app.compound.finance/",
  },
];

function NavBar(): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();

  const pathname: string = router.pathname;

  const isCurrent: (url: string) => boolean = useCallback(
    (url: string) =>
      url === "/" ? url === pathname : pathname.startsWith(url),
    [pathname]
  );

  return (
    <Box>
      <Flex
        color={"gray.600"}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"gray.200"}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
        >
          <NextLink href="/">
            <Link>
              <HStack spacing={4} alignItems={"center"}>
                <Image
                  src="/logo.svg"
                  alt="Compound Logo"
                  width={48}
                  height={48}
                />
                <Box>
                  <Text as="b" fontSize={{ base: "14px", lg: "16px" }}>
                    Fuse Margin Trading
                  </Text>
                </Box>
              </HStack>
            </Link>
          </NextLink>
          <Flex display={{ base: "none", md: "flex" }} ml={5} pt={2.5}>
            <DesktopNav navItems={NAV_ITEMS} isCurrent={isCurrent} />
          </Flex>
        </Flex>
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Search display={{ md: "flex" }} />
        </Stack>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={NAV_ITEMS} isCurrent={isCurrent} />
      </Collapse>
    </Box>
  );
}

export default NavBar;
