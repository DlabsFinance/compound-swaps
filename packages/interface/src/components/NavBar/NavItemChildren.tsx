import NextLink from "next/link";
import { Box, Flex, Text, Stack, Icon, Link } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { isLinkExternal } from "../../utils";

export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

export function DesktopNavItemChildren({
  label,
  href,
  subLabel,
  isItemCurrent,
}: NavItem & { isItemCurrent: boolean }): JSX.Element {
  const isExternal: boolean = isLinkExternal(href);

  return (
    <NextLink href={href ?? "#"} passHref>
      <Link
        role={"group"}
        display={"block"}
        p={2}
        rounded={"md"}
        _hover={{ bg: "purple.50" }}
        isExternal={isExternal}
        border={isItemCurrent ? "1px" : undefined}
        borderColor={isItemCurrent ? "purple.200" : undefined}
      >
        <Stack direction={"row"} align={"center"}>
          <Box>
            <Text
              transition={"all .3s ease"}
              _groupHover={{ color: "purple.500" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={"sm"}>{subLabel}</Text>
          </Box>
          <Flex
            transition={"all .3s ease"}
            transform={"translateX(-10px)"}
            opacity={0}
            _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
            justify={"flex-end"}
            align={"center"}
            flex={1}
          >
            <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    </NextLink>
  );
}

export function MobileNavItemChildren({
  label,
  href,
  isItemCurrent,
}: NavItem & { isItemCurrent: boolean }): JSX.Element {
  const isExternal: boolean = isLinkExternal(href);

  return (
    <NextLink key={label} href={href ?? "#"} passHref>
      <Flex
        py={2}
        as={Link}
        border={isItemCurrent ? "1px" : undefined}
        borderColor={isItemCurrent ? "black" : undefined}
        rounded={"md"}
        padding={1}
        isExternal={isExternal}
        w={"100%"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        {label}
      </Flex>
    </NextLink>
  );
}
