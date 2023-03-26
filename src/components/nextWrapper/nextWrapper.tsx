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
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import { Network, Alchemy } from "alchemy-sdk";
import { configDataType, configType, methods, networks } from "../config/index";

import styled from "styled-components";
import { Spinner } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";

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

export interface ITokenGatingWrapperProps {
  config: configType;
  alchemyApiKey: string;
  children: ReactNode;
}

// for next Only
export const TokenGatingWrapper: React.FunctionComponent<
  ITokenGatingWrapperProps
> = ({ config, alchemyApiKey, children }) => {
  const router = useRouter();

  const { address } = useAccount();
  const [authorised, setAuthorised] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [configData, setConfigData] = useState<configDataType | undefined>();
  const [showConnectModel, setShowConnectModel] = useState(false);
  const { chain, chains } = useNetwork();

  const getChainName = (chainType: networks) => {
    if (chainType == networks.Ethereum) {
      return "Ethereum";
    } else if (chainType == networks.Polygon) {
      return "Polygon";
    } else if (chainType == networks.Optimism) {
      return "Optimism";
    } else if (chainType == networks["Arbitrum One"]) {
      return "Arbitrum One";
    } else {
      return "Ethereum";
    }
  };

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
      console.log(chainId);
      setLoading(false);
      setShowConnectModel(true);
      console.log("WRONG NETWORK DETECETED");
      setMessage(`Wrong Network Detected , Change the Network to ${chainName}`);
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

  // 4. Owns a particular attribute from a particular NFT collection 
  // The trait should match trait type and value.
  const checkNFTAttributes = async (
    userAddress: string,
    contractAddress: string,
    attributes: { value: string, trait_type: string } [],
    network: Network,
    alchemyApiKey: string  	
  ) => { 
    try {
      const settings = {
        apiKey: alchemyApiKey, // Replace with your Alchemy API Key.
        network: network, // Replace with your network.
      };
  		
      const alchemy = new Alchemy(settings);
  	  
      console.log("Checking for the attributes");
  		
      const response = await alchemy.nft.getNftsForOwnerIterator(userAddress);
      //console.log(response);
  		
      for await (const nft of response) {
        if (nft.contract.address === contractAddress) {
          const nftAttributes = nft.rawMetadata?.attributes;
          if (nftAttributes) {
            for (let x = 0; x < nftAttributes.length; x++) {
              for (let y = 0; y < attributes.length; y++) {
                if (
                  nftAttributes[x].trait_type === attributes[y].trait_type &&
                  nftAttributes[x].value === attributes[y].value
                ) {
                  setAuthorised(true);
                  return true;
                }
              }
            }
          }
        }
      }
      setAuthorised(false);
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  // check the URL and accordingly the condition
  // Open up a ConnectWallet section in case there is no address
  // Show a Loading icon when the details are loading
  // In the end , if the user is restricted , then Show the User a message
  const authCheck = async () => {
    setLoading(true);
    if (!address) {
      console.log("LOGIN FIRST");
      setMessage("Connect Wallet to go ahead");
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
      setMessage("This Page is Protected");
      configData = config.find((v, i, arr) => {
        if (v.path == path) {
          return v;
        }
      });

      if (!configData) {
        console.log("NO CONFIG DATA FOUND");
        return;
      }

      setConfigData(configData);

      // console.log(configData);
      const chainName: string = getChainName(configData.network);
      const finalNetwork = getNetwork(chainName);
      if (!finalNetwork) return;

      // // checking the conditions of the method Applied and
      if (configData.methodName == methods.NFTWithTokenID) {
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
      } else if (configData.methodName == methods.NFTCollection) {
        response = await checkNFTCollection(
          address,
          configData.data.contractAddress,
          finalNetwork,
          alchemyApiKey
        );
      } else if (configData.methodName == methods.TOKEN) {
        response = await checkToken(
          address,
          configData.data.contractAddress,
          0,
          finalNetwork,
          alchemyApiKey
        );
      } else if (configData.methodName == methods.TOKENwithAmount) {
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
      } else if (configData.methodName == methods.NFTWithAttributes) {
      	if (!configData.data.attributes) {
      		console.log("INCORRECT INPUT DATA");
      		return;
      	}
      	response = await checkNFTAttributes(
      		address,
      		configData.data.contractAddress,
      		configData.data.attributes,
      		finalNetwork,
      		alchemyApiKey
      	);
      }

      console.log(response);

      if (response) {
        console.log("PROTECTED ROUTE AND ACCESS ALLOWED");
        setMessage("You are Authorized to access the page , Redirecting ...");
        setAuthorised(true);
        setRestricted(false);
        setLoading(false);
        /// show the component , of not approved
      } else {
        console.log("PROTECTED ROUTE AND ACCESS NOT ALLOWED");
        setMessage(
          "You are not Authorized to access the page , fulfill the above conditions"
        );
        // setSh
        setRestricted(true);
        setAuthorised(false);
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.log("NOT A PROTECTED ROUTE");
      setMessage("Not a Protected Webpage , Redirecting ...");
      setAuthorised(true);
      setRestricted(false);
    }
  };

  const getMessage = () => {
    try {
      if (!configData) return;

      if (configData.methodName == methods.NFTCollection) {
        return `NFT from the Collection ${configData.data.contractAddress.slice(
          0,
          8
        )}`;
      } else if (configData.methodName == methods.NFTWithTokenID) {
        return `NFT from the Collection ${configData.data.contractAddress.slice(
          0,
          8
        )} with the tokenId ${configData.data.tokenId?.slice(0, 5)}`;
      } else if (configData.methodName == methods.TOKEN) {
        return `Token with the contractAddress ${configData.data.contractAddress.slice(
          0,
          8
        )}`;
      } else if (configData.methodName == methods.TOKENwithAmount) {
        return `${
          configData.data.amount
        } Tokens with the contractAddress ${configData.data.contractAddress.slice(
          0,
          8
        )}`;
      } else if (configData.methodName == methods.NFTWithAttributes) {
        return `NFT from the Collection ${configData.data.contractAddress.slice(
          0,
          8
        )} with the attributes ${configData.data.attributes.map(attribute => JSON.stringify(attribute)).join(",")}`;
      } else {
        return `all the conditions fulfilled`;
      }
    } catch (error) {
      console.log(error);
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

  const ConnectButtonUi = () => {
    return (
      <ConnectUi>
        <TopText>
          <p>Token Gated WebPage </p>
          <p>
            Built with{" "}
            <a href="https://www.npmjs.com/package/token-gating-sdk">
              @token-gating-sdk
            </a>
          </p>
        </TopText>
        <ConnectButton />
        <Message>{message && message}</Message>
        <BottomText>
          <p>
            Brought to you in partnership with : &nbsp;{" "}
            <p style={{ color: "orange" }}>Replit</p> &nbsp; x &nbsp;{" "}
            <p style={{ color: "slateblue" }}>Alchemy</p>
          </p>
        </BottomText>
      </ConnectUi>
    );
  };

  const LoaderUi = () => {
    return (
      <ConnectUi>
        <TopText>
          <p>Token Gated WebPage </p>
          <p>
            Built with{" "}
            <a href="https://www.npmjs.com/package/token-gating-sdk">
              @token-gating-sdk
            </a>
          </p>
        </TopText>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <p>Checking wallet for NFTs and Tokens...</p>
        <Message>{message && message}</Message>
        <BottomText>
          <p>
            Brought to you in partnership with : &nbsp;{" "}
            <p style={{ color: "orange" }}>Replit</p> &nbsp; x &nbsp;{" "}
            <p style={{ color: "slateblue" }}>Alchemy</p>
          </p>
        </BottomText>
      </ConnectUi>
    );
  };

  const RestrictedUi = () => {
    return (
      <ConnectUi>
        <TopText>
          <p>Token Gated WebPage </p>
          <p>
            Built with{" "}
            <a href="https://www.npmjs.com/package/token-gating-sdk">
              @token-gating-sdk
            </a>
          </p>
        </TopText>
        <Restricteddiv>
          <p>This page is restricted for you.</p>
          <p>Your wallet must have {getMessage()}</p>
        </Restricteddiv>
        <Message>{message && message}</Message>
        <BottomText>
          <p>
            Brought to you in partnership with : &nbsp;{" "}
            <p style={{ color: "orange" }}>Replit</p> &nbsp; x &nbsp;{" "}
            <p style={{ color: "slateblue" }}>Alchemy</p>
          </p>
        </BottomText>
      </ConnectUi>
    );
  };

  return (
    <ChakraProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          {authorised ? (
            <Content>{children}</Content>
          ) : (
            <Content2>
              {showConnectModel && <ConnectButtonUi />}
              {loading && <LoaderUi />}
              {!loading && restricted && !showConnectModel ? (
                <RestrictedUi />
              ) : (
                <div></div>
              )}
            </Content2>
          )}
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export const TokenGatingUI = () => {
  return (
    <div>
      <ConnectButton />
    </div>
  );
};

const Content = styled.div`
  height: 100vh;
  background-color: black;
  p {
    color: white;
  }
  h1 {
    color: white;
  }
  a {
    color: white;
  }
`;
const Content2 = styled.div`
  height: 100vh;
  background-color: #edf2ef;
  a {
    color: black;
  }
  p {
    color: black;
  }
`;

const ConnectUi = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  p {
    color: black;
    font-size: 30px;
  }
`;

const TopText = styled.div`
  margin-bottom: 60px;
  text-align: center;
  font-weight: 700;
  a {
    text-decoration: underline;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  color: black;
  font-size: 30px;
  text-align: center;
`;

const BottomText = styled.div`
  text-align: center;
  padding: 10px 20px 10px 20px;
  background-color: black;
  border-radius: 20px;
  margin-top: 60px;
  p {
    color: white;
  }
`;

const Restricteddiv = styled.div`
  height: 300px;
  width: 550px;
  padding: 20px 20px 20px 20px;
  border: 2px solid black;
  border-radius: 10px;
  background-color: white;
  p {
    justify-content: center;
    align-items: center;
    display: flex;
    color: black;
    font-size: 30px;
    text-align: center;
    vertical-align: middle;
    margin-bottom: 10px;
    margin-top: 20px;
  }
`;
