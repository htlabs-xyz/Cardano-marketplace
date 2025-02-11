import {
    deserializeAddress,
    mConStr0,
    mConStr1,
    scriptAddress,
    serializeAddressObj,
} from "@meshsdk/core";
import { MeshAdapter } from "./mesh";

export class MarketplaceContract extends MeshAdapter {
    /**
     * @method SELL
     *
     */

    sell = async ({
        policyId,
        assetName,
        amount = 1,
        price,
    }: {
        policyId: string;
        assetName: string;
        amount: number;
        price: number;
    }): Promise<string> => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const sellerPaymentKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const unsignedTx = this.meshTxBuilder
            .txOut(this.marketplaceAddress, [
                {
                    quantity: String(amount),
                    unit: policyId + assetName,
                },
            ])
            .txOutInlineDatumValue(mConStr0([policyId, assetName, sellerPaymentKeyHash, price]))
            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork("preprod")
            .complete();

        return unsignedTx;
    };

    /**
     * @method BUY
     *
     */
    buy = async ({
        policyId,
        assetName,
        amount = 1,
    }: {
        policyId: string;
        assetName: string;
        amount?: number;
    }) => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.marketplaceAddress, policyId + assetName);
        console.log(utxo)
        if (!utxo) throw new Error("UTxO not found");
        const datum = await this.readPlutusData({
            plutusData: utxo?.output?.plutusData as string,
        });
        console.log(datum)
        const sellerAddress = serializeAddressObj(scriptAddress(datum.seller));
        console.log(sellerAddress)
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(sellerAddress, [
                {
                    unit: "lovelace",
                    quantity: String(datum?.price),
                },
            ])
            .txOut(walletAddress, [
                {
                    unit: policyId + assetName,
                    quantity: String(amount),
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
            .setNetwork("preprod")
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
        amount = 1,
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
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(walletAddress, [
                {
                    unit: policyId + assetName,
                    quantity: String(amount),
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
            .setNetwork("preprod")
            .complete();
        return unsignedTx;
    };
    /**
     * @method UPDATE
     *
     */
    update = async ({
        policyId,
        assetName,
        amount = 1,
        price,
    }: {
        policyId: string;
        assetName: string;
        amount: number;
        price: number;
    }) => {
        const { utxos, walletAddress, collateral } = await this.getWalletForTx();
        const utxo = await this.getAddressUTXOAsset(this.marketplaceAddress, policyId + assetName);
        const sellerPaymentKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.marketplaceScriptCbor)

            .txOut(walletAddress, [
                {
                    unit: policyId + assetName,
                    quantity: String(amount),
                },
            ])
            .txOutInlineDatumValue(mConStr0([policyId, assetName, sellerPaymentKeyHash, price]))

            .changeAddress(walletAddress)
            .requiredSignerHash(deserializeAddress(walletAddress).pubKeyHash)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setNetwork("preprod")
            .complete();
        return unsignedTx;
    };
}
