import { convertWeiToEther } from "./string";
import { BigNumberish } from "ethers";

// Định nghĩa kiểu dữ liệu cho cấu hình token đặc biệt
export interface SpecialTokenConfig {
    fixedPrize: string;
    percentage: number;
}

// Cấu hình cho các trường hợp đặc biệt
export const specialTokenConfig: Record<string, SpecialTokenConfig> = {
    "0xaEef2f6B429Cb59C9B2D7bB2141ADa993E8571c3": {
        fixedPrize: "20",
        percentage: 0
    },
    "0xb83D8fe3D51b2ecc09242fCDa318057b17Ed5971": {
        fixedPrize: "100",
        percentage: 0
    },
    // Thêm các token đặc biệt khác ở đây
};

/**
 * Tính toán tổng giải thưởng dựa trên địa chỉ token và tổng số tiền gửi
 * @param tokenAddress Địa chỉ token
 * @param totalDeposits Tổng số tiền gửi (dạng Wei)
 * @returns Tổng giải thưởng (dạng Ether)
 */
export function calculateTotalPrize(
    tokenAddress: string | undefined | null,
    totalDeposits: BigNumberish | undefined | null
): string {
    if (!tokenAddress) return "0";

    const specialConfig = specialTokenConfig[tokenAddress];

    if (specialConfig) {
        return specialConfig.fixedPrize;
    }

    if (!totalDeposits) return "0";

    const baseAmount = Number(convertWeiToEther(totalDeposits));
    // Sử dụng giá trị mặc định 2.7% nếu không có cấu hình đặc biệt
    const percentage = 2.7;

    return (baseAmount * (percentage / 100)).toFixed(2);
} 