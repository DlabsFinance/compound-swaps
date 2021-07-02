import NextLink from "next/link";
import {
  Box,
  Stack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { DesktopNavItemChildren } from "./NavItemChildren";
import { NavItem } from "./NavItemChildren";
import { isLinkExternal } from "../../utils";

function DesktopNavItem({
  label,
  href,
  children,
  isCurrent,
  isItemCurrent,
}: NavItem & {
  isCurrent: (url: string) => boolean;
  isItemCurrent: boolean;
}): JSX.Element {
  const isExternal: boolean = isLinkExternal(href);

  return (
    <Box>
      <Popover trigger={"hover"} placement={"bottom-start"}>
        <PopoverTrigger>
          <Box>
            {href ? (
              <NextLink href={href} passHref>
                <Link
                  px={1}
                  py={1}
                  pt={2}
                  pb={2}
                  fontSize={"md"}
                  fontWeight={500}
                  color={"black"}
                  rounded={"md"}
                  isExternal={isExternal}
                  border={isItemCurrent ? "1px" : undefined}
                  borderColor={isItemCurrent ? "black" : undefined}
                  _hover={{
                    textDecoration: "none",
                    bg: "gray.200",
                  }}
                >
                  {label}
                </Link>
              </NextLink>
            ) : (
              <Link
                px={2}
                py={1}
                pt={2}
                pb={2}
                fontSize={"md"}
                fontWeight={500}
                color={"black"}
                rounded={"md"}
                _hover={{
                  textDecoration: "none",
                  bg: "gray.200",
                }}
              >
                {label}
              </Link>
            )}
          </Box>
        </PopoverTrigger>
        {children && (
          <PopoverContent
            border={0}
            boxShadow={"xl"}
            bg={"white"}
            p={4}
            rounded={"xl"}
            minW={"sm"}
          >
            <Stack>
              {children.map((child) => (
                <DesktopNavItemChildren
                  key={child.label}
                  isItemCurrent={child.href ? isCurrent(child.href) : false}
                  {...child}
                />
              ))}
            </Stack>
          </PopoverContent>
        )}
      </Popover>
    </Box>
  );
}

export default DesktopNavItem;
