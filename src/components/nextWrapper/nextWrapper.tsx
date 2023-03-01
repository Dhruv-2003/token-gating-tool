import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createClient,
  useAccount,
  useNetwork,
  useSwitchNetwork,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import { configDataType, configType } from "../../../types/types";

const API_KEY: any = process.env.ALCHEMY_ID;

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ apiKey: API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Token-Gating",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export interface TokenGatingWrapperProps {
  config: configType;
  alchemyApiKey: string;
  children: ReactNode;
}
// for next Only
export const TokenGatingWrapper = ({
  config,
  alchemyApiKey,
  children,
}: TokenGatingWrapperProps) => {
  const router = useRouter();
  const { address } = useAccount();
  const [authorised, setAuthorised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restricted, setRestricted] = useState(true);
  const [showConnectModel, setShowConnectModel] = useState(false);
  const { chain, chains } = useNetwork();

  const getNetwork = (chainName: string) => {
    // console.log(chainName);
    if (!chainName) {
      return;
    }
    const currentChainName = chain?.name;
    // console.log(currentChainName);
    // console.log(chains);
    if (currentChainName != chainName) {
      const chainId = chains?.find((v) => {
        if (v.name == chainName) {
          return v;
        }
      })?.id;
      // console.log(chainId);
      setLoading(false);
      setShowConnectModel(true);
      console.log("WRONG NETWORK DETECETED");
      // show the connect model and ask to change the network
      return;
    }
    if (currentChainName == "Ethereum") {
      return Network.ETH_MAINNET;
    } else if (currentChainName == "Optimism") {
      return Network.OPT_MAINNET;
    } else if (currentChainName == "Polygon") {
      return Network.MATIC_MAINNET;
    } else if (currentChainName == "Arbitrum One") {
      return Network.ARB_MAINNET;
    } else {
      return Network.ETH_MAINNET;
    }
  };

  // Cases
  // 1. Owns a particular NFT Collection
  const checkNFTCollection = async (
    userAddress: string,
    contractAddress: string,
    network: Network,
    alchemyApiKey: string
  ) => {
    try {
      const settings = {
        apiKey: alchemyApiKey, // Replace with your Alchemy API Key.
        network: network, // Replace with your network.
      };

      const alchemy = new Alchemy(settings);

      console.log("Checking for the NFT collection");
      const response = await alchemy.nft.verifyNftOwnership(
        userAddress,
        contractAddress
      );
      // console.log(response);
      setAuthorised(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // 2. Owns a particular NFT with a tokenId
  const checkNFTTokenId = async (
    userAddress: string,
    contractAddress: string,
    tokenId: string,
    network: Network,
    alchemyApiKey: string
  ) => {
    try {
      const settings = {
        apiKey: alchemyApiKey, // Replace with your Alchemy API Key.
        network: network, // Replace with your network.
      };

      const alchemy = new Alchemy(settings);

      console.log("checking for the Nft token ID");
      const response = await alchemy.nft.getOwnersForNft(
        contractAddress,
        tokenId
      );
      // console.log(response);

      if (response.owners[0].toLowerCase() == userAddress.toLowerCase()) {
        setAuthorised(true);
        return true;
      } else {
        setAuthorised(false);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 3. Owns a particular Tokens
  // Amount maybe 0  or a setAmount
  const checkToken = async (
    userAddress: string,
    tokenAddress: string,
    amount: number,
    network: Network,
    alchemyApiKey: string
  ) => {
    try {
      const settings = {
        apiKey: alchemyApiKey, // Replace with your Alchemy API Key.
        network: network, // Replace with your network.
      };

      const alchemy = new Alchemy(settings);

      console.log("Checking for the tokens");

      const response = await alchemy.core.getTokenBalances(userAddress, [
        tokenAddress,
      ]);
      // console.log(response);
      if (!response?.tokenBalances[0]?.tokenBalance) return;
      const balance: any = parseInt(response?.tokenBalances[0]?.tokenBalance);
      // console.log(balance);
      if (balance > amount) {
        setAuthorised(true);
        return true;
      } else {
        setAuthorised(false);
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check the URL and accordingly the condition
  // Open up a ConnectWallet section in case there is no address
  // Show a Loading icon when the details are loading
  // In the end , if the user is restricted , then Show the User a message
  const authCheck = async () => {
    setLoading(true);
    if (!address) {
      console.log("LOGIN FIRST");
      setLoading(false);
      setShowConnectModel(true);
      return;
    } else {
      setShowConnectModel(false);
    }

    let response: Boolean | undefined;
    let configData: configDataType | undefined;
    // check path , check if there is any config , then call according to the method
    const path = router.pathname.split("?")[0];
    console.log(path);

    if (
      config.some((v, i, arr) => {
        if (v.path == path) {
          return true;
        } else {
          return false;
        }
      })
    ) {
      console.log("PROTECTED ROUTE");

      configData = config.find((v, i, arr) => {
        if (v.path == path) {
          return v;
        }
      });

      if (!configData) {
        console.log("NO CONFIG DATA FOUND");
        return;
      }

      const finalNetwork = getNetwork(configData.network);
      if (!finalNetwork) return;

      // console.log(configData);

      // // checking the conditions of the method Applied and
      if (configData.methodName == "NFTWithTokenID") {
        if (!configData.data.tokenId) {
          console.log("INCORRECT INPUT DATA");
          return;
        }
        response = await checkNFTTokenId(
          address,
          configData.data.contractAddress,
          configData.data.tokenId,
          finalNetwork,
          alchemyApiKey
        );
      } else if (configData.methodName == "NFTCollection") {
        response = await checkNFTCollection(
          address,
          configData.data.contractAddress,
          finalNetwork,
          alchemyApiKey
        );
      } else if (configData.methodName == "TOKEN") {
        response = await checkToken(
          address,
          configData.data.contractAddress,
          0,
          finalNetwork,
          alchemyApiKey
        );
      } else if (configData.methodName == "TOKENwithAmount") {
        if (!configData.data.amount) {
          console.log("INCORRECT INPUT DATA");
          return;
        }
        response = await checkToken(
          address,
          configData.data.contractAddress,
          configData.data.amount,
          finalNetwork,
          alchemyApiKey
        );
      }

      console.log(response);

      if (response) {
        console.log("PROTECTED ROUTE AND ACCESS ALLOWED");
        setAuthorised(true);
        setRestricted(false);
        setLoading(false);
        /// show the component , of not approved
      } else {
        console.log("PROTECTED ROUTE AND ACCESS NOT ALLOWED");
        setRestricted(true);
        setAuthorised(false);
        setLoading(false);
        void router.push({
          pathname: "/restricted",
        });
      }
    } else {
      setLoading(false);
      console.log("NOT A PROTECTED ROUTE");
    }
  };

  useEffect(() => {
    authCheck();

    const preventAccess = () => setAuthorised(false);

    router.events.on("routeChangeStart", preventAccess);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", preventAccess);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, router.events, address, authorised, chain]);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {showConnectModel && <ConnectButton />}
        {loading && <a>Loading .....</a>}
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export const TokenGatingUI = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};
