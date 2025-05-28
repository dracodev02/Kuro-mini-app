"use client";
import { Input } from "@mui/material";
import { parseEther } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useWriteContract,
} from "wagmi";
import { YoloABI } from "~/abi/YoloABI";
import { Button } from "~/components/ui/Button";
import { PoolStatus, useKuro } from "~/context/KuroContext";
import { convertWeiToEther } from "~/utils/string";

const Deposit = () => {
  const { address: connectedAddress } = useAccount();
  const balance = useBalance({
    address: connectedAddress,
    blockTag: "latest",
    chainId: monadTestnet.id,
  });
  const [depositAmount, setDepositAmount] = useState<string>("0.1");
  const [minDepositAmount] = useState<number>(0.01);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const { poolStatus } = useKuro();

  const connectWallet = async () => {
    try {
      if (isConnected) {
        disconnect();
      } else {
        connect({ connector: connectors[0], chainId: monadTestnet.id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { writeContractAsync, isPending: isDepositing } = useWriteContract();

  const handleSubmit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(depositAmount) < minDepositAmount) {
      toast.warning("Deposit amount can't be less than " + minDepositAmount);
      return;
    }

    try {
      const res = writeContractAsync({
        abi: YoloABI,
        address: process.env.NEXT_PUBLIC_KURO_ADDRESS as `0x${string}`,
        functionName: "deposit",
        value: parseEther(depositAmount),
      });

      toast
        .promise(res, {
          pending: "Deposit processing..",
          success: "Deposit Success. 👌",
          error: "Deposit failed. 🤯",
        })
        .then(() => {});
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Deposit failed");
    }
    setDepositAmount("");
  };

  return (
    <div className="px-6 py-6 pt-6">
      <div
        className={`flex items-center justify-between ${
          isConnected ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        <p className="font-semibold opacity-50">Your Entries</p>
        <div className="flex items-center gap-2 rounded-sm border bg-[#8371E940] px-2 py-1 text-xs">
          Balance: <p>{convertWeiToEther(balance.data?.value || 0)} MON</p>
        </div>
      </div>
      <div
        className={`mb-6 ${
          isConnected ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        <Input
          className="placeholder:text-gray-500 border-none px-0 !text-[30px] font-semibold focus-visible:border-none focus-visible:ring-transparent !text-white"
          placeholder="0"
          type="number"
          value={depositAmount}
          onChange={(e: any) => {
            let rawValue = e.target.value;

            // Chỉ cho phép số và dấu thập phân
            if (!/^[0-9]*\.?[0-9]*$/.test(rawValue)) {
              return;
            }

            // Xử lý trường hợp nhập số 0 đầu tiên
            if (rawValue === "0" && depositAmount === "") {
              setDepositAmount("0");
              return;
            }

            // Xử lý trường hợp bắt đầu bằng dấu chấm
            if (rawValue.startsWith(".")) {
              rawValue = "0" + rawValue;
            }

            // Ngăn nhiều số 0 ở đầu (ví dụ: 00123)
            if (
              rawValue.length > 1 &&
              rawValue[0] === "0" &&
              rawValue[1] !== "."
            ) {
              rawValue = rawValue.substring(1);
            }

            // Giới hạn số chữ số thập phân là 6
            if (rawValue.includes(".")) {
              const parts = rawValue.split(".");
              if (parts[1] && parts[1].length > 6) {
                parts[1] = parts[1].substring(0, 6);
                rawValue = parts.join(".");
              }
            }

            setDepositAmount(rawValue);
          }}
        />
        <p className="mt-1 text-xs text-foreground opacity-50">
          Minimun Value: 0.01 MON
        </p>
      </div>
      {isConnected ? (
        <Button
          onClick={() => handleSubmit()}
          className="w-full"
          disabled={
            !depositAmount ||
            isDepositing ||
            (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
              poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
          }
        >
          Submit
        </Button>
      ) : (
        <Button onClick={() => connectWallet()} className="w-full">
          Connect wallet
        </Button>
      )}
    </div>
  );
};

export default Deposit;
