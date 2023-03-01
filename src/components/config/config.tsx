export enum networks {
  "Ethereum",
  "Optimism",
  "Polygon",
  "Arbitrum One",
}

export enum methods {
  "NFTWithTokenID",
  "NFTCollection",
  "TOKEN",
  "TOKENwithAmount",
}

export type configDataType = {
  path: string;
  methodName: methods;
  network: networks;
  data: {
    contractAddress: string;
    tokenId?: string;
    amount?: number;
  };
};

export type configType = configDataType[];
