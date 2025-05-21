import { ethers } from "ethers";

export function convertTimestampToDate(timestamp: bigint | number | string | undefined | null): string {
    if (timestamp === undefined || timestamp === null) {
        return "Invalid timestamp";
    }

    // Convert to number if needed
    const numericTimestamp = typeof timestamp === "bigint" ? Number(timestamp) : Number(timestamp);

    // Check if conversion is valid
    if (isNaN(numericTimestamp)) {
        return "Invalid timestamp";
    }

    // Convert timestamp (seconds to milliseconds)
    const date = new Date(numericTimestamp * 1000);

    // Ensure output is in UTC
    return date.toISOString(); // Format: YYYY-MM-DDTHH:mm:ss.sssZ (always UTC)
}
export function isPastTime(timestamp: string | number | undefined | null): boolean {
    if (!timestamp) return false;

    let numericTimestamp: number;

    if (typeof timestamp === "string") {
        numericTimestamp = Math.floor(new Date(timestamp).getTime() / 1000);
    } else if (typeof timestamp === "number") {
        numericTimestamp = timestamp;
    } else {
        return false;
    }

    const currentUtcTime = Math.floor(Date.now() / 1000);

    return numericTimestamp < currentUtcTime;
}



/**
 * Formats an Ethereum address to a shorter readable format (e.g., 0x1234...5678).
 * @param address Ethereum address string
 * @returns Formatted address or "Invalid address" if the input is incorrect.
 */
export function formatEthereumAddress(address: string | undefined | null): string {
    if (!address || typeof address !== "string") {
        return "Invalid address";
    }

    // Ensure it's a valid Ethereum address
    // if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    //     return "Invalid address";
    // }

    return `${address.slice(0, 6)}...${address.slice(-4)}`; // Shorten address
}

export function convertWeiToEther(weiValue: any): string {
    if (!weiValue) return '0'
    const etherValue = ethers.formatEther(weiValue);
    if (etherValue === '0') return '0'
    return parseFloat(etherValue).toFixed(2); // Giữ 2 số thập phân

}

export function getTimeUntilWithdraw(withdrawalTime: string | number | null | undefined): string {
    if (!withdrawalTime) return "No time set";

    let timestamp = typeof withdrawalTime === "string"
        ? Math.floor(new Date(withdrawalTime).getTime() / 1000)
        : withdrawalTime;

    if (typeof timestamp !== "number") return "Invalid time";

    const timeDiff = timestamp - Math.floor(Date.now() / 1000);
    if (timeDiff <= 0) return "now";

    const days = Math.floor(timeDiff / 86400);
    const hours = Math.floor((timeDiff % 86400) / 3600);
    const minutes = Math.floor((timeDiff % 3600) / 60);
    const seconds = timeDiff % 60;

    return [
        days ? `${days}d` : "",
        hours ? `${hours}h` : "",
        minutes ? `${minutes}m` : "",
        seconds ? `${seconds}s` : ""
    ].filter(Boolean).join(" ");
}

export function convertTimestamp(isoString: string): {
    unixSeconds: number;
    unixMilliseconds: number;
    yyyyMMddHHmmss: string;
    ddMMyyyyHHmmss: string;
    mmDdYyyyHHmmss: string;
    rfc1123: string;
} {
    if (!isoString) return {
        unixSeconds: 0,
        unixMilliseconds: 0,
        yyyyMMddHHmmss: '',
        ddMMyyyyHHmmss: '',
        mmDdYyyyHHmmss: '',
        rfc1123: '',
    };

    const date = new Date(isoString);

    return {
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMilliseconds: date.getTime(),
        yyyyMMddHHmmss: date.toISOString().replace('T', ' ').split('.')[0], // 2025-02-24 12:22:07
        ddMMyyyyHHmmss: `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
        mmDdYyyyHHmmss: `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
        rfc1123: date.toUTCString(), // Mon, 24 Feb 2025 12:22:07 GMT
    };
}

/**
 * Formats a timestamp into a human-readable relative time string (e.g., "2 hours ago").
 * @param timestamp Unix timestamp in seconds or ISO string
 * @returns Formatted relative time string
 */
export function formatTimestamp(timestamp: string | number): string {
    if (!timestamp) return "Unknown time";

    // Convert to Date object
    let date: Date;

    if (typeof timestamp === "string") {
        // Kiểm tra xem timestamp có phải là chuỗi số không
        if (/^\d+$/.test(timestamp)) {
            // Nếu là chuỗi số (Unix timestamp in seconds), chuyển đổi thành số và nhân với 1000
            date = new Date(parseInt(timestamp) * 1000);
        } else {
            // Nếu là ISO string hoặc định dạng khác
            date = new Date(timestamp);
        }
    } else {
        // Nếu là số (Unix timestamp in seconds)
        date = new Date(timestamp * 1000);
    }

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
        console.error("Invalid timestamp:", timestamp);
        return "Invalid date";
    }

    // Get current time
    const now = new Date();

    // Calculate time difference in seconds
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Format based on time difference
    if (diffSeconds < 60) {
        return "Just now";
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffSeconds < 2592000) {
        const days = Math.floor(diffSeconds / 86400);
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (diffSeconds < 31536000) {
        const months = Math.floor(diffSeconds / 2592000);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
        const years = Math.floor(diffSeconds / 31536000);
        return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
}  

export const isDigit = (str: string): boolean => {
    str = str.trim();
    const regex = /^-?\d+(\.\d+)?$/;
  
    return regex.test(str);
  };
  

  export const calculateTimeLeft = (deadline: string) => {
    const now = new Date().getTime();
    const targetTime = new Date(deadline).getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }

    const days = String(
      Math.floor(difference / (1000 * 60 * 60 * 24))
    ).padStart(2, "0");
    const hours = String(
      Math.floor((difference / (1000 * 60 * 60)) % 24)
    ).padStart(2, "0");
    const minutes = String(
      Math.floor((difference / (1000 * 60)) % 60)
    ).padStart(2, "0");
    const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
      2,
      "0"
    );

    return { days, hours, minutes, seconds };
  };

  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }
  
  // Hàm chuyển đổi timestamp sang định dạng "hh:mm, MMM DDth"
  export function convertTimestampToDateTime(timestamp: string | number): string {
    // Chuyển đổi timestamp thành số và tạo đối tượng Date
    const date = new Date(Number(timestamp) * 1000); // Nhân 1000 vì Date dùng milliseconds
  
    // Lấy giờ và phút
    const hours = date.getUTCHours().toString().padStart(2, "0"); // Thêm số 0 nếu cần
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  
    // Lấy ngày và tháng
    const day = date.getUTCDate();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getUTCMonth()];
  
    // Thêm hậu tố cho ngày
    const daySuffix = getDaySuffix(day);
  
    // Trả về chuỗi định dạng
    return `${hours}:${minutes}, ${month} ${day}${daySuffix}`;
  }

  export const getTokenUnit = (contractAddress: string): string => {
    switch (contractAddress) {
      case "0x0000000000000000000000000000000000000000":
        return "MON";
      case "0xb83D8fe3D51b2ecc09242fCDa318057b17Ed5971":
        return "AZT";
      default:
        return "gMON";
    }
  }