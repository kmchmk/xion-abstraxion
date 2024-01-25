"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";
import "@burnt-labs/ui/styles.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

// Example XION counter contract
const deployedContractAddress = "xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud";

export default function Page(): JSX.Element {
  // Abstraxion hooks
  const { data: account, isConnected } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();

  // General state hooks
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState<ExecuteResult | undefined>(
    undefined
  );

  const blockExplorerUrl = `https://explorer.burnt.com/xion-testnet-1/tx/${executeResult?.transactionHash}`;

  // useEffect(() => {
  //   if (account) {
  //     console.log("account", account);
  //   }
  // }, [account]);

  // useEffect(() => {
  //   console.log("isConnected", isConnected);
  // }, [isConnected]);

  useEffect(() => {
    if (client) {
      console.log("client", client);
      console.log("client.granteeAddress", client.granteeAddress);
      console.log("client.granterAddress", client.granterAddress);
    }
  }, [client]);

  async function incrementCount() {
    setLoading(true);
    const msg = { increment: {} };

    try {
      const executionResponse = await client?.execute(
        client.granterAddress,
        deployedContractAddress,
        msg,
        "auto"
      );
      console.log("executionResponse", executionResponse);
      setExecuteResult(executionResponse);
      getCount();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function getCount() {
    setLoading(true);
    const msg = { get_count: {} };

    try {
      const queryResponse = await client?.queryContractSmart(
        deployedContractAddress,
        msg
      );
      console.log("queryResponse", queryResponse);
      alert(`Count: ${queryResponse.count}`);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function getBalances() {
    setLoading(true);

    try {
      const granteeBalance = await client?.getBalance(
        client.granteeAddress,
        "uxion"
      );
      console.log("granteeBalance", granteeBalance);

      const granterBalance = await client?.getBalance(
        client.granterAddress,
        "uxion"
      );

      console.log("granterBalance", granterBalance);
      alert(
        `Grantee: ${granteeBalance?.amount} ${granteeBalance?.denom}\nGranter: ${granterBalance?.amount} ${granterBalance?.denom}`
      );
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter text-white">
        COUNTER EXAMPLE
      </h1>
      <Button
        fullWidth
        onClick={() => {
          setIsOpen(true);
        }}
        structure="base"
      >
        {account.bech32Address ? (
          <div className="flex items-center justify-center">VIEW ACCOUNT</div>
        ) : (
          "CONNECT"
        )}
      </Button>
      {client ? (
        <Button
          disabled={loading}
          fullWidth
          onClick={() => {
            void incrementCount();
          }}
          structure="base"
        >
          {loading ? "LOADING..." : "Increment Count"}
        </Button>
      ) : null}
      {client ? (
        <Button
          disabled={loading}
          fullWidth
          onClick={() => {
            void getCount();
          }}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Count"}
        </Button>
      ) : null}
      {client ? (
        <Button
          disabled={loading}
          fullWidth
          onClick={() => {
            void getBalances();
          }}
          structure="base"
        >
          {loading ? "LOADING..." : "Get Balances"}
        </Button>
      ) : null}
      <Abstraxion
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
      {client && (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Grantee:
            </span>
            <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
              {client.granteeAddress}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Granter:
            </span>
            <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
              {client.granterAddress}
            </span>
          </div>
        </div>
      )}
      {executeResult ? (
        <div className="flex flex-col rounded border-2 border-black p-2 dark:border-white">
          <div className="mt-2">
            <p className="text-zinc-500">
              <span className="font-bold">Transaction Hash</span>
            </p>
            <Link
              className="text-black underline visited:text-purple-600 dark:text-white"
              href={blockExplorerUrl}
              target="_blank"
            >
              {executeResult.transactionHash}
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
