import { useState } from "react";
import { useRouter } from "next/router";
import {
  Input,
  InputGroup,
  InputRightElement,
  LayoutProps,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function Search({
  display,
}: {
  display?: LayoutProps["display"];
}): JSX.Element {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

  const searchRedirect = (key: string) => {
    if (key === "Enter") {
      const searchQuery: string = search.toLowerCase();
      router.push(`/search?search=${searchQuery}`);
    }
  };

  return (
    <InputGroup display={display}>
      <InputRightElement
        pointerEvents="none"
        /* eslint-disable react/no-children-prop */
        children={<SearchIcon color={"purple"} />}
      />
      <Input
        minWidth={160}
        color={"black"}
        bg={"gray.100"}
        placeholder="Search name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => searchRedirect(event.key)}
      />
    </InputGroup>
  );
}

export default Search;
