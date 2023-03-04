import React, { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { configType } from "../../../types/types";
export interface ITokenGatingWrapperProps {
    config: configType;
    alchemyApiKey: string;
    children: ReactNode;
}
export declare const TokenGatingWrapper: React.FunctionComponent<ITokenGatingWrapperProps>;
export declare const TokenGatingUI: () => JSX.Element;
