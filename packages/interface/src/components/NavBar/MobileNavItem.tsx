import NextLink from "next/link";
import {
  Flex,
  Text,
  Stack,
  Collapse,
  Icon,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { NavItem, MobileNavItemChildren } from "./NavItemChildren";
import { isLinkExternal } from "../../utils";

function MobileNavItem({
  label,
  children,
  href,
  isCurrent,
  isItemCurrent,
}: NavItem & {
  isCurrent: (url: string) => boolean;
  isItemCurrent: boolean;
}): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();

  const isExternal: boolean = isLinkExternal(href);

  return (
    <Stack spacing={1} onClick={children && onToggle}>
      {href ? (
        <NextLink href={href} passHref>
          <Flex
            py={2}
            as={Link}
            border={isItemCurrent ? "1px" : undefined}
            borderColor={isItemCurrent ? "black" : undefined}
            rounded={"md"}
            padding={1}
            isExternal={isExternal}
            justify={"space-between"}
            align={"center"}
            _hover={{
              textDecoration: "none",
            }}
          >
            <Text fontWeight={600} color={"gray.600"}>
              {label}
            </Text>
            {children && (
              <Icon
                as={ChevronDownIcon}
                transition={"all .25s ease-in-out"}
                transform={isOpen ? "rotate(180deg)" : ""}
                w={6}
                h={6}
              />
            )}
          </Flex>
        </NextLink>
      ) : (
        <Flex
          py={2}
          as={Link}
          padding={1}
          isExternal={isExternal}
          justify={"space-between"}
          align={"center"}
          _hover={{
            textDecoration: "none",
          }}
        >
          <Text fontWeight={600} color={"gray.600"}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={"all .25s ease-in-out"}
              transform={isOpen ? "rotate(180deg)" : ""}
              w={6}
              h={6}
            />
          )}
        </Flex>
      )}
      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={"gray.200"}
          align={"start"}
        >
          {children &&
            children.map((child: NavItem) => (
              <MobileNavItemChildren
                key={child.href}
                label={child.label}
                href={child.href}
                isItemCurrent={child.href ? isCurrent(child.href) : false}
              />
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default MobileNavItem;
