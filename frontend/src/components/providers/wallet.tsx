"use client";

import { BrowserWallet, MeshWallet } from "@meshsdk/core";
import React, { createContext, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export type ContextType = {
    wallet: BrowserWallet | MeshWallet;
    connectWallet: (name: string) => Promise<void>;
};

export const Context = createContext<ContextType>(null!);

const ContextProvider = function ({ children }: Props) {
    const [wallet, setWallet] = useState<BrowserWallet | MeshWallet>(null!);
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const connectWallet = async function (name: string) {
        setWallet(await BrowserWallet.enable(name, [95]));
        setIsConnected(true);
    };

    return (
        <Context.Provider
            value={{
                wallet,
                connectWallet,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;
