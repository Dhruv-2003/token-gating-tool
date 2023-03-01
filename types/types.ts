// restrict the Network and Method Name to ceratin values only
export type configDataType = {
  path: string;
  methodName: string;
  network: string;
  data: {
    contractAddress: string;
    tokenId?: string;
    amount?: number;
  };
};

export type configType = configDataType[];

export const networkTypes = ["Ethereum", "Optimism", "Polygon", "Arbitrum One"];

export const methodTypes = [
  "NFTWithTokenID",
  "NFTCollection",
  "TOKEN",
  "TOKENwithAmount",
];
