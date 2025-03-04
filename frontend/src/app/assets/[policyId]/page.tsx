"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { Context, ContextType } from "@/components/providers/wallet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BrowserWallet, hexToString } from "@meshsdk/core";
import { MarketplaceContract } from "../../../../../contract/script";

export default function DetailsNFT() {
    const { wallet } = useContext<ContextType>(Context);
    const searchParams = useSearchParams();
    const policy_id = searchParams.get("policy_id") as string;
    const asset_name = searchParams.get("asset_name") as string;

    const [price, setPrice] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    console.log(address);

    useEffect(
        function () {
            async function fetchAddress() {
                setAddress(await wallet.getChangeAddress());
            }
            if (wallet) {
                fetchAddress();
            }
        },
        [wallet]
    );

    const { data, isLoading, isError } = useQuery({
        queryKey: ["assets"],
        queryFn: async () => {
            const response = await axios.get(
                `${window.location.origin}/api/assets?policy_id=${policy_id}&asset_name=${asset_name}`,
                {
                    timeout: 7_000,
                }
            );
            return response.data;
        },
    });

    const buy = async function (
        policyId: string,
        assetName: string,
        sellerAddress: string
    ) {
        if (wallet !== undefined) {
            console.log(await wallet.getChangeAddress());
            const marketplaceContract: MarketplaceContract =
                new MarketplaceContract({
                    wallet: wallet as BrowserWallet,
                });
            const unsignedTx: string = await marketplaceContract.buy({
                policyId: policyId,
                assetName: assetName,
                amount: 1,
                sellerAddress: sellerAddress,
            });
            console.log(unsignedTx);
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            console.log(txHash);
        }
    };

    const update = async function (
        policyId: string,
        assetName: string,
        price: string
    ) {
        if (wallet !== undefined) {
            const marketplaceContract: MarketplaceContract =
                new MarketplaceContract({
                    wallet: wallet as BrowserWallet,
                });
            const unsignedTx: string = await marketplaceContract.update({
                policyId: policyId,
                assetName: assetName,
                amount: 1,
                price: Number(price),
            });
            console.log(unsignedTx);
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            console.log(txHash);
        }
    };

    const refund = async function (policyId: string, assetName: string) {
        if (wallet !== undefined) {
            console.log("sell");
            const marketplaceContract: MarketplaceContract =
                new MarketplaceContract({
                    wallet: wallet as BrowserWallet,
                });
            const unsignedTx: string = await marketplaceContract.refund({
                policyId: policyId,
                assetName: assetName,
                amount: 1,
            });
            console.log(unsignedTx);
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            console.log(txHash);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading assets</div>;
    }

    console.log(data);
    return (
        <div className="flex py-10 space-x-5">
            <div className="w-1/2 border rounded-lg overflow-hidden shadow-lg h-fit">
                {/* <Image
                    src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
                    alt="NFT image"
                    quality={100}
                    width={1000}
                    height={1000}
                    className="h-[30rem] w-100 object-contain bg-zinc-100"
                /> */}
            </div>
            <div className="w-1/2 pt-5">
                <div className="font-semibold text-2xl">
                    {hexToString(asset_name || "")}
                </div>
                <div>
                    Owned by:{" "}
                    <span className="text-blue-500">{data?.seller}</span>{" "}
                </div>
                <div>
                    Polycy ID:{" "}
                    <span className="text-blue-500">{policy_id}</span>{" "}
                </div>
                <div className="border rounded-lg p-5 my-3">
                    <div className="text-slate-500"></div>
                    <div className="font-semibold text-3xl">
                        {data?.price / 1000000} ₳
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                        {data?.seller !== address ? (
                            <Button
                                onClick={async () => {
                                    await buy(
                                        policy_id,
                                        asset_name,
                                        data?.seller
                                    );
                                }}
                            >
                                Buy now
                            </Button>
                        ) : (
                            <Button
                                onClick={async () => {
                                    await refund(policy_id, asset_name);
                                }}
                            >
                                Refund now
                            </Button>
                        )}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"outline"}> Make offer</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Make an offer</DialogTitle>
                                </DialogHeader>
                                <div>
                                    <div>
                                        <Label>Enter amount to offer</Label>
                                        <Input
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            placeholder="ADA"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                        >
                                            Close
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={async () => {
                                            await update(
                                                policy_id,
                                                asset_name,
                                                price
                                            );
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
