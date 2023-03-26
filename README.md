# Token - Gating - SDK

A Simple and Modern SDK For Implementing Token - Gating in your webpage , in just few steps.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Demo

![token-gating-demo](https://user-images.githubusercontent.com/91938348/223115760-618d4f09-364f-4352-ae22-68335d7ab03a.gif)

A Full Demo Video can be looked up here :

https://www.loom.com/share/136962ce378145a8a46271271415206d

The REPLIT TEMPLATE for a Next.js Application with token-gating-sdk can be found here :
[Replit-Template](https://replit.com/@DhruvAgarwal24/Token-gating-next-demo?v=1)

## Introduction

Website owners can verify the ownership of NFTs and Tokens in the users wallet , and accordingly grant or restrict the access to a Webpage with the help of this SDK.

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
    attributes?: { value: string, trait_type: string }; // Array of NFT Attributes (if req.)
  };
}[]
```

### Methods

There are currently 5 methods available , as follows :

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

- `NFTWithAttributes` for NFT with a Specific Atrtibute (trait type and value) from a collection, E.g. BAYC. Fur -> Pink.

Need to add contractAddress and an array of attributes of the NFT

```javascript
{
    path: "/page",
    methodName: methods.NFTWithTokenID,
    network: networks.Ethereum,
    data: {
      contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      attributes: [ { value: "Pink", trait_type: "Fur" } ]
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
  "NFTWithAttributes"
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

Here is an example config File , for all the 5 types of Methods. Refer the same for more info -

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

## How we built it ??

- Token - gating was implemented by simply checking the conditions set by the Website manager in the config , based on the data from blockchain . Here `Alchemy - SDK` , came into play , which was used to fetch the needed data , and because of the different API endpoints available , made it easy for us to just simply add this part. We used `verifyNftOwnership` , `getOwnersForNft` and `getTokenBalances` methods , to get the needed data and check the logic , to authorise or restrict the user from accessing the website. This also helped us to enable this service on 4 Main-nets , `Ethereum` , `Polygon` , `Arbitrum One` & `Optimism`. `RainbowKit` + `Wagmi` were used to handle wallet and other network logic , this enabled the user to use most of the major wallets out their in the market , to connect with.

- I had worked with Token-Gating prior to this , therefore I knew the method to add the code to a website , but converting that code into a usable component, that could be integrated to a new website in Simple Steps was the key . So the next step was to figure out the approach to implement Token-gating to any website which was the most challenging part of the bounty , We had multiple ones in mind , But finally we finalised to create an SDK , that could be used in Next , React and other web Applications.
- We created an `SDK` or `React Library` with wrapper components in `TypeScript` , to ensure the best experience for the developers to interact with it. Our main aim was to make it as simple as for a newbie to add it to a website. We achieved this by handling most of the logic and extra steps on our component side , in order to make it just plugin & play. We also added an extensive documentation for the developers , to integrate the SDK .
- Next we had to figure out the Page Routing or Navigation , Luckily , Next had `Next/Router` , which handles all these things , in the backend ,we just had to get the Routers current route and check the conditions to allow access. Moreover for React applications , we used , `window.location`property from Browsers. We will be adding `React-router-dom` support too in near future .
- We created an UI component too , that would ensure that non authorised users are not allowed to view the content of protected page , we used `Styled-Components` & `chakra-ui`. The UI - UX was kept simple , for the best end user experience . Pure CSS could not be used , as we were not able to configure the bundler for bundle CSS files.
- Then came the next big challenge to actually bundle the Components , make the package as small as possible , We used `Rollup` here and some extra plugins to bundle the whole thing together , we had to resolve a lot of big errors here , as it was the first time developing a full scale UI SDK. But after creating 10 versions , the final working version was live. We bundled into `ESM` types , meaning it supported `ES6` syntax, which now most of the browsers support. Setting Up `package.json` with the exports , files , module and configuring it to point to `dist` is an important step too , while building SDKs.
- Andd !! In this way we created this `token-gating-sdk` in almost a week of work , lot of research and solving bugs 😅 to produce the best final version. This was indeed a great learning experience , to work around with SDKs and React Libraries along with a Web3 twist. and a lot of other packages like `Alchemy-SDK` , `Wagmi` , `Rainbowkit` , etc.

Looking forward for more such experience and a Big Thanks to Alchemy & Replit Teams for giving me this great opportunity .

## Acknowledgment

- Built in Partnership with [Alchemy](https://www.alchemy.com/) and [Replit](https://replit.com/~) under the [Bounty](https://replit.com/bounties/@Arjun-Alchemy/token-gating-bot)

- `Alchemy SDK` was used to fetch the needed data from blockchain. We used `verifyNftOwnership` ,`getOwnersForNft` and `getTokenBalances` methods , to get the needed data and check the logic , to authorise or restrict the user from accessing the website. This also helped us to enable this service on 4 Main-nets , `Ethereum` , `Polygon` , `Arbitrum One` & `Optimism`.

## Authors

- [@0xdhruv](https://www.github.com/dhruv-2003)
- [@arcsh7](https://www.github.com/Architsharma7)

## Contributing

Contributions are always welcome!

Create a Pull request with the details of the changes made and how they could help the project improve

Please adhere to this project's `code of conduct`.
