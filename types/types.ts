// restrict the Network and Method Name to ceratin values only
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

export const networkTypes = ["Ethereum", "Optimism", "Polygon", "Arbitrum One"];

export const methodTypes = [
  "NFTWithTokenID",
  "NFTCollection",
  "TOKEN",
  "TOKENwithAmount",
];
