"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Context, ContextType } from "@/components/providers/wallet";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { hexToString } from "@meshsdk/core";

export default function Home() {
    const { wallet } = useContext<ContextType>(Context);
    

    const { data, isLoading, isError } = useQuery({
        queryKey: ["assets"],
        queryFn: async () => {
            const response = await axios.get(
                `${window.location.origin}/api/contract`,
                {
                    timeout: 7_000,
                }
            );
            return response.data;
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading assets</div>;
    }
    return (
        <div className="py-10">
            <div className="text-center text-3xl">List NFTs</div>
            <Separator className="my-4 bg-black" />
            <div className="grid grid-cols-4 gap-4">
                {data?.map(function (asset: any, key: number) {
                    return (
                        <Card key={key} className="overflow-hidden">
                            <CardHeader className="p-0 border-b">
                                {/* <Image
                                    src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
                                    alt="NFT image"
                                    quality={100}
                                    width={1000}
                                    height={1000}
                                    className="h-60 object-contain bg-zinc-100"
                                /> */}
                            </CardHeader>
                            <CardContent className="px-4 py-2">
                                <div className="font-semibold">
                                    {hexToString(asset?.assetName)}
                                </div>
                                <div className="text-sm">
                                    Price: {asset?.price / 1000000} ₳
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-end">
                                <Button size={"sm"}>
                                    <Link
                                        href={`/assets/${
                                            asset?.policyId + asset?.assetName
                                        }?policy_id=${
                                            asset?.policyId
                                        }&asset_name=${asset?.assetName}`}
                                    >
                                        Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
