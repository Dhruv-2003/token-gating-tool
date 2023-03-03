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
export declare enum networks {
    "Ethereum" = 0,
    "Optimism" = 1,
    "Polygon" = 2,
    "Arbitrum One" = 3
}
export declare enum methods {
    "NFTWithTokenID" = 0,
    "NFTCollection" = 1,
    "TOKEN" = 2,
    "TOKENwithAmount" = 3
}
export declare const networkTypes: string[];
export declare const methodTypes: string[];
