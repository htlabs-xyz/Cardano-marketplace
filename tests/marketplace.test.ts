/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { blockfrostProvider } from "../script/common";
import { MarketplaceContract } from "../script";

describe("Marketplace", function () {
    let txHashTemp: string;
    let buyerWallet: MeshWallet;
    let sellerWallet: MeshWallet;
    beforeEach(async function () {
        buyerWallet = new MeshWallet({
            networkId: 0,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: process.env.BUYER?.split(" ") || [],
            },
        });
        sellerWallet = new MeshWallet({
            networkId: 0,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: process.env.SELLER?.split(" ") || [],
            },
        });
    });
    jest.setTimeout(60000);

    test("Sell", async function () {
        return;
        console.log(wallet.getChangeAddress());
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: sellerWallet,
        });
        const unsignedTx: string = await marketplaceContract.sell({
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "656c77303031",
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "656c77303031",
            price: 10000000,
            amount: 1,
        });
        console.log(unsignedTx);
        const signedTx = await sellerWallet.signTx(unsignedTx, true);
        const txHash = await sellerWallet.submitTx(signedTx);
        console.log("https://preprod.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Buy", async function () {
        // return;
         console.log(wallet.getChangeAddress());
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: buyerWallet,
        });
        const unsignedTx: string = await marketplaceContract.buy({
             policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "656c77303031",
        });
        const signedTx = await buyerWallet.signTx(unsignedTx, true);
        const txHash = await buyerWallet.submitTx(signedTx);
        console.log("https://preprod.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Refund", async function () {
        return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: sellerWallet,
        });
        const unsignedTx: string = await marketplaceContract.refund({
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "4e677579e1bb856e20447579204b68c3a16e68",
            amount: 1,
        });
        const signedTx = await sellerWallet.signTx(unsignedTx, true);
        const txHash = await sellerWallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });
});
