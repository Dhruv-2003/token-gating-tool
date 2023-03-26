import { configType, methods, networks } from "token-gating-sdk";

export const configData: configType = [
  {
    path: "/privatenft",
    methodName: methods.NFTWithTokenID,
    network: networks.Ethereum,
    data: {
      contractAddress: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      tokenId:
        "5691999065095808972681467169397940732013218209247626737760195198340626795922",
    },
  },
  {
    path: "/privatecollection",
    methodName: methods.NFTCollection,
    network: networks.Ethereum,
    data: { contractAddress: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85" },
  },
  {
    path: "/privatetoken",
    methodName: methods.TOKEN,
    network: networks.Ethereum,
    data: { contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
  },
  {
    path: "/privatetokenamount",
    methodName: methods.TOKENwithAmount,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: 100000000,
    },
  },
  {
    path: "/privateattributes",
    methodName: methods.NFTWithAttributes,
    network: networks.Ethereum,
    data: {
      contractAddress: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
      attributes: [ 
      	{ value: "letter", trait_type: "Character Set" },
      ],
    },
  },
];
