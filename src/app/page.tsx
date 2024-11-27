"use client";
import Image from "next/image";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { ConnectWallet, useAddress, useDisconnect } from "@thirdweb-dev/react";
import MiniGame from "./components/MiniGame";
import useTokenBalance from "./hooks/useTokenBalance";

export default function Home() {
  const address = useAddress();

  const { balance, refetch } = useTokenBalance(
    "0x52bde3c82232ff2de09aa90d318bf124ee4d58b7",
    address as string
  );

  const disconnect = useDisconnect();

  return (
    <main className="p-4 pb-10 max-h-[95vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-40">
          {address ? (
            <>
              <Button
                onClick={() => disconnect()}
                className="inline-flex items-center gap-2 rounded-md bg-white-700 py-3 px-6 text-sm/6 font-semibold text-grey shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white mr-10 py-20"
              >
                Disconnect: {shortenAddress(address)}
              </Button>
            </>
          ) : (
            <div className="flex flex-col mt-40 items-center justify-center text-white">
              <ConnectWallet />
              <Image
                alt="Loading Zombie gif"
                className="mt-40"
                src={"/zombinTree.gif"}
                width={200}
                height={200}
              />
            </div>
          )}
          {address && balance && (
            <Button className="inline-flex items-center gap-2 rounded-md bg-white-700 py-3 px-6 text-sm/6 font-semibold text-grey shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white py-20">
              <p>{balance} coins</p>
            </Button>
          )}
        </div>
        {address && <MiniGame refetch={refetch} />}
      </div>
    </main>
  );
}
