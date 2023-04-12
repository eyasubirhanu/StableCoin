// import * as utils from "lib/minting-utils";
import * as utils from "lib/gcoinmint";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";

import { Inter } from "@next/font/google";
// import { getStatus } from "../lib/minting-utils";
const inter = Inter({ subsets: ["latin"] });

export default function Mint() {
  const { lucid, account, showToaster, hideToaster } = useCardano();
  const name: string = "GNFT";
  const [stateValue, setStateValue] = useState(Boolean)
  const [exchangeRateAmount, setExchangeAmount] = useState(BigInt(0))
  const upDate = useCallback(async () => {
    try {
      if (!lucid || !account?.address || !setExchangeAmount || !setStateValue) return;

      const nftTx = await utils.update(lucid, exchangeRateAmount,stateValue, name);

      showToaster("Updated", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not update", e.message);
      else if (typeof e === "string") showToaster("Could not update", e);
    }
  }, [lucid, account?.address, showToaster, stateValue,exchangeRateAmount]);

 
  const canMint = useMemo(
    () => lucid && account?.address && stateValue && exchangeRateAmount,
    [lucid, account?.address, stateValue,exchangeRateAmount]
  );

  return (
    <div className="text-center text-gray-900 dark:text-gray-100">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-2"
      >
        Only for super user 
      </h1>

      <div style={inter.style} className="my-4 text-center">
        {/* A decentralized and AI-driven stable asset. */}
      </div>

      {/* <div className="text-left my-8"> */}
      {/* className="relative flex justify-center items-center w-full h-screen bg-slate-900 text-white flex-col" */}

      <div className="flex flex-row px-2.5 md:flex-row  justify-center w-full justify-around gap-4 place-content-center justify-center ">
        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-8 ">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Update Handler 
          </div>

          <input
            className="block w-3/5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="message"
            placeholder="amount"
            // value={exchangeRateAmount || ""}
            onChange={(e) => setExchangeAmount(BigInt(e.target.value))}
          />
            <input
            className="block w-3/5 mt-5 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="message"
            placeholder="true/false"
            // value={stateValue || ""}
            onChange={(e) => setStateValue(Boolean(e.target.value))}
          />
          {/* </label> */}
          <button
            disabled={!canMint}
            className="border hover:bg-blue-800 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              upDate();
            }}
          >
            update
          </button>
        </div>

      </div>
    </div>
  );
}


  

// import { useTransaction } from "hooks/use-transaction"
// import { useEffect } from "react"
// import { useCardano } from "use-cardano"

// import { Inter } from "@next/font/google"

// const inter = Inter({ subsets: ["latin"] })

// export default function Transact() {
//   const { isValid, hideToaster, showToaster } = useCardano()
//   const tx = useTransaction()

//   useEffect(() => {
//     if (!tx.successMessage) {
//       hideToaster
//     } else {
//       showToaster("Success!", tx.successMessage)
//     }
//   }, [tx.successMessage, hideToaster, showToaster])

//   return (
//     <div className="text-center max-w-4xl m-auto text-gray-900 dark:text-gray-100">
//       <h1
//         style={inter.style}
//         className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl"
//       >
//         Transact
//       </h1>

//       <div style={inter.style} className="my-4 text-center">
//         Using Lucid, we can easily send transactions on the Cardano blockchain.
//       </div>

//       <div className="text-left my-8">
//         <div className="my-4">
//           <label className="flex flex-col w-100">
//             <span className="text-sm lowercase mb-1">To Account</span>

//             <input
//               className="rounded py-1 px-2 text-gray-800 border"
//               type="text"
//               placeholder="addr..."
//               value={tx.toAccount}
//               onChange={(e) => tx.setToAccount(e.target.value?.toString())}
//             />
//           </label>
//         </div>

//         <div className="my-4">
//           <label className="flex flex-col w-40">
//             <span className="text-sm lowercase mb-1">Lovelace</span>

//             <input
//               className="rounded py-1 px-2 text-gray-800 border"
//               type="number"
//               min="0"
//               step="1000"
//               name="amount"
//               value={tx.lovelace}
//               onChange={(e) => tx.setLovelace(e.target.value?.toString())}
//             />
//           </label>
//         </div>

//         <div className="my-4">
//           <button
//             className="border hover:bg-blue-400 text-white my-4 w-40 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-200 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
//             disabled={!tx.canTransact || !!tx.error}
//             onClick={tx.sendTransaction}
//           >
//             Send
//           </button>

//           <div className="italic">
//             {isValid === false ? (
//               <p>
//                 <small>connect a wallet to send a transaction</small>
//               </p>
//             ) : !tx.successMessage && !tx.error && !tx.canTransact ? (
//               <p>
//                 <small>specify a lovelace amount and account to send a transaction</small>
//               </p>
//             ) : tx.error ? (
//               <p>
//                 <small>{tx.error.message}</small>
//               </p>
//             ) : null}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
