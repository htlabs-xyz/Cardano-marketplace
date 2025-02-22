"use client";
import { BrowserWallet } from "@meshsdk/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [wallets, setWallets] = useState<any[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(true);
    
    useEffect(() => {
        async function fetchWallets() {
            const availableWallets = await BrowserWallet.getAvailableWallets();
            setWallets(availableWallets);
        }
        fetchWallets();
    }, []);

    return (
        <div className="sticky inset-0  w-full border-b-2  shadow-sm py-3 px-10 bg-white">
            <div className="max-w-6xl flex justify-between items-center mx-auto">
                <div className="font-semibold text-2xl">
                    <Link href={"/"}>NFT Marketplace</Link>
                </div>
                <div className="flex items-center space-x-2">
                    {isConnected ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-3xl">
                                    Connect wallet
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Available wallets</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-4">
                                    {wallets?.map((wallet, key: number) => (
                                        <Button
                                            key={key}
                                            onClick={async () => {
                                                await BrowserWallet.enable(
                                                    wallet.id,
                                                    [95]
                                                );
                                                setIsConnected(true);
                                            }}
                                            className="w-full flex items-center justify-start"
                                        >
                                            <Image
                                                src={wallet?.icon}
                                                width={32}
                                                height={32}
                                                alt="eternal"
                                            />
                                            <span>{wallet.id}</span>
                                        </Button>
                                    ))}
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
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Link href={"/account"}>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>HT</AvatarFallback>
                            </Avatar>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
