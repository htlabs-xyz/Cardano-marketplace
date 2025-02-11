/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import { MeshWallet } from "@meshsdk/core";
import { blockfrostProvider } from "../script/common";
import { MarketplaceContract } from "../script";

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
                // words: process.env.BUYER?.split(" ") || [],
                words: process.env.SELLER?.split(" ") || [],
            },
        });
    });
    jest.setTimeout(60000);

    test("Sell", async function () {
        // return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.sell({
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "4e677579e1bb856e20447579204b68c3a16e68",
            price: 10000000,
            amount: 1,
        });
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preprod.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

    test("Buy", async function () {
        // return;
        const marketplaceContract: MarketplaceContract = new MarketplaceContract({
            wallet: wallet,
        });
        const unsignedTx: string = await marketplaceContract.buy({
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "4e677579e1bb856e20447579204b68c3a16e68",
        });
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preprod.cexplorer.io/tx/" + txHash);
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
            policyId: "444bdbc931ef892fcef8ae8c80bd1c39866f1806bec8a16db42872f4",
            assetName: "4e677579e1bb856e20447579204b68c3a16e68",
            amount: 1,
        });
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("https://preview.cexplorer.io/tx/" + txHash);
        txHashTemp = txHash;
        blockfrostProvider.onTxConfirmed(txHash, () => {
            expect(txHash.length).toBe(64);
        });
    });

});
