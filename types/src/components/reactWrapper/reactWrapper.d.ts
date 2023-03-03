import { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { configType } from "../../../types/types";
export interface TokenGatingWrapperProps {
    config: configType;
    alchemyApiKey: string;
    children: ReactNode;
}
declare const TokenGatingWrapper: ({ config, alchemyApiKey, children, }: TokenGatingWrapperProps) => JSX.Element;
export default TokenGatingWrapper;
export declare const TokenGatingUI: () => JSX.Element;
