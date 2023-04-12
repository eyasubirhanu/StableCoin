import { Lucid,
     MintingPolicy, 
     PolicyId, 
     TxHash,
     Unit, 
    //  utf8ToHex ,
     fromText,
     getAddressDetails,
     Script,
     Redeemer,
     Data,
     Constr,
     Address} from "lucid-cardano"
import scripts from "../assets/scripts.json";
interface Options {
  lucid: Lucid
  address: string
  name: string
}

const { Mint, handlerContract,NFT } = scripts;

const handlerScript: Script = {
    type: "PlutusV1",
    script: handlerContract,
  };

const mintingPolicyScript: MintingPolicy = {
  type: "PlutusV1",
  script: Mint,
};


const nftPolicyScript: MintingPolicy = {
    type: "PlutusV1",
    script: NFT,
  };
  

// export declare function fromText(text: string): string;
// fully qualified asset name, hex encoded policy id + name
const getUnit = (policyId: PolicyId, name: string): Unit => policyId + fromText(name)


const HandlerDatum = Data.Object({
    state: Data.Boolean,
    exchangeRate: Data.BigInt,
  });

  interface d {
    state: boolean;
    exchangeRate: bigint;
  }

  
  const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
    const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)
  
    return policyId
  }
  
  export const findPubKeyHash = async (lucid:Lucid) => {
    const walletAddr = await lucid.wallet.address();
  
    const details = await getAddressDetails(walletAddr);
    if (!details) throw new Error("Spending script details not found");
    const pkh = details.paymentCredential?.hash;
    if (!pkh) throw new Error("Spending script utxo not found");
  
    return pkh;
  };
  

  const findUtxo = async (lucid:Lucid,addr: Address , nftId: PolicyId, name: string) => {
    
    const utxos = await lucid.utxosAt(addr);
    console.log(await lucid.utxosAt(addr));
  
    const utxo = utxos.filter(
      (utxo) => utxo.assets[getUnit(nftId,name)]
    );
    console.log(utxo, "utxos");
    return utxo;
  };


  export async function getDatumValue(lucid: Lucid, name: string) {
    // await wait(10000);
    
    const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
    const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
    const utxos = await findUtxo(lucid, handlerAddress, nftId, name);
    const datum = await lucid.datumOf(utxos[0]);
    const datumValue: d = Data.from(datum, HandlerDatum);
    return datumValue;
  }
  
  export async function getAddressAda(lucid: Lucid, name: string) {
    const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
    const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
    const utxos = await findUtxo(lucid, handlerAddress, nftId, name);
    const lovelace = utxos.reduce((acc, utxo) => acc + utxo.assets.lovelace, 0n);
    return lovelace;
  }

  const redeemerMint = Data.to(new Constr(0, [])) as Redeemer;
  const redeemerUse = Data.to(new Constr(1, [])) as Redeemer;



  export const mintGcoin = async (lucid:Lucid,mintAmount: number,name: string) => {
    
    const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
    const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
    const mintPolicyId: PolicyId = getPolicyId(lucid, mintingPolicyScript);
    const utxo = await findUtxo(lucid,handlerAddress,nftId,name);
    const datum = await lucid.datumOf(utxo[0]);
    if (!datum) throw new Error("Spending script datumHash not found");
    const unhashDatum: d = Data.from(datum, HandlerDatum);
    let assets = { ...utxo[0].assets };
    const mintrate = unhashDatum.exchangeRate + unhashDatum.exchangeRate / 100n;
    assets.lovelace += BigInt(mintAmount) * mintrate;
    const unit: Unit = mintPolicyId+ fromText("GCOIN");
    const addr = await lucid.wallet.address();
    const tx = await lucid
      .newTx()
      .collectFrom(utxo, redeemerUse)
      .payToContract(handlerAddress, { asHash: datum}, assets)
      .payToAddress(addr, { [unit]: BigInt(mintAmount) })
      .mintAssets(
        { [unit]: BigInt(mintAmount) },
        Data.to(new Constr(0, [BigInt(mintAmount)])) as Redeemer
      )
      .attachMintingPolicy(mintingPolicyScript)
      .attachSpendingValidator(handlerScript)
      .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
  };

  
  export const burnGcoin = async (
    lucid: Lucid,
    burnAmount: number,
    name: string
  ) => {
    const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
    const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
    const mintPolicyId: PolicyId = getPolicyId(lucid, mintingPolicyScript);
    const burnamount = Math.abs(burnAmount);
    const utxo = await findUtxo(lucid, handlerAddress, nftId, name);
    const datum  = await lucid.datumOf(utxo[0]);
    const unhashDatum: d = Data.from(datum, HandlerDatum);
    let assets = { ...utxo[0].assets };
    const burnrate = unhashDatum.exchangeRate - unhashDatum.exchangeRate / 100n;
    const pay = BigInt(burnamount) * burnrate;
    assets.lovelace -= pay
  
    const unit: Unit = mintPolicyId +  fromText("GCOIN");
    const addr: Address = await lucid.wallet.address();
    const pkh = await findPubKeyHash(lucid);
  
    const tx = await lucid
      .newTx()
      .collectFrom(utxo, redeemerUse)
      .payToContract(handlerAddress, { asHash: datum }, assets)
      .payToAddress(addr, { lovelace: pay })
      .mintAssets(
        { [unit]: BigInt(-burnamount) },
        Data.to(new Constr(1, [BigInt(-burnamount), pkh])) as Redeemer
      )
      .attachMintingPolicy(mintingPolicyScript)
      .attachSpendingValidator(handlerScript)
      .addSignerKey(pkh)
      .complete();
  
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash;
  };
  const wait = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));




    export const update = async ( 
      lucid: Lucid,
      exchangeRateAmount: BigInt,
      stateValue:boolean,
      name: string
    ) => {
      const d = {
        state: stateValue,
        exchangeRate: exchangeRateAmount,
      };
      
      const datum = Data.to(d, HandlerDatum);
      const handlerAddress: Address = lucid.utils.validatorToAddress(handlerScript);
      const nftId: PolicyId = getPolicyId(lucid, nftPolicyScript);
      const pkh = await findPubKeyHash(lucid);
      const utxo = await findUtxo(lucid, handlerAddress, nftId, name);
      const unit: Unit = nftId + fromText("GNFT");
      const tx = await lucid
        .newTx()
        .collectFrom(utxo, redeemerMint)
        .payToContract(handlerAddress, { asHash: datum }, { [unit]: BigInt(1) })
        .attachSpendingValidator(handlerScript)
        .addSignerKey(pkh)
        .complete();
    
      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();
    
      return txHash;
    };
    