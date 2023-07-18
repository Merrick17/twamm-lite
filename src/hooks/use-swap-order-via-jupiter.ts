import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { isNil } from "ramda";

import { useWallet } from "@solana/wallet-adapter-react";
import useBlockchain from "src/contexts/solana-connection-context";
import useWalletPassThrough from "src/contexts/wallet-passthrough-context";
import useJupiterV4Api from "src/contexts/jupiter-v4-api-context";
import useTxRunner from "src/contexts/transaction-runner-context";
import useTwammLiteParams from "src/contexts/twamm-lite-params-context";
import type { Route } from "./use-swap-routes-from-jup";

const predictBestRoute = (routes: Route[]) => {
  const bestRoute = routes[0];
  return bestRoute;
};

const calculateComputeUnitPrice = (budget: number | undefined) => {
  if (isNil(budget)) return undefined;
  const maxUnitsBudget = 1400000;
  return Number.parseInt(
    String(((budget * LAMPORTS_PER_SOL) / maxUnitsBudget) * 1e6),
    10
  );
};

const verifyTransaction = async (tx: Transaction, owner: PublicKey) => {
  function checkKeys(t: Transaction, user: PublicKey) {
    const i = t.instructions.at(-1);
    const userAddress = user.toBase58();

    if (!i) throw new Error("Absent instructions");

    i.keys.forEach((key) => {
      if (key.isSigner && key.pubkey.toBase58() !== userAddress) {
        throw new Error("Owner addresses do not match");
      }
    });

    return t;
  }

  return checkKeys(tx, owner);
};

async function getFeeAccountAta(
  outputMint: string,
  endpoint: string,
  feeAccount: string
) {
  const connection = new Connection(endpoint);
  const feeAccountOwner = new PublicKey(feeAccount);
  const outputMintPubkey = new PublicKey(outputMint);
  const ata = await connection.getTokenAccountsByOwner(feeAccountOwner, {
    mint: outputMintPubkey,
  });
  return ata.value[0].pubkey.toString();
}

async function runLegacyTransaction(
  connection: Connection,
  signTransaction: (t: Transaction) => Promise<Transaction>,
  api: ReturnType<typeof useJupiterV4Api>,
  route: Route,
  userPublicKey: PublicKey,
  performanceFee: number | undefined,
  endpoint: string,
  FEE_ACCOUNT: string
) {
  const args = {
    route,
    computeUnitPriceMicroLamports: calculateComputeUnitPrice(performanceFee),
    asLegacyTransaction: true,
    userPublicKey: userPublicKey.toBase58(),
  };
  const { outputMint } = args.route.marketInfos[0];
  const feeAccount = await getFeeAccountAta(
    outputMint as string,
    endpoint,
    FEE_ACCOUNT
  );

  const { swapTransaction } = await api.v4SwapPost({
    route: args.route,
    computeUnitPriceMicroLamports: args.computeUnitPriceMicroLamports,
    asLegacyTransaction: args.asLegacyTransaction,
    userPublicKey: args.userPublicKey,
    feeAccount, // pass in ATA of tokenB
  });

  if (!swapTransaction) throw new Error("Could not fetch the transaction data");

  const rawTransaction = Buffer.from(swapTransaction, "base64");

  const transaction = Transaction.from(rawTransaction);

  await verifyTransaction(transaction, userPublicKey);

  await signTransaction(transaction);

  const txid = await connection.sendRawTransaction(transaction.serialize());

  await connection.confirmTransaction(txid);

  return txid;
}

export default () => {
  const { signTransaction } = useWallet();
  const { endpoint, feeAccount: FEE_ACCOUNT } = useTwammLiteParams();
  const { publicKey } = useWalletPassThrough();
  const { connection } = useBlockchain();
  const { commit, performanceFee } = useTxRunner();
  const apiV4 = useJupiterV4Api();

  const run = async (routes: Route[]) => {
    if (!publicKey || !signTransaction)
      throw new Error("Can not find the wallet");

    const route = predictBestRoute(routes);

    if (!route) throw new Error("Can not find the route");
    const result = await runLegacyTransaction(
      connection,
      signTransaction,
      apiV4,
      route,
      publicKey,
      !performanceFee ? undefined : performanceFee,
      endpoint,
      FEE_ACCOUNT
    );

    return result;
  };

  return {
    execute: async (routes: Route[]) => {
      const data = await commit(run(routes));
      return data;
    },
  };
};
