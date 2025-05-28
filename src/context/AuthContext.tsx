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
  useAccount,
  useSignMessage,
  useConnectorClient,
  useBalance,
} from "wagmi";
import Cookies from "js-cookie";
import { useAppKitAccount } from "@reown/appkit/react";
import { monadTestnet } from "wagmi/chains";
import { convertWeiToEther } from "~/utils/string";
import { deleteCookie, getCookie, setCookie } from "~/utils/cookie";
import useRequestSignature from "~/app/api/useGetSignature";
import usePostVerify from "~/app/api/usePostVerify";
import useGetUserInfo from "~/app/api/useGetUserInfo";
import axiosInstance from "~/lib/axios";

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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { address, isConnected } = useAppKitAccount();
  const [isSyncMessage, setIsSyncMessage] = useState(false);
  const { status } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nativeBalance, setNativeBalance] = useState<string>("0");

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
      console.log("🚀 ~ updateNativeBalance ~ newBalance:", newBalance);
      setNativeBalance(convertWeiToEther(newBalance.data?.value || 0));
    }, 4000);
  }, [address]);

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
      setIsRefreshing(true);
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
      setIsRefreshing(false);
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
    console.log("🚀 ~ AuthProvider ~ nativeBalanceData:", nativeBalanceData);

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
