# Token - Gating - SDK

A Simple and Modern SDK For Implementing Token - Gating in your webpage , in just few steps.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Introduction

Website owners can verify the ownership of NFTs and Tokens in the users wallet , and accodingly grant or restrict the access to a Webpage with the help of this SDK.

It is Ready to use out of the Box , for all type of Applications , Next , React, etc. with just simple configurations steps , can be followed in the tutorial below.

<img width="1311" alt="Screenshot 2023-03-06 at 11 56 26 AM" src="https://user-images.githubusercontent.com/91938348/223038182-8d508a8f-e684-4f11-919b-f6bfcc15ab6e.png">

## Features

1 . Supports all the Major Networks (Mainnet) :

- Ethereum
- Polygon
- Optimism
- Arbitrum One

2 . All wallets supported :

- Metamask
- Rainbow
- Wallet Connect
- Coinbase

3 . Easy to set up and integrate with just 3 steps

4 . Highly Customizable , Configure access based on multiple conditions

## Installation

Install `token-gating-sdk` from CLI , in your project's root directory.

```bash
  npm install token-gating-sdk

  or

  yarn add token-gating-sdk
```

**NOTE** : Installation might take 2-3 minutes sometime , as there are lot of dependencies included in the package .

## Types

There are 3 kinds of Wrappers as follow :

- `NextGatingWrapper` for Next.js
- `ReactGatingWrapper` for React.js
- `UniversalGatingWrapper` for other applications

## Usage

For `Next.js` applications

#### 1. Import the Next Gating Wrapper and styles

Under `_app.tsx`

```javascript
import { NextGatingWrapper } from "token-gating-sdk";
import "@rainbow-me/rainbowkit/styles.css";
```

#### Wrapper Inputs

#### config

Create the config file as the tutorial below

```javascript
type configDataType = {
  path: string,
  methodName: methods,
  network: networks,
  data: {
    contractAddress: string,
    tokenId?: string,
    amount?: number,
  },
}[];
```

| Parameter | Type         | Description              |
| :-------- | :----------- | :----------------------- |
| `config`  | `configType` | **Required**. configData |

#### ALCHEMY API KEY

Get an API key from [Alchemy](https://dashboard.alchemy.com/signup/?a=f8afc2202c)

```javasript
const API_KEY: any = process.env.ALCHEMY_API_KEY;
```

| Parameter       | Type     | Description                        |
| :-------------- | :------- | :--------------------------------- |
| `alchemyApiKey` | `string` | **Required**. Api key from Alchemy |

#### 2. Import inputs

Under `_app.tsx`

```javascript
import { configData } from "../config/config";
const API_KEY: any = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
```

#### 3. Wrap the App with the Next Wrapper as follows

Under `_app.tsx`

```javascript
export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextGatingWrapper config={configData} alchemyApiKey={API_KEY}>
      <Component {...pageProps} />
    </NextGatingWrapper>
  );
}
```

Andd !! BOOM ✨ , You just Token Gated your website

### NOTE:

For other Wrapper Types , the guide is similar , just the import wrapper is changes to implement the functionality

## Run

To run the project , run local dev command

In Next Apps

```bash
  npm run dev
```

## How to create the Config File ??

This is a very important step , where you can configure , that which page , should implement what conditions or requirements , to allow the access to the end User.

Create specific config for each page type , with the following format :

```javascript
configDataType = {
  path: string;  // path name
  methodName: methods;  // methods
  network: networks; // network
  data: {
    contractAddress: string;  // contractAddress of Token or NFT
    tokenId?: string;  // Token Id of the NFT (if req.)
    amount?: number;  // Amount of tokens (if req.)
  };
}[]
```

### Methods

There are currently 4 methods available , as follows :

- `NFTWithTokenID` for NFT with a Specific Token ID from a collection, E.g. BAYC No. 8378

Need to add contractAddress and tokenID of the NFT

```javascript
{
    path: "/page",
    methodName: methods.NFTWithTokenID,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      tokenId:"8378",
    },
  },
```

- `NFTCollection` for NFT from a particular NFT Collection, E.g. BAYC

Need to add contractAddress of NFT Collection

```javascript
{
    path: "/page",
    methodName: methods.NFTCollection,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
    },
  },
```

- `TOKEN` for a particular Token , E.g. USDC

Need to add contractAddress of Token

```javascript
{
    path: "/page",
    methodName: methods.TOKEN,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
  },
```

- `TOKENwithAmount` for an amount of a Particular token , E.g. 100 USDC

Need to add contractAddress and amount of the token

```javascript
{
    path: "/page",
    methodName: methods.TOKEN,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: 100000000,
    },
  },
```

These can be accessed by importing methods

```javascript
export enum methods {
  "NFTWithTokenID",
  "NFTCollection",
  "TOKEN",
  "TOKENwithAmount",
}
```

### Networks

We Support 4 Mainnets currently:

- `Ethereum`
- `Optimism`
- `Polygon`
- `Arbitrum One`

These can be accessed by importing networks

```javascript
export enum networks {
  "Ethereum",
  "Optimism",
  "Polygon",
  "Arbitrum One",
}
```

## Example

Here is an example config File , for all the 4 types of Methods. Refer the same for more info -

```javascript
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
];
```

## Screenshots


<img width="1311" alt="Screenshot 2023-03-06 at 11 56 48 AM" src="https://user-images.githubusercontent.com/91938348/223038142-03c8b3e9-9be8-4b31-b6c2-d61e4f7242c8.png">

<img width="1311" alt="Screenshot 2023-03-06 at 11 56 37 AM" src="https://user-images.githubusercontent.com/91938348/223038205-830d7585-9574-412e-bfef-e2ebc0d4f5ee.png">

<img width="1311" alt="Screenshot 2023-03-06 at 11 57 45 AM" src="https://user-images.githubusercontent.com/91938348/223038610-7f078e38-0e26-4e37-ba8f-87bc65a013cc.png">



## Appendix

The package is just live with an initial version , there might be some upcoming changes .

Contact: contact.dhruvagarwal@gmail.com

## Tech Stack

**Backend:** React, Next, Rollup, React-router-dom, React-dom

**Packages:** Alchemy SDK , Rainbowkit , Wagmi , Ethers

## Acknowledgment

- Built in Partnership with [Alchemy](https://www.alchemy.com/) and [Replit](https://replit.com/~) under the [Bounty](https://replit.com/bounties/@Arjun-Alchemy/token-gating-bot)

## Authors

- [@0xdhruv](https://www.github.com/dhruv-2003)
- [@arcsh7](https://www.github.com/Architsharma7)

## Contributing

Contributions are always welcome!

Create a Pull request with the details of the changes made and how they could help the project improve

Please adhere to this project's `code of conduct`.
