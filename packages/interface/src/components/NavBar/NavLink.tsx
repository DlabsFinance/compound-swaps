import { Link, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";

const linkParams: {
  px: number;
  py: number;
  rounded: string;
} = {
  px: 2,
  py: 1,
  rounded: "md",
};

function NavLink({
  url,
  link,
  external,
  isRoute,
  isCurrent,
}: {
  url: string;
  link: string;
  external: boolean;
  isRoute: boolean;
  isCurrent: boolean;
}): JSX.Element {
  return isRoute ? (
    <NextLink href={url} passHref>
      <Link
        px={linkParams.px}
        py={linkParams.py}
        border={isCurrent ? "1px" : undefined}
        borderColor={isCurrent ? "green.500" : undefined}
        rounded={linkParams.rounded}
        _hover={{
          color: "black",
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {link}
      </Link>
    </NextLink>
  ) : (
    <Link
      px={linkParams.px}
      py={linkParams.py}
      rounded={linkParams.rounded}
      _hover={{
        color: "black",
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={url}
      isExternal={external}
    >
      {link}
    </Link>
  );
}

export default NavLink;
