import {
    applyParamsToScript,
    deserializeAddress,
    IFetcher,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    serializePlutusScript,
    UTxO,
} from "@meshsdk/core";
import { Plutus } from "../types";
import { APP_WALLET_ADDRESS, title } from "../constants";
import plutus from "../../plutus.json";
import { appNetworkId } from "../constants";
import { blockfrostProvider } from "../libs/blockfrost";
import convertInlineDatum from "../helpers/convert-inline-datum";

export class MeshAdapter {
    protected fetcher: IFetcher;
    protected wallet: MeshWallet;
    protected pubKeyExchange: string;
    protected meshTxBuilder: MeshTxBuilder;
    protected marketplaceAddress: string;
    protected marketplaceScript: PlutusScript;
    protected marketplaceScriptCbor: string;
    protected marketplaceCompileCode: string;
    constructor({ wallet = null! }: { wallet?: MeshWallet }) {
        this.wallet = wallet;
        this.fetcher = blockfrostProvider;
        this.meshTxBuilder = new MeshTxBuilder({
            fetcher: this.fetcher,
            evaluator: blockfrostProvider,
        });
        this.pubKeyExchange = deserializeAddress(APP_WALLET_ADDRESS).pubKeyHash;
        this.marketplaceCompileCode = this.readValidator(plutus as Plutus, title.marketplace);

        this.marketplaceScriptCbor = applyParamsToScript(this.marketplaceCompileCode, [
            this.pubKeyExchange,
            BigInt(1),
        ]);

        this.marketplaceScript = {
            code: this.marketplaceScriptCbor,
            version: "V3",
        };

        this.marketplaceAddress = serializePlutusScript(
            this.marketplaceScript,
            undefined,
            appNetworkId,
            false,
        ).address;
    }

    protected getWalletForTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const utxos = await this.wallet.getUtxos();
        const collaterals = await this.wallet.getCollateral();
        const walletAddress = this.wallet.getChangeAddress();
        if (!utxos || utxos.length === 0)
            throw new Error("No UTXOs found in getWalletForTx method.");

        if (!collaterals || collaterals.length === 0)
            throw new Error("No collateral found in getWalletForTx method.");

        if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

        return { utxos, collateral: collaterals[0], walletAddress };
    };

    protected getUtxoForTx = async (address: string, txHash: string) => {
        const utxos: UTxO[] = await this.fetcher.fetchAddressUTxOs(address);
        const utxo = utxos.find(function (utxo: UTxO) {
            return utxo.input.txHash === txHash;
        });

        if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
        return utxo;
    };

    protected readValidator = function (plutus: Plutus, title: string): string {
        const validator = plutus.validators.find(function (validator) {
            return validator.title === title;
        });

        if (!validator) {
            throw new Error(`${title} validator not found.`);
        }

        return validator.compiledCode;
    };

    protected readPlutusData = async ({ plutusData }: { plutusData: string }) => {
        const datum = await convertInlineDatum({ inlineDatum: plutusData });
        return {
            policyId: datum?.fields[0].bytes,
            assetName: datum?.fields[1].bytes,
            seller: datum?.fields[2].bytes,
            price: datum?.fields[3].int,
            royalties: datum?.fields[4].int,
            author: datum?.fields[5].bytes,
            order: {
                owner: datum?.fields[6].fields[0].bytes,
                price: datum?.fields[6].fields[1].int,
            },
        };
    };

    protected getAddressUTXOAsset = async (address: string, unit: string) => {
        const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
        return utxos[utxos.length - 1];
    };

    protected getAddressUTXOAssets = async (address: string, unit: string) => {
        return await this.fetcher.fetchAddressUTxOs(address, unit);
    };
}