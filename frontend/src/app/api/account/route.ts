import { NextRequest } from "next/server";
import { koiosFetcher, blockfrostFetcher } from "@/lib/cardano";

interface Asset {
    address: string;
    policy_id: string;
    asset_name: string;
    fingerprint: string;
    decimals: number;
    quantity: number;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const walletAddress: string = searchParams.get("wallet_address") as string;

    const addressAssets: Asset[] = await koiosFetcher.fetchAssetsFromAddress(walletAddress);

    const assets = await Promise.all(addressAssets?.map(async function ({ policy_id, asset_name }) {
        const specificAsset = await blockfrostFetcher.fetchSpecificAsset(policy_id + asset_name)
        return {
            policy_id: policy_id,
            asset_name: asset_name,
            metadata: specificAsset?.onchain_metadata || specificAsset?.metadata
        }
    }));

    return Response.json(assets);
}