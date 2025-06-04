"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket as SocketIOClient } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAccount, useWriteContract } from "wagmi";

import { useAuth } from "./AuthContext";
import {
  KuroParticipant,
  KuroWinnerAnnounced,
  Round,
  RoundHistoryResponse,
} from "~/types/round";
import useClaimKuroRound from "~/app/api/useClaimKuroRound";
import { useGetKuroHistory } from "~/app/api/useGetKuroHistory";
import { YoloABI, YoloABIMultiToken } from "~/abi/YoloABI";

export enum TimeEnum {
  _5SECS = 5 * 1000,
  _9SECS = 9 * 1000,
  _10SECS = 10 * 1000,
  _15SECS = 15 * 1000,
  _30SECS = 30 * 1000,
  _10MINS = 10 * 60 * 1000,
  _15MINS = 15 * 60 * 1000,
  _20MINS = 20 * 60 * 1000,
  _30MINS = 30 * 60 * 1000,
  _1HOUR = 60 * 60 * 1000,
}

export enum PoolStatus {
  WAITING_FOR_NEXT_ROUND = "WAITING FOR NEXT ROUND",
  WAIT_FOR_FIST_DEPOSIT = "WAIT FOR FIRST DEPOSIT",
  DEPOSIT_IN_PROGRESS = "DEPOSIT IN PROGRESS",
  DRAWING_WINNER = "DRAWING WINNER",
  SPINNING = "SPINNING",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
  SHOWING_WINNER = "SHOWING WINNER",
}

export enum KuroStatus {
  NONE = 0,
  OPEN = 1,
  DRAWING = 2,
  DRAWN = 3,
  CANCELLED = 4,
}

// Định nghĩa các kiểu dữ liệu
export interface Participant {
  address: string;
  deposit: string;
}

export interface KuroData {
  roundId: string;
  status: number;
  startTime: number;
  endTime: number;
  drawnAt: number;
  numberOfParticipants: number;
  winner: string;
  totalValue: string;
  totalEntries: string;
  participants: KuroParticipant[];
  isShowingWinner: boolean;
  remainingTime?: number;
  isHistoricalRound?: boolean;
  currentRoundId?: string;
  error?: string;
}

export interface WinnerData {
  roundId: number;
  winner: string;
  drawnAt: number;
  totalValue: string;
  participants: KuroParticipant[];
}

interface KuroContextProps {
  kuroData: KuroData | null;
  isConnected: boolean;
  isShowingWinner: boolean;
  winnerData: WinnerData | null;
  connectToSocket: () => void;
  disconnectFromSocket: () => void;
  subscribeToRound: (roundId: number) => void;
  formatEther: (value: string) => string;
  remainingWinnerTime: number;
  reconnectSocket: () => void;
  handleClaimPrizes: (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string
  ) => Promise<void>;
  handleWithdraw: (
    roundId: number,
    kuroContractAddress?: string
  ) => Promise<void>;
  poolStatus: PoolStatus;
  setPoolStatus: (status: PoolStatus) => void;

  allHistories: RoundHistoryResponse<Round> | null;
  myWinHistories: RoundHistoryResponse<Round> | null;
  refetchHistories: (
    page?: number,
    limit?: number,
    type?: "all" | "youWin"
  ) => Promise<void>;
  isFetchingKuroHistory: boolean;
}

interface KuroProviderProps {
  children: ReactNode;
}

// Tạo context
const KuroContext = createContext<KuroContextProps | undefined>(undefined);

// Format Wei thành Ether
const formatEther = (value: string): string => {
  if (!value) return "0";

  try {
    const wei = BigInt(value);
    const divisor = BigInt(10 ** 18);
    const integerPart = wei / divisor;
    const fractionalPart = wei % divisor;

    // Định dạng phần thập phân
    let fractionalStr = fractionalPart.toString().padStart(18, "0");
    // Loại bỏ số 0 ở cuối
    fractionalStr = fractionalStr.replace(/0+$/, "");

    if (fractionalStr) {
      return `${integerPart}.${fractionalStr}`;
    } else {
      return `${integerPart}`;
    }
  } catch (error) {
    console.error("Error formatting ether value:", error);
    return "0";
  }
};

