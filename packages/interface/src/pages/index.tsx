import Head from "next/head";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { siteURL } from "../constants";
import { Header, ExternalLink } from "../components/Header";
import Layout from "../components/layout";
import Balances from "../components/Balances";
import useCompound from "../hooks/useCompound";

const pageTitle: string = "Compound Swaps - Swap your Compound collateral";
const pageDescription: string =
  "Compound Swaps - Collateral swaps and swap & repay debt with collateral on Compound";
const pageURL: string = siteURL;

function Home(): JSX.Element {
  const compoundState = useCompound();

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:url" content={pageURL} />
        <meta property="og:description" content={pageDescription} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:url" content={pageURL} />
        <meta name="twitter:description" content={pageDescription} />
      </Head>
      <Box p={2}>
        <Header>
          Swap your{" "}
          <ExternalLink href={"https://compound.finance/"} text={"Compound"} />{" "}
          collateral
        </Header>
        {compoundState.loaded ? (
          <Balances compoundState={compoundState} balancesLoaded={true} />
        ) : (
          <Center marginTop={2}>
            <Spinner size={"lg"} />
          </Center>
        )}
      </Box>
    </Layout>
  );
}

export default Home;
