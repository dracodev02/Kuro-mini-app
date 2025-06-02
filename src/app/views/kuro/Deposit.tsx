"use client";
import { Input } from "@mui/material";
import { parseEther, parseUnits } from "ethers";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useWriteContract,
} from "wagmi";
import { ERC20ABI } from "~/abi/ERC20ABI";
import { YoloABIMultiToken } from "~/abi/YoloABI";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useAuth } from "~/context/AuthContext";
import { PoolStatus, useKuro } from "~/context/KuroContext";
import { SupportedTokenInfo } from "~/types/round";
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
  const {
    poolStatus,
    updateSupportedTokens,
    supportedTokens,
    getTokenSymbolByAddress,
  } = useKuro();
  const [selectedToken, setSelectedToken] = useState<SupportedTokenInfo | null>(
    null
  );
  const { writeContractAsync: depositToken, isPending: isDepositing } =
    useWriteContract();
  const { writeContractAsync: approveToken, isPending: isApproving } =
    useWriteContract();
  const [unlimitedApproval, setUnlimitedApproval] = useState(false);
  const [isLoadingApproval, setIsLoadingApproval] = useState(false);
  const { updateNativeBalance } = useAuth();
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

  const needsApproval = (): boolean => {
    if (
      !selectedToken ||
      selectedToken.address === "0x0000000000000000000000000000000000000000"
    ) {
      return false; // No approval needed for native MON
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return false;
    }

    try {
      const requiredAmount = parseUnits(depositAmount, selectedToken.decimals);
      const currentAllowance = selectedToken.allowance || BigInt(0);

      // If unlimited approval is enabled and we have a very large allowance, consider it sufficient
      if (unlimitedApproval) {
        // Check if we have unlimited approval (very large allowance)
        const unlimitedThreshold = parseUnits(
          "1000000000",
          selectedToken.decimals
        ); // 1B tokens
        return currentAllowance < unlimitedThreshold;
      }

      return currentAllowance < requiredAmount;
    } catch {
      return false;
    }
  };

  const handleApproval = async () => {
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoadingApproval(true);
      let amount: bigint;

      if (unlimitedApproval) {
        // Use maximum possible uint256 value for unlimited approval
        amount = BigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      } else {
        // Use exact amount needed
        amount = parseUnits(depositAmount, selectedToken.decimals);
      }

      const res = approveToken({
        abi: ERC20ABI,
        address: selectedToken.address as `0x${string}`,
        functionName: "approve",
        args: [process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS, amount],
      });

      await toast
        .promise(res, {
          pending: "Approval processing..",
          success: "Approval Success. 👌",
          error: "Approval failed. 🤯",
        })
        .then(async () => {
          await updateNativeBalance();
          await updateSupportedTokens();
        });
    } catch (error) {
      console.error("Error approving token:", error);
      toast.error("Approval failed");
    } finally {
      setIsLoadingApproval(false);
    }
  };

  const handleDeposit = async () => {
    if (!selectedToken) {
      toast.error("Please select a token");
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (
      parseFloat(depositAmount) <
      parseFloat(convertWeiToEther(selectedToken.minDeposit))
    ) {
      toast.warning(
        "Deposit amount can't be less than " +
          convertWeiToEther(selectedToken.minDeposit)
      );
      return;
    }

    if (
      parseFloat(depositAmount) >
      parseFloat(convertWeiToEther(selectedToken.balance))
    ) {
      toast.warning("You don't have enough balance to deposit");
      return;
    }

    try {
      let value = BigInt(0);
      let amountDepositing = BigInt(0);

      if (
        selectedToken.address === "0x0000000000000000000000000000000000000000"
      ) {
        // Native MON deposit
        value = parseEther(depositAmount);
        amountDepositing = BigInt(0); // Amount parameter should be 0 for MON
      } else {
        // ERC20 token deposit
        amountDepositing = parseUnits(depositAmount, selectedToken.decimals);
        value = BigInt(0); // No native value for ERC20 deposits
      }

      const res = depositToken({
        abi: YoloABIMultiToken,
        address: process.env
          .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
        functionName: "deposit",
        args: [selectedToken.address as `0x${string}`, amountDepositing],
        value: value,
      });

      toast
        .promise(res, {
          pending: "Deposit processing..",
          success: "Deposit Success. 👌",
          error: "Deposit failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();
        });
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error("Deposit failed");
    }
  };

  useEffect(() => {
    if (supportedTokens.length > 0) {
      if (selectedToken) {
        const selectedIndex = supportedTokens.find(
          (token) =>
            token.address.toLowerCase() === selectedToken.address.toLowerCase()
        );
        if (selectedIndex) {
          setSelectedToken(selectedIndex);
        } else {
          setSelectedToken(supportedTokens[0]);
        }
      } else {
        setSelectedToken(supportedTokens[0]);
      }
    }
  }, [supportedTokens]);

  return (
    <div className="px-6 py-6 pt-6">
      <div
        className={`flex items-center justify-between ${
          isConnected ? "" : "opacity-50 pointer-events-none"
        }`}
      >
        <p className="font-semibold opacity-50">Your Entries</p>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm border bg-[#8371E940] px-2 py-1 text-xs transition-all hover:bg-[#8371E980]">
              <div className="flex flex-col gap-1 text-start font-medium">
                <span className="text-xs">
                  Balance:{" "}
                  {selectedToken
                    ? convertWeiToEther(selectedToken.balance) +
                      " " +
                      getTokenSymbolByAddress(selectedToken?.address)
                    : 0}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="flex flex-col gap-2 bg-[#8371E940] backdrop-blur-md"
              align="start"
            >
              {supportedTokens.length > 0 &&
                selectedToken &&
                supportedTokens.map((token) => (
                  <DropdownMenuItem
                    className={
                      token.address.toLowerCase() ===
                      selectedToken.address.toLowerCase()
                        ? "bg-primary"
                        : "bg-transparent"
                    }
                    onClick={() => setSelectedToken(token)}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <div className="flex flex-col">
                        <span>{getTokenSymbolByAddress(token.address)}</span>
                      </div>
                    </div>
                    {token.address.toLowerCase() ===
                      selectedToken?.address.toLowerCase() && (
                      <Check className="ml-auto text-white" />
                    )}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="flex justify-between items-center">
          <p className="mt-1 text-xs text-foreground opacity-50">
            Minimun Value: 0.01 MON
          </p>
          {selectedToken?.address !==
            "0x0000000000000000000000000000000000000000" &&
            needsApproval() && (
              <div className="flex items-center gap-3">
                <Switch
                  id="enable-feature"
                  checked={unlimitedApproval}
                  onCheckedChange={() => setUnlimitedApproval((prev) => !prev)}
                />
                <Label htmlFor="enable-feature" className="text-xs">
                  Unlimited Approval
                </Label>
              </div>
            )}
        </div>
      </div>
      {isConnected ? (
        needsApproval() ? (
          <Button
            onClick={handleApproval}
            className="w-full max-w-full bg-warning/80 !text-black  hover:bg-warning/50"
            disabled={!depositAmount || isLoadingApproval}
          >
            {isLoadingApproval ? "Approving..." : "Approve"}
          </Button>
        ) : (
          <Button
            onClick={handleDeposit}
            className="w-full max-w-full"
            disabled={
              !depositAmount ||
              isDepositing ||
              (poolStatus !== PoolStatus.WAIT_FOR_FIST_DEPOSIT &&
                poolStatus !== PoolStatus.DEPOSIT_IN_PROGRESS)
            }
          >
            Submit
          </Button>
        )
      ) : (
        <Button onClick={() => connectWallet()} className="w-full">
          Connect wallet
        </Button>
      )}
    </div>
  );
};

export default Deposit;
