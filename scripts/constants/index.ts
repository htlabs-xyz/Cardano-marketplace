import { Network } from "@meshsdk/core";

export const APP_WALLET_ADDRESS =
    process.env.APP_WALLET_ADDRESS ||
    "addr_test1qzjzr7f3yj3k4jky7schc55qjclaw6fhc3zfnrarma9l3579hwurrx9w7uhz99zdc3fmmzwel6hac404zyywjl5jhnls09rtm6";
export const EXCHANGE_FEE_PRICE = process.env.EXCHANGE_FEE_PRICE || "1000000"; //lovelace

const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || "";
const title = {
    marketplace: "marketplace.contract.spend",
};
const appNetwork: Network =
    (process.env.NEXT_PUBLIC_APP_NETWORK?.toLowerCase() as Network) || "preprod";

const appNetworkId = appNetwork === "mainnet" ? 1 : 0;

export { appNetwork, appNetworkId, BLOCKFROST_API_KEY, title };
