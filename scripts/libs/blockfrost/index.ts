import { BlockfrostProvider } from "@meshsdk/core";
import { BLOCKFROST_API_KEY } from "../../constants";

const blockfrostProviderSingleton = () => {
    return new BlockfrostProvider(BLOCKFROST_API_KEY);
};

declare const globalThis: {
    blockfrostProviderGlobal: ReturnType<typeof blockfrostProviderSingleton>;
} & typeof global;

const blockfrostProvider = globalThis.blockfrostProviderGlobal ?? blockfrostProviderSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.blockfrostProviderGlobal = blockfrostProvider;
}

export { blockfrostProvider };
