
import { BlockfrostFetcher } from "./blockfrost/fetcher";
import { BlockfrostProvider } from "@meshsdk/core";
import { KoiosFetcher } from "./koios/fetcher";

const blockfrostFetcherSingleton = () => {
  return new BlockfrostFetcher("preprodI0wPh2nv6iI8scU3eCsm3phsLzP8z6At");
};
const blockfrostProviderSingleton = () => {
  return new BlockfrostProvider("preprodI0wPh2nv6iI8scU3eCsm3phsLzP8z6At");
};
const koiosFetcherSingleton = () => {
  return new KoiosFetcher("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyIjoic3Rha2UxdTh6bWh3cDNuemgwd3QzemozeHVnNWFhMzh2bGF0N3UyaDYzeno4ZjA2ZnRlbGM1dmVjNDgiLCJleHAiOjE3NTgxOTY3MDksInRpZXIiOjEsInByb2pJRCI6Ik1hcmtldHBsYWNlIn0.yEb6mSV6bx_AtxZlSHfkP3wPleLbsBg3NHxbZzS-Sv4");
};

declare const globalThis: {
  blockfrostFetcherGlobal: ReturnType<typeof blockfrostFetcherSingleton>;
  blockfrostProviderGlobal: ReturnType<typeof blockfrostProviderSingleton>;
  koiosFetcherGlobal: ReturnType<typeof koiosFetcherSingleton>;
} & typeof global;

const blockfrostFetcher = globalThis.blockfrostFetcherGlobal ?? blockfrostFetcherSingleton();
const blockfrostProvider = globalThis.blockfrostProviderGlobal ?? blockfrostProviderSingleton();
const koiosFetcher = globalThis.koiosFetcherGlobal ?? koiosFetcherSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.blockfrostFetcherGlobal = blockfrostFetcher;
  globalThis.blockfrostProviderGlobal = blockfrostProvider;
  globalThis.koiosFetcherGlobal = koiosFetcher;
}

export { blockfrostFetcher, blockfrostProvider, koiosFetcher };