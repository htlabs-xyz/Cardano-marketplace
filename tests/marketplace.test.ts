/* eslint-disable @typescript-eslint/no-unused-vars */
import { blockfrostProvider } from "../scripts/libs/blockfrost";
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { MarketplaceContract } from "../scripts";

describe("Marketplace", function () {
    let txHashTemp: string;
    let wallet: MeshWallet;
    beforeEach(async function () {
        wallet = new MeshWallet({
            networkId: 0,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: process.env.APP_MNEMONIC?.split(" ") || [],
                // words: process.env.APP_MNEMONIC_1?.split(" ") || [],
            },
        });
    });
    jest.setTimeout(60000);

    test("Sell", async function () {
        return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.sell({
            policyId: "71cc52bee302c0a6ae17221754c4d64d210de8b4cb6a2e8feb294220",
            assetName: "000de14043495036382047656e657261746f7273",
            price: 10000000,
            amount: 1,
        });
        const signedTx = wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Buy", async function () {
        return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.buy({
            policyId: "71cc52bee302c0a6ae17221754c4d64d210de8b4cb6a2e8feb294220",
            assetName: "000de14043495036382047656e657261746f7273",
        });
        const signedTx = wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Refund", async function () {
        return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.refund({
            policyId: "71cc52bee302c0a6ae17221754c4d64d210de8b4cb6a2e8feb294220",
            assetName: "000de14043495036382047656e657261746f7273",
            amount: 1,
        });
        const signedTx = wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Order", async function () {
        return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.order({
            policyId: "71cc52bee302c0a6ae17221754c4d64d210de8b4cb6a2e8feb294220",
            assetName: "000de14043495036382047656e657261746f7273",
            orderPrice: 10000000,
        });
        const signedTx = wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });
});
