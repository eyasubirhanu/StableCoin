// import * as utils from "lib/minting-utils";
import * as utils from "lib/gcoinmint";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";

import { Inter } from "@next/font/google";
// import { getStatus } from "../lib/minting-utils";
const inter = Inter({ subsets: ["latin"] });

export default function Mint() {
  const { lucid, account, showToaster, hideToaster } = useCardano();
  const name: string = "GCOINFT";
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);
  const [datum, setDatum] = useState<{ state: boolean; exchangeRate: bigint }>({
    state: false,
    exchangeRate: BigInt(0),
  });
  const [totalAmount, setTotalAmount] = useState(0n);
  const init = async () => {
    if (!lucid || !account?.address || !setMintAmount) return;
    utils.getDatumValue(lucid, name).then((r) => setDatum({ ...r }));
    utils.getAddressAda(lucid, name).then((r) => setTotalAmount(r));
  };
  useEffect(() => {
    init();
  }, [lucid, account?.address, mintAmount, burnAmount]);

  const mintNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !setMintAmount) return;

      const nftTx = await utils.mintGcoin(lucid, mintAmount, name);

      showToaster("Minted NFT", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not mint NFT", e.message);
      else if (typeof e === "string") showToaster("Could not mint NFT", e);
    }
  }, [lucid, account?.address, showToaster, mintAmount]);

  const burnNFT = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !burnAmount) return;

      const nftTx = await utils.burnGcoin(lucid, burnAmount, name);
      showToaster("Minted NFT", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not mint NFT", e.message);
      else if (typeof e === "string") showToaster("Could not mint NFT", e);
    }
  }, [lucid, account?.address, showToaster, burnAmount]);

  const canMint = useMemo(
    () => lucid && account?.address && mintAmount,
    [lucid, account?.address, mintAmount]
  );

  const canBurn = useMemo(
    () => lucid && account?.address && burnAmount,
    [lucid, account?.address, burnAmount]
  );
  // max-w-4xl m-auto
  return (
    <div className="text-center text-gray-900 dark:text-gray-100">
      <div className="absolute right-40 rounded-xl bg-sky-800 py-2  hover:opacity-80 duration-200 disabled:opacity-30 w-40 text-white">
        Total reserve of Ada ≈{Number(totalAmount) / 1000000} ₳
      </div>
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-2"
      >
        Cogito
      </h1>

      <div style={inter.style} className="my-4 text-center">
        A decentralized and AI-driven stable asset.
      </div>

      {/* <div className="text-left my-8"> */}
      {/* className="relative flex justify-center items-center w-full h-screen bg-slate-900 text-white flex-col" */}

      <div className="flex flex-row px-2.5 md:flex-row  justify-center w-full justify-around gap-4 place-content-center justify-center ">
        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-8 ">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Mint Gcoin token
          </div>

          <input
            className="block w-3/5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="message"
            placeholder="amount"
            value={mintAmount || ""}
            onChange={(e) => setMintAmount(Number(e.target.value))}
          />
          {/* </label> */}
          <div className="border-1 rounded-md ring my-10">
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              You will pay:{" "}
              {(mintAmount *
                (Number(datum.exchangeRate) +
                  Number(datum.exchangeRate) / 100)) /
                1000000}
              ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20 text-white  ">
              Fees: 1 ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              Total:{" "}
              {(mintAmount *
                (Number(datum.exchangeRate) +
                  Number(datum.exchangeRate) / 100)) /
                1000000 +
                1}{" "}
              ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              Exchange Rate ADA:{" "}
              {(Number(datum.exchangeRate) + Number(datum.exchangeRate) / 100) /
                1000000}{" "}
              ₳
            </div>
          </div>
          <button
            disabled={!canMint}
            className="border hover:bg-blue-800 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              mintNFT();
            }}
          >
            mint
          </button>
        </div>

        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-6">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Burn Gcoin token
          </div>
          <input
            className="block w-3/5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="message"
            placeholder="amount"
            value={burnAmount || ""}
            onChange={(e) => setBurnAmount(Number(e.target.value))}
          />

          <div className="border-1 rounded-md ring my-10">
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              You will get:{" "}
              {(burnAmount *
                (Number(datum.exchangeRate) -
                  Number(datum.exchangeRate) / 100)) /
                1000000}
              ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20 text-white  ">
              Fees: 1 ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              Total:{" "}
              {(burnAmount *
                (Number(datum.exchangeRate) -
                  Number(datum.exchangeRate) / 100)) /
                1000000 -
                1}{" "}
              ₳
            </div>
            <div className="block w-4/5  py-2.5 pl-7  px-2 pr-20  text-white  ">
              Exchange Rate ADA:{" "}
              {(Number(datum.exchangeRate) - Number(datum.exchangeRate) / 100) /
                1000000}{" "}
              ₳
            </div>
          </div>
          <button
            disabled={!canBurn}
            className="border hover:bg-blue-400 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-red-300 disabled:bg-red-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              burnNFT();
            }}
          >
            burn
          </button>
        </div>
      </div>
    </div>
  );
}







