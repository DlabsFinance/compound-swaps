import { useEffect } from "react";
import Head from "next/head";
import { siteURL } from "../constants";
import { Header, ExternalLink } from "../components/Header";
import Layout from "../components/layout";
import useWeb3React from "../hooks/useWeb3React";
import { getCompoundAllMarkets, getCompoundMarkets } from "../utils";

const pageTitle: string = "Compound Swaps - Swap your Compound collateral";
const pageDescription: string =
  "Compound Swaps - Collateral swaps and swap & repay debt with collateral on Compound";
const pageURL: string = siteURL;

function Home(): JSX.Element {
  const { provider, chainId } = useWeb3React();

  useEffect(() => {
    const fetchData = async () => {
      if (provider) {
        const allMarkets: string[] = await getCompoundAllMarkets(
          provider,
          chainId
        );
        console.log(allMarkets);
        const { markets, underlying } = await getCompoundMarkets(
          provider,
          chainId,
          allMarkets
        );
        console.log(markets);
        console.log(underlying);
      }
    };
    fetchData();
  }, [provider, chainId]);

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
      <Header props={{ marginTop: 2 }}>
        Swap your{" "}
        <ExternalLink href={"https://compound.finance/"} text={"Compound"} />{" "}
        collateral
      </Header>
    </Layout>
  );
}

export default Home;
