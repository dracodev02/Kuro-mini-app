"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import {
  useSignMessage,
  useBalance,
  useReadContract,
  usePublicClient,
  useAccount,
} from "wagmi";
import Cookies from "js-cookie";
import { getCookie, setCookie, deleteCookie } from "~/utils/cookie";
import axiosInstance from "~/lib/axios";
import { monadTestnet } from "wagmi/chains";
import { convertWeiToEther } from "~/utils/string";
import { YoloABIMultiToken } from "~/abi/YoloABI";
import { SupportedTokenInfo } from "~/types/round";
import { ERC20ABI } from "~/abi/ERC20ABI";
import { supportedTokensConfig } from "~/app/config/supported-tokens";
import useRequestSignature from "~/app/api/useGetSignature";
import usePostVerify from "~/app/api/usePostVerify";
import useGetUserInfo from "~/app/api/useGetUserInfo";

type AuthContextType = {
  signMessageWithSign: () => void;
  user:
    | {
        address: string;
        referralCode: string;
        points?: number;
        rank?: number | null;
      }
    | undefined;
  isSyncMessage: boolean;
  refreshAccessToken: () => Promise<boolean>;
  logout: () => void;
  nativeBalance: string;
  updateNativeBalance: () => Promise<void>;
  supportedTokens: SupportedTokenInfo[];
  getTokenSymbolByAddress: (tokenAddress: string) => string;
  updateSupportedTokens: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAccount();
  const [isSyncMessage, setIsSyncMessage] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState();
  const [nativeBalance, setNativeBalance] = useState<string>("0");
  const [supportedTokens, setSupportedTokens] = useState<SupportedTokenInfo[]>(
    []
  );
  const publicClient = usePublicClient();

  const { data: nativeBalanceData, refetch: refetchNativeBalance } = useBalance(
    {
      address: address as any,
      blockTag: "latest",
      chainId: monadTestnet.id,
      query: {
        refetchInterval: false,
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    }
  );

  const updateNativeBalance = useCallback(async () => {
    if (!address) {
      setNativeBalance("0");
      return;
    }
    setTimeout(async () => {
      const newBalance = await refetchNativeBalance();
      setNativeBalance(convertWeiToEther(newBalance.data?.value || 0));
    }, 4000);
  }, [address]);

  const { data: supportedTokenAddresses, refetch: refetchSupportedTokens } =
    useReadContract({
      abi: YoloABIMultiToken,
      address: process.env
        .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
      functionName: "getSupportedTokens",
    });

  const getTokenSymbolByAddress = (tokenAddress: string): string => {
    if (tokenAddress === "0x0000000000000000000000000000000000000000")
      return "MON";

    const token = supportedTokensConfig.supportedTokens.find(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase()
    );
    return token?.symbol || "Unknown Token";
  };

  const updateSupportedTokens = async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    await fetchTokenDetails();
  };

  const fetchTokenDetails = useCallback(async () => {
    if (!supportedTokenAddresses || !publicClient || !address) return;

    const tokenDetails: SupportedTokenInfo[] = [];
    const addresses = Array.isArray(supportedTokenAddresses)
      ? supportedTokenAddresses
      : [];

    for (const tokenAddress of addresses) {
      try {
        // Get token info from contract
        const tokenInfo = (await publicClient.readContract({
          abi: YoloABIMultiToken,
          address: process.env
            .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
          functionName: "supportedTokens",
          args: [tokenAddress],
        })) as [boolean, number, boolean, bigint, bigint];

        let symbol = "MON";
        let name = "Monad";
        let description = "Native Monad token";
        let balance = BigInt(0);
        let allowance = BigInt(0);

        if (tokenAddress === "0x0000000000000000000000000000000000000000") {
          // Native MON
          // balance = BigInt(parseFloat(nativeBalance) * 1e18);
          const newBalance = await refetchNativeBalance();
          balance = newBalance.data?.value || BigInt(0);
          allowance = BigInt(0);
        } else {
          // ERC20 token - First try to get info from config file
          const configToken = supportedTokensConfig.supportedTokens.find(
            (token) =>
              token.address.toLowerCase() === tokenAddress.toLowerCase()
          );

          if (configToken) {
            // Use config file data
            symbol = configToken.symbol;
            name = configToken.name;
            description = configToken.description;
          }

          try {
            // Get balance and allowance for ERC20 tokens
            const [tokenBalance, tokenAllowance] = await Promise.all([
              publicClient.readContract({
                abi: ERC20ABI,
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [address],
              }) as Promise<bigint>,
              publicClient.readContract({
                abi: ERC20ABI,
                address: tokenAddress as `0x${string}`,
                functionName: "allowance",
                args: [
                  address,
                  process.env
                    .NEXT_PUBLIC_KURO_MULTI_TOKEN_ADDRESS as `0x${string}`,
                ],
              }) as Promise<bigint>,
            ]);

            balance = tokenBalance;
            allowance = tokenAllowance;

            // If no config data found, try to fetch from contract
            if (!configToken) {
              try {
                const [tokenSymbol, tokenName] = await Promise.all([
                  publicClient.readContract({
                    abi: ERC20ABI,
                    address: tokenAddress as `0x${string}`,
                    functionName: "symbol",
                  }) as Promise<string>,
                  publicClient.readContract({
                    abi: ERC20ABI,
                    address: tokenAddress as `0x${string}`,
                    functionName: "name",
                  }) as Promise<string>,
                ]);

                symbol = tokenSymbol;
                name = tokenName;
                description = `ERC20 Token: ${tokenName}`;
              } catch (error) {
                console.error(
                  `Error fetching token details from contract for ${tokenAddress}:`,
                  error
                );
                symbol = `Token ${tokenAddress.slice(0, 6)}...`;
                name = `Unknown Token`;
                description = "Unknown token";
              }
            }
          } catch (error) {
            console.error(
              `Error fetching token balance/allowance for ${tokenAddress}:`,
              error
            );
            symbol =
              configToken?.symbol || `Token ${tokenAddress.slice(0, 6)}...`;
            name = configToken?.name || `Unknown Token`;
            description = configToken?.description || "Unknown token";
          }
        }

        tokenDetails.push({
          address: tokenAddress as string,
          isSupported: tokenInfo[0],
          decimals: tokenInfo[1],
          isActive: tokenInfo[2],
          minDeposit: tokenInfo[3],
          ratio: tokenInfo[4],
          symbol,
          name,
          description,
          balance,
          allowance,
        });
      } catch (error) {
        console.error(`Error fetching token info for ${tokenAddress}:`, error);
      }
    }

    setSupportedTokens(
      tokenDetails.filter((token) => token.isSupported && token.isActive)
    );
  }, [address, supportedTokenAddresses, publicClient, nativeBalance]);

  useEffect(() => {
    fetchTokenDetails();
  }, [supportedTokenAddresses, publicClient, address, nativeBalance]);

  const prevAddressRef = useRef<string | null>(null);

  const getReferralCode = () => {
    // Check URL params first
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const refFromUrl = urlParams.get("ref");

      if (refFromUrl) {
        // If found in URL, save to cookie
        setCookie("referral_code", refFromUrl);
        return refFromUrl;
      }

      // If not in URL, try to get from cookie
      const refFromCookie = getCookie("referral_code");
      if (refFromCookie) {
        return refFromCookie;
      }
    }
    return null;
  };

  const refCode = getReferralCode();
  const _getSignatures = useRequestSignature();
  const _verifySignatures = usePostVerify();
  const _getUserInfo = useGetUserInfo();

  // Hàm làm mới access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        console.log("No refresh token available");
        return false;
      }

      const response = await axiosInstance.post(`/api/auth/refresh-token`, {
        refreshToken,
      });

      if (response.data.success) {
        const {
          token,
          refreshToken: newRefreshToken,
          user: userData,
        } = response.data.data;

        // Lưu token mới
        Cookies.set("accessToken", token, {
          expires: 1, // 1 ngày
          path: "/",
          sameSite: "strict",
        });
        Cookies.set("refreshToken", newRefreshToken, {
          expires: 7, // 7 ngày
          path: "/",
          sameSite: "strict",
        });

        // Cập nhật thông tin người dùng
        if (userData) {
          setUser(userData);
        }

        setIsSyncMessage(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    } finally {
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(undefined);
    setIsSyncMessage(false);
  };

  // Thêm hàm để lấy thông tin người dùng từ token
  const getUserInfoFromToken = async () => {
    try {
      // Gọi API để lấy thông tin user từ token
      const res = await _getUserInfo.mutateAsync();
      if (res.success && res.data) {
        setUser(res.data);
        setIsSyncMessage(true);

        if (res.data.rank === null || res.data.points === 0) {
          setTimeout(async () => {
            try {
              const updatedRes = await _getUserInfo.mutateAsync();
              if (updatedRes.success && updatedRes.data) {
                // Chỉ cập nhật nếu có thông tin mới
                if (
                  updatedRes.data.rank !== null ||
                  updatedRes.data.points > 0
                ) {
                  setUser(updatedRes.data);
                }
              }
            } catch (error) {
              console.error("Error fetching updated user info:", error);
            }
          }, 1000);
        }
      } else {
        // Nếu không lấy được thông tin user, thử làm mới token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          // Nếu không làm mới được token, xóa token và yêu cầu ký lại
          logout();
          signMessageWithSign();
        }
      }
    } catch (error: any) {
      console.error("Error fetching user info:", error);

      // Kiểm tra lỗi token hết hạn
      if (error.response && error.response.status === 401) {
        // Thử làm mới token
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          // Nếu không làm mới được token, xóa token và yêu cầu ký lại
          logout();
          signMessageWithSign();
        } else {
          // Nếu làm mới token thành công, thử lấy lại thông tin người dùng
          getUserInfoFromToken();
        }
      } else {
        // Lỗi khác, xóa token và yêu cầu ký lại
        logout();
        signMessageWithSign();
      }
    }
  };

  const signMessageWithSign = async () => {
    if (!isConnected || !address) return;

    return toast.promise(
      (async () => {
        const res = await _getSignatures.mutateAsync(address);
        if (!res) throw new Error("Failed to get signature message");

        const message = res.data.message;
        const signature = await signMessageAsync({ message });

        let body: any = { address, signature };
        if (refCode) body.referralCode = refCode;

        const verifyRes = await _verifySignatures.mutateAsync(body);
        const receivedToken = verifyRes.data.token;
        const receivedRefreshToken = verifyRes.data.refreshToken;

        if (!receivedToken) throw new Error("Token verification failed");

        // Lưu cả access token và refresh token
        Cookies.set("accessToken", receivedToken, {
          expires: 1, // 1 ngày
          path: "/",
          sameSite: "strict",
        });
        if (receivedRefreshToken) {
          Cookies.set("refreshToken", receivedRefreshToken, {
            expires: 7, // 7 ngày
            path: "/",
            sameSite: "strict",
          });
        }

        // Lấy thông tin người dùng từ API profile
        try {
          const userInfoRes = await _getUserInfo.mutateAsync();
          if (userInfoRes.success && userInfoRes.data) {
            setUser(userInfoRes.data);
            setIsSyncMessage(true);
          } else {
            // Nếu không lấy được thông tin, sử dụng dữ liệu từ verifyRes
            setUser(verifyRes.data.user);
            setIsSyncMessage(true);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Sử dụng dữ liệu từ verifyRes nếu không lấy được profile
          setUser(verifyRes.data.user);
          setIsSyncMessage(true);
        }

        // Delete referral cookie after successful processing
        deleteCookie("referral_code");

        return "Wallet verified successfully";
      })(),
      {
        pending: "Verifying wallet...",
        success: "Wallet verified successfully!",
        error: {
          render({ data }) {
            return typeof data === "string" ? data : "Failed to verify wallet";
          },
        },
      }
    );
  };

  useEffect(() => {
    // Không xóa token và không đặt lại user khi tải lại trang
    // Chỉ đặt isSyncMessage thành false để kích hoạt useEffect phía dưới
    setIsSyncMessage(false);
  }, []);

  useEffect(() => {
    if (prevAddressRef.current && prevAddressRef.current !== address) {
      logout();
    }

    prevAddressRef.current = address ?? null;
  }, [address]);

  useEffect(() => {
    if (nativeBalanceData) {
      setNativeBalance(convertWeiToEther(nativeBalanceData.value || 0));
    }
  }, [nativeBalanceData]);

  useEffect(() => {
    if (isConnected && !Cookies.get("accessToken")) {
      signMessageWithSign();
    } else if (isConnected && Cookies.get("accessToken")) {
      // Nếu đã có token nhưng chưa có thông tin người dùng, lấy thông tin người dùng
      if (!user) {
        getUserInfoFromToken();
      } else {
        setIsSyncMessage(true);
      }
    }
  }, [isConnected]);

  const value = {
    signMessageWithSign,
    user,
    isSyncMessage,
    refreshAccessToken,
    logout,
    nativeBalance,
    updateNativeBalance,
    supportedTokens,
    getTokenSymbolByAddress,
    updateSupportedTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
