import { Stack } from "@chakra-ui/react";
import DesktopNavItem from "./DesktopNavItem";
import { NavItem } from "./NavItemChildren";

function DesktopNav({
  navItems,
  isCurrent,
}: {
  navItems: Array<NavItem>;
  isCurrent: (url: string) => boolean;
}): JSX.Element {
  return (
    <Stack direction={"row"} spacing={4}>
      {navItems.map((navItem: NavItem) => (
        <DesktopNavItem
          key={navItem.label}
          label={navItem.label}
          href={navItem.href}
          children={navItem.children}
          isItemCurrent={navItem.href ? isCurrent(navItem.href) : false}
          isCurrent={isCurrent}
        />
      ))}
    </Stack>
  );
}

export default DesktopNav;
