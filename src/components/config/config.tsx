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
  "NFTWithAttributes"
}

export type configDataType = {
  path: string;
  methodName: methods;
  network: networks;
  data: {
    contractAddress: string;
    tokenId?: string;
    amount?: number;
    attributes?: { value: string, trait_type: string } [];
  };
};

export type configType = configDataType[];
