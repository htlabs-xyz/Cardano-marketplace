"use client";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { useContext, useState } from "react";
import { Context, ContextType } from "@/components/providers/wallet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BrowserWallet, hexToString } from "@meshsdk/core";
import { MarketplaceContract } from "../../../../contract/script";

interface Asset {
    policy_id: string;
    asset_name: string;
    metadata: any;
}

export default function Account() {
    const { wallet } = useContext<ContextType>(Context);
    const [price, setPrice] = useState<String>("");
    const { data, isLoading, isError } = useQuery({
        queryKey: ["assets", wallet],
        queryFn: async () => {
            const response = await axios.get(
                `${
                    window.location.origin
                }/api/account?wallet_address=${await wallet.getChangeAddress()}`,
                {
                    timeout: 7_000,
                }
            );
            return response.data;
        },
        enabled: !!wallet,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading assets</div>;
    }

    const sell = async function (
        policyId: string,
        assetName: string,
        price: number
    ) {
        if (wallet !== undefined) {
            console.log("sell");
            const marketplaceContract: MarketplaceContract =
                new MarketplaceContract({
                    wallet: wallet as BrowserWallet,
                });
            const unsignedTx: string = await marketplaceContract.sell({
                policyId: policyId,
                assetName: assetName,
                price: price * 1000000,
                amount: 1,
            });
            console.log(unsignedTx);
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            console.log(txHash);
        }
    };

    return (
        <div className="py-10">
            <div className="text-center text-3xl">My assets</div>
            <Separator className="my-4 bg-black" />
            <div className="grid grid-cols-4 gap-4">
                {data?.map((asset: Asset) => (
                    <Card
                        key={asset.policy_id + asset.asset_name}
                        className="overflow-hidden"
                    >
                        <CardHeader className="p-0 border-b">
                            {/* <Image
                                src={asset?.metadata?.image}
                                alt="NFT image"
                                quality={100}
                                width={1000}
                                height={1000}
                                className="h-60 object-contain bg-zinc-100"
                            /> */}
                        </CardHeader>
                        <CardContent className="px-4 py-2">
                            <div className="font-semibold">
                                {hexToString(asset.asset_name)}
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-end">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>Sell</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Make a sell</DialogTitle>
                                    </DialogHeader>
                                    <div>
                                        <div>
                                            <Label>Enter amount to sell</Label>
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
                                                await sell(
                                                    asset.policy_id,
                                                    asset.asset_name,
                                                    Number(price)
                                                );
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
