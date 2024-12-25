import {
    deserializeAddress,
    mConStr0,
    mConStr1,
    scriptAddress,
    serializeAddressObj,
} from "@meshsdk/core";
import { MeshAdapter } from "../adapters/mesh.adapter";
import { IMarketplaceContract } from "../interfaces/imarketplace.interface";
import { APP_WALLET_ADDRESS, appNetwork, EXCHANGE_FEE_PRICE } from "../constants";
import convertInlineDatum from "../helpers/convert-inline-datum";

export class MarketplaceContract extends MeshAdapter implements IMarketplaceContract {
    /**
     * @method SELL
     *
     */

    sell = async ({
        policyId,
        assetName,
        price,
        amount,
    }: {
        policyId: string;
        assetName: string;
        price: number;
        amount: number;
    }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const sellerPaymentKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const authorPaymentkeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const unsignedTx = this.meshTxBuilder
            .txOut(this.marketplaceAddress, [
                {
                    quantity: String(amount),
                    unit: policyId + assetName,
                },
            ])
            .txOutInlineDatumValue(
                mConStr0([
                    policyId,
                    assetName,
                    sellerPaymentKeyHash,
                    price,
                    price,
                    authorPaymentkeyHash,
                    mConStr0([authorPaymentkeyHash, price]),
                ]),
            )
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork(appNetwork)
            .complete();

        return unsignedTx;
    };

    /**
     * @method BUY
     *
     */
    buy = async ({ policyId, assetName }: { policyId: string; assetName: string }) => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.marketplaceAddress, policyId + assetName);
        if (!utxo) throw new Error("UTxO not found");
        const datum = await this.readPlutusData({
            plutusData: utxo?.output?.plutusData as string,
        });
        const authorAddress = serializeAddressObj(scriptAddress(datum.author));
        const sellerAddress = serializeAddressObj(scriptAddress(datum.seller));
        console.log(datum.price, datum.royalties);
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .spendingReferenceTxInInlineDatumPresent()
            .spendingReferenceTxInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(sellerAddress, [
                {
                    unit: "lovelace",
                    quantity: String(datum?.price),
                },
            ])
            .txOut(authorAddress, [
                {
                    unit: "lovelace",
                    quantity: String(datum?.royalties),
                },
            ])
            .txOut(walletAddress, [
                {
                    unit: policyId + assetName,
                    quantity: "1",
                },
            ])

            .txOut(APP_WALLET_ADDRESS, [
                {
                    unit: "lovelace",
                    quantity: EXCHANGE_FEE_PRICE,
                },
            ])

            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork(appNetwork)
            .complete();
        return unsignedTx;
    };

    /**
     * @method REFUND
     *
     */
    refund = async ({
        policyId,
        assetName,
        amount,
    }: {
        policyId: string;
        assetName: string;
        amount: number;
    }) => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.marketplaceAddress, policyId + assetName);

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .spendingReferenceTxInInlineDatumPresent()
            .spendingReferenceTxInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(walletAddress, [
                {
                    unit: policyId + assetName,
                    quantity: String(amount),
                },
            ])

            .txOut(APP_WALLET_ADDRESS, [
                {
                    unit: "lovelace",
                    quantity: EXCHANGE_FEE_PRICE,
                },
            ])
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork(appNetwork)
            .complete();
        return unsignedTx;
    };

    /**
     * @method ORDER
     *
     */
    order = async ({
        policyId,
        assetName,
        orderPrice,
    }: {
        policyId: string;
        assetName: string;
        orderPrice: number;
    }) => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();

        const utxo = await this.getAddressUTXOAsset(this.marketplaceAddress, policyId + assetName);
        if (!utxo) throw new Error("UTxO not found");
        const datum = await this.readPlutusData({
            plutusData: utxo?.output?.plutusData as string,
        });

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(this.marketplaceAddress, [
                {
                    unit: policyId + assetName,
                    quantity: String(1),
                },
            ])
            .txOutInlineDatumValue(
                mConStr0([
                    datum.policyId,
                    datum.assetName,
                    datum.seller,
                    datum.price,
                    datum.royalties,
                    datum.author,
                    mConStr0([deserializeAddress(walletAddress).pubKeyHash, orderPrice]),
                ]),
            )

            .txOut(APP_WALLET_ADDRESS, [
                {
                    unit: "lovelace",
                    quantity: EXCHANGE_FEE_PRICE,
                },
            ])
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork(appNetwork)
            .complete();
        return unsignedTx;
    };
}