export const KuroProvider: React.FC<KuroProviderProps> = ({ children }) => {
  const { address } = useAccount();

  const { isSyncMessage, signMessageWithSign, nativeBalance } = useAuth();
  const [socket, setSocket] = useState<SocketIOClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [kuroData, setKuroData] = useState<KuroData | null>(null);
  const [isShowingWinner, setIsShowingWinner] = useState<boolean>(false);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [remainingWinnerTime, setRemainingWinnerTime] = useState<number>(0);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [allHistories, setAllHistories] =
    useState<RoundHistoryResponse<Round> | null>(null);
  const [poolStatus, setPoolStatus] = useState(
    PoolStatus.WAIT_FOR_FIST_DEPOSIT
  );
  const [myWinHistories, setMyWinHistories] =
    useState<RoundHistoryResponse<Round> | null>(null);
  const { updateSupportedTokens } = useAuth();

  // Thêm state để theo dõi các vòng đã thông báo người thắng
  const [announcedRounds, setAnnouncedRounds] = useState<Set<number>>(
    new Set()
  );

  const { writeContractAsync, isPending: isDepositing } = useWriteContract();
  const { writeContractAsync: claimKuroMultiToken, isPending: isClaiming } =
    useWriteContract();
  const { writeContractAsync: withdrawMultiToken, isPending: isWithdrawing } =
    useWriteContract();

  const _claimKuroRound = useClaimKuroRound();

  // URL của server WebSocket
  const socketServerUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

  const { mutateAsync: mutateAsyncHistory, isPending: isFetchingKuroHistory } =
    useGetKuroHistory();

  const handleClaimPrizes = async (
    roundId: number,
    userDepositIndices: bigint[],
    kuroContractAddress?: string
  ) => {
    if (userDepositIndices.length == 0) {
      toast.error("No prizes to claim");
      return;
    }

    if (!isSyncMessage) {
      toast.info("You need to sign first before claiming prizes");
      await signMessageWithSign();
    }

    try {
      let res;

      if (kuroContractAddress) {
        // new contract address
        if (
          kuroContractAddress.toLowerCase() ===
          process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS?.toLowerCase()
        ) {
          res = claimKuroMultiToken({
            abi: YoloABIMultiToken,
            address: process.env
              .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
            functionName: "claimPrizes",
            args: [
              {
                roundId: BigInt(roundId),
                depositIndices: userDepositIndices.map((amount) =>
                  BigInt(amount)
                ),
              },
            ],
          });
        } else {
          toast.error("Invalid contract address");
          return;
        }
      } else {
        // old contract address
        res = writeContractAsync({
          abi: YoloABI,
          address: process.env.NEXT_PUBLIC_KURO_ADDRESS as `0x${string}`,
          functionName: "claimPrizes",
          args: [
            {
              roundId: BigInt(roundId),
              depositIndices: userDepositIndices.map((amount) =>
                BigInt(amount)
              ),
            },
          ],
        });
      }

      toast
        .promise(res, {
          pending: "Claim processing..",
          success: "Claim Success. 👌",
          error: "Claim failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();

          _claimKuroRound
            .mutateAsync({
              roundId: roundId,
              txHash: txHash,
            })
            .then(() => {
              refetchHistories();
            });
        });
    } catch (error) {
      console.error("Error claiming prizes:", error);
      toast.error("Failed to claim prizes");
    }
  };

  const handleWithdraw = async (
    roundId: number,
    kuroContractAddress?: string
  ) => {
    if (!isSyncMessage) {
      toast.info("You need to sign first before Withdraw prizes");
      await signMessageWithSign();
    }

    try {
      let res;

      if (kuroContractAddress) {
        // new contract address
        if (
          kuroContractAddress.toLowerCase() ===
          process.env.NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS?.toLowerCase()
        ) {
          res = withdrawMultiToken({
            abi: YoloABIMultiToken,
            address: process.env
              .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
            functionName: "withdrawDeposits",
            args: [
              {
                roundId: BigInt(roundId),
                depositIndices: [BigInt(0)],
              },
            ],
          });
        } else {
          toast.error("Invalid contract address");
          return;
        }
      } else {
        // old contract address
        res = writeContractAsync({
          abi: YoloABI,
          address: process.env.NEXT_PUBLIC_KURO_ADDRESS as `0x${string}`,
          functionName: "withdrawDeposits",
          args: [
            {
              roundId: BigInt(roundId),
              depositIndices: [BigInt(0)],
            },
          ],
        });
      }

      toast
        .promise(res, {
          pending: "Withdraw processing..",
          success: "Withdraw Success. 👌",
          error: "Withdraw failed. 🤯",
        })
        .then((txHash) => {
          updateSupportedTokens();
          _claimKuroRound
            .mutateAsync({
              roundId: roundId,
              txHash: txHash,
            })
            .then(() => {
              refetchHistories();
            });
        });
    } catch (error) {
      console.error("Error withdraw prizes:", error);
      toast.error("Failed to withdraw prizes");
    }
  };

  const refetchHistories = async (
    page?: number,
    limit?: number,
    type?: "all" | "youWin"
  ) => {
    if (type === "all" || !type) {
      const allHistoriesData = await mutateAsyncHistory({
        page: page,
        type: "all",
        limit: limit,
      });

      if (allHistoriesData.success) {
        setAllHistories(allHistoriesData);
      }
    }

    if (type === "youWin" || !type) {
      const myWinHistoriesData = await mutateAsyncHistory({
        page: page,
        type: "youWin",
        limit: limit,
        address: address,
      });

      if (myWinHistoriesData.success) {
        setMyWinHistories(myWinHistoriesData);
      }
    }
  };

  // Hàm kết nối tới WebSocket server
  const connectToSocket = useCallback(() => {
    try {
      if (socket) {
        socket.disconnect();
      }

      if (reconnectAttempts >= 5) {
        toast.error(
          "Maximum reconnection attempts reached (5). Please try again later."
        );
        return;
      }

      const newSocket = io(socketServerUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to socket server");
        setIsConnected(true);
        setReconnectAttempts(0);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
        setReconnectAttempts((prev) => prev + 1);
        toast.error(
          `Connection error: ${error.message}. Attempt ${
            reconnectAttempts + 1
          }/5`
        );
      });

      newSocket.on("reconnect_failed", () => {
        console.error("Socket reconnection failed after 5 attempts");
        toast.error(
          "Failed to reconnect after 5 attempts. Please try again later."
        );
        setReconnectAttempts(5);
      });

      newSocket.on("reconnect_attempt", (attempt) => {
        console.log(`Reconnection attempt ${attempt}/5`);
        if (attempt > 5) {
          newSocket.disconnect();
          return;
        }
        toast.info(`Attempting to reconnect: ${attempt}/5`);
      });

      // Lắng nghe cập nhật dữ liệu Kuro từ server
      newSocket.on("kuroUpdate", (data: KuroData) => {
        // console.log("Received Kuro update:", data);

        // SPINNING or SHOWING_WINNER
        if (
          poolStatus === PoolStatus.SPINNING ||
          poolStatus === PoolStatus.SHOWING_WINNER
        ) {
          console.log(
            "Ignoring kuroUpdate due to SPINNING or SHOWING_WINNER state"
          );
          return;
        }

        if (data.error && data.error === "No data available") {
          console.log(
            `Ignoring kuroUpdate with no data available for round ${data.roundId}`
          );
          // resetStates();
          return;
        } else {
          setKuroData({
            ...data,
            endTime: data.endTime - TimeEnum._5SECS / 1000,
          });

          // DRAWING
          if (
            data.startTime > 0 &&
            data.endTime > 0 &&
            data.endTime - Date.now() / 1000 < 0
          ) {
            return;
          }

          // OPEN FOR DEPOSIT
          if (data.startTime === 0 && data.endTime === 0) {
            setPoolStatus(PoolStatus.WAIT_FOR_FIST_DEPOSIT);
          }

          // DEPOSIT_IN_PROGRESS
          if (data.startTime > 0 && data.endTime > 0) {
            setPoolStatus(PoolStatus.DEPOSIT_IN_PROGRESS);
          }
        }
      });

      // Lắng nghe sự kiện winnerAnnounced
      newSocket.on("winnerAnnounced", (eventData: any) => {
        console.log("Winner announced event received:", eventData);

        const { data } = eventData;
        const roundId = Number(data.roundId);

        // Đánh dấu vòng này đã được thông báo người thắng
        setAnnouncedRounds((prev) => {
          const newSet = new Set(prev);
          newSet.add(roundId);
          return newSet;
        });

        // Lưu thông tin người thắng
        setWinnerData({
          roundId: roundId,
          winner: data.winner,
          drawnAt: data.drawnAt,
          totalValue: data.totalValue,
          participants: data.participants || [],
        });

        setPoolStatus(PoolStatus.SPINNING);
      });

      // Lắng nghe sự kiện vòng mới
      newSocket.on("newRound", (eventData: any) => {
        console.log("New round event received:", eventData);

        const { data } = eventData;
        const roundId = Number(data.roundId);

        // Nếu không đang hiển thị người thắng, tiến hành hiển thị vòng mới
        toast.info(`New round #${roundId} has started!`, {
          autoClose: 3000,
        });

        // Cập nhật UI nếu cần thiết (server sẽ tự gửi kuroUpdate)
      });

      // Lưu socket
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } catch (error) {
      console.error("Error connecting to socket:", error);
      toast.error(
        `Lỗi kết nối socket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [
    socketServerUrl,
    announcedRounds,
    isShowingWinner,
    winnerData,
    reconnectAttempts,
  ]);

  // Hàm ngắt kết nối
  const disconnectFromSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Hàm đăng ký theo dõi vòng chơi
  const subscribeToRound = useCallback(
    (roundId: number) => {
      if (socket && isConnected) {
        socket.emit("subscribeToRound", roundId, (response: any) => {
          if (response && response.success) {
            console.log(`Successfully subscribed to round ${roundId}`);
            toast.info(`Successfully subscribed to round #${roundId}`);
          } else {
            console.error(
              `Failed to subscribe to round ${roundId}:`,
              response?.error || "No response"
            );
            toast.error(
              `Subscription failed: ${
                response?.error || "No response from server"
              }`
            );
          }
        });
      } else {
        console.error("Cannot subscribe: Socket not connected");
        toast.error("Cannot subscribe: Socket not connected");
      }
    },
    [socket, isConnected]
  );

  // Thêm hàm reconnectSocket
  const reconnectSocket = useCallback(() => {
    console.log("Attempting to reconnect socket...");
    disconnectFromSocket();
    setReconnectAttempts(0);
    connectToSocket();
  }, [disconnectFromSocket, connectToSocket]);

  // Kết nối tự động khi component được mount
  useEffect(() => {
    // Không tự động kết nối nữa
    return () => {
      disconnectFromSocket();
    };
  }, []);

  useEffect(() => {
    const allHistoriesData = mutateAsyncHistory({
      page: 1,
      type: "all",
      limit: 10,
    });

    const myWinHistoriesData = mutateAsyncHistory({
      page: 1,
      type: "youWin",
      limit: 10,
    });

    allHistoriesData.then((res) => {
      if (res.success) {
        setAllHistories(res);
      }
    });

    myWinHistoriesData.then((res) => {
      if (res.success) {
        setMyWinHistories(res);
      }
    });
  }, []);

  const handleConnect = useCallback(() => {
    console.log("Connected to socket server");
    setIsConnected(true);
    setReconnectAttempts(0);
    toast.success("Connected to websocket server");
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("Disconnected from socket server");
    setIsConnected(false);
    toast.info("Disconnected from websocket server");
  }, []);

  const handleConnectError = useCallback(
    (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
      setReconnectAttempts((prev) => prev + 1);
      toast.error(
        `Connection error: ${error.message}. Attempt ${reconnectAttempts + 1}/5`
      );
    },
    [reconnectAttempts]
  );

  const handleReconnectFailed = useCallback(() => {
    console.error("Socket reconnection failed after 5 attempts");
    toast.error(
      "Failed to reconnect after 5 attempts. Please try again later."
    );
    setReconnectAttempts(5);
  }, []);

  const handleReconnectAttempt = useCallback((attempt: number) => {
    console.log(`Reconnection attempt ${attempt}/5`);
    toast.info(`Attempting to reconnect: ${attempt}/5`);
  }, []);

  const handleWinnerAnnounced = useCallback(
    (eventData: KuroWinnerAnnounced) => {
      console.log("Winner announced event received:", eventData);

      const { data } = eventData;
      const roundId = Number(data.roundId);

      // Đánh dấu vòng này đã được thông báo người thắng
      setAnnouncedRounds((prev) => {
        const newSet = new Set(prev);
        newSet.add(roundId);
        return newSet;
      });

      // Lưu thông tin người thắng
      setWinnerData({
        roundId: roundId,
        winner: data.winner,
        drawnAt: data.drawnAt,
        totalValue: data.totalValue,
        participants: data.participants || [],
      });

      setPoolStatus(PoolStatus.SPINNING);
    },
    []
  );

  const handleKuroUpdate = useCallback(
    (data: KuroData) => {
      // console.log("Received Kuro update:", data);

      // SPINNING or SHOWING_WINNER
      if (
        poolStatus === PoolStatus.SPINNING ||
        poolStatus === PoolStatus.SHOWING_WINNER
      ) {
        console.log(
          "Ignoring kuroUpdate due to SPINNING or SHOWING_WINNER state"
        );
        return;
      }

      if (data.error && data.error === "No data available") {
        console.log(
          `Ignoring kuroUpdate with no data available for round ${data.roundId}`
        );
        // resetStates();
        return;
      } else {
        setKuroData({
          ...data,
          endTime: data.endTime - TimeEnum._5SECS / 1000,
        });

        // DRAWING
        if (
          data.startTime > 0 &&
          data.endTime > 0 &&
          data.endTime - Date.now() / 1000 < 0
        ) {
          setPoolStatus(PoolStatus.DRAWING_WINNER);
          return;
        }

        // OPEN FOR DEPOSIT
        if (data.startTime === 0 && data.endTime === 0) {
          setPoolStatus(PoolStatus.WAIT_FOR_FIST_DEPOSIT);
        }

        // DEPOSIT_IN_PROGRESS
        if (data.startTime > 0 && data.endTime > 0) {
          setPoolStatus(PoolStatus.DEPOSIT_IN_PROGRESS);
        }
      }
    },
    [poolStatus, setKuroData, setPoolStatus]
  );

  useEffect(() => {
    if (!socket) return;

    // Xóa các listener cũ
    socket.off("connect");
    socket.off("disconnect");
    socket.off("connect_error");
    socket.off("reconnect_failed");
    socket.off("reconnect_attempt");
    socket.off("kuroWinnerAnnounced");
    socket.off("kuroRoundCancelled");
    socket.off("kuroNewRound");
    socket.off("kuroUpdate");
    socket.off("subscribeToKuro");

    // Đăng ký listener mới
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("reconnect_failed", handleReconnectFailed);
    socket.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("kuroWinnerAnnounced", handleWinnerAnnounced);
    socket.on("kuroUpdate", handleKuroUpdate);

    // Cleanup khi socket thay đổi hoặc poolStatus thay đổi
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("reconnect_failed", handleReconnectFailed);
      socket.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("kuroWinnerAnnounced", handleWinnerAnnounced);
      socket.off("kuroUpdate", handleKuroUpdate);
    };
  }, [
    socket,
    poolStatus,
    handleConnect,
    handleDisconnect,
    handleConnectError,
    handleReconnectFailed,
    handleReconnectAttempt,
    handleWinnerAnnounced,
    handleKuroUpdate,
  ]);

  // Context value
  const value: KuroContextProps = {
    kuroData,
    isConnected,
    isShowingWinner,
    winnerData,
    connectToSocket,
    disconnectFromSocket,
    subscribeToRound,
    formatEther,
    remainingWinnerTime,
    reconnectSocket,
    handleClaimPrizes,
    handleWithdraw,
    allHistories,
    myWinHistories,
    refetchHistories,
    poolStatus,
    setPoolStatus,
    isFetchingKuroHistory,
  };

  return <KuroContext.Provider value={value}>{children}</KuroContext.Provider>;
};

// Hook để sử dụng context
export const useKuro = (): KuroContextProps => {
  const context = useContext(KuroContext);
  if (context === undefined) {
    throw new Error("useKuro must be used within a KuroProvider");
  }
  return context;
};
