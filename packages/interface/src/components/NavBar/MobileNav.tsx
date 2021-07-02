import { Stack } from "@chakra-ui/react";
import MobileNavItem from "./MobileNavItem";
import { NavItem } from "./NavItemChildren";

function MobileNav({
  navItems,
  isCurrent,
}: {
  navItems: Array<NavItem>;
  isCurrent: (url: string) => boolean;
}): JSX.Element {
  return (
    <Stack bg={"white"} p={4} display={{ md: "none" }}>
      {navItems.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          isCurrent={isCurrent}
          isItemCurrent={navItem.href ? isCurrent(navItem.href) : false}
          {...navItem}
        />
      ))}
    </Stack>
  );
}

export default MobileNav;
