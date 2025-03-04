import { NextRequest } from "next/server";
import { blockfrostFetcher } from "@/lib/cardano";
import { readPlutusData } from "@/utils";

interface Amount {
  unit: string;
  quantity: string;
}

interface Transaction {
  address: string;
  tx_hash: string;
  tx_index: number;
  output_index: number;
  amount: Amount[];
  block: string;
  data_hash: string;
  inline_datum: string;
  reference_script_hash: string | null;
}

interface AssetTransaction {
  tx_hash: string;
  tx_index: number;
  block_height: number;
  block_time: number;
}

interface Amount {
  unit: string;
  quantity: string;
}

interface Input {
  address: string;
  amount: Amount[];
  tx_hash: string;
  output_index: number;
  data_hash: string;
  inline_datum: string;
  reference_script_hash: string | null;
  collateral: boolean;
  reference: boolean;
}

interface Output {
  address: string;
  amount: Amount[];
  output_index: number;
  data_hash: string;
  inline_datum: string;
  reference_script_hash: string | null;
  consumed_by_tx: string;
}

interface TransactionUTxO {
  hash: string;
  inputs: Input[];
  outputs: Output[];
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const policyId: string = searchParams.get("policy_id") as string;
    const assetName: string = searchParams.get("asset_name") as string;

    const addressAssets: Transaction[] = await blockfrostFetcher.fetchAddressUTXOs("addr_test1wrg9cgtmc3fjtrxu7s34fgygrc6lrhnfg3h9znxlr4jwayscwrcpu");
    
    const assets = await Promise.all(addressAssets.map(async function (asset: Transaction) {
        const datum = await readPlutusData({ plutusData: asset.inline_datum })
        const assetTransaction: AssetTransaction[] = await blockfrostFetcher.fetchAssetTransactions(datum?.policyId + datum?.assetName);
        if (policyId === datum?.policyId && assetName === datum?.assetName) {
            const transactionUTxO: TransactionUTxO = await blockfrostFetcher.fetchTransactionsUTxO(assetTransaction[0].tx_hash) as TransactionUTxO
            const specificAsset = await blockfrostFetcher.fetchSpecificAsset(datum?.policyId + datum?.assetName)
            return {
                policyId: datum.policyId,
                assetName: datum.assetName,
                price: datum.price,
                seller: transactionUTxO.inputs[0].address,
                metadata: specificAsset?.onchain_metadata || specificAsset?.metadata
            }
        }
        
    }))

    const filteredAssets = assets.find(asset => asset !== undefined);
    return Response.json(filteredAssets);
}