"use client";
import { useFrame } from "~/components/providers/FrameProvider";
import { PieChart } from "@mui/x-charts/PieChart";
import { useCallback, useEffect, useRef, useState } from "react";
import { KuroData, PoolStatus, TimeEnum, useKuro } from "~/context/KuroContext";
import { convertWeiToEther, formatEthereumAddress } from "~/utils/string";
import { toast } from "react-toastify";
import Image from "next/image";
import { formatEther } from "ethers";
import { useAccount } from "wagmi";
import { KuroParticipant } from "~/types/round";
import { getUserEntries } from "~/app/views/kuro/TotalPlayer";

export const colors = [
  "#4DFFFF", // Blue neon (từ #33CCFF)
  "#FF4DFF", // Magenta neon (từ #FF00FF)
  "#4DFF4D", // Green neon (từ #00FF00)
  "#FF4DB3", // Ruby neon (từ #FF0077)
  "#FF80FF", // Bright magenta (từ #FF33FF)
  "#80FFFF", // Aqua neon (từ #33FFCC)
  "#FF4DE6", // Deep pink (từ #FF0099)
  "#4DFFE6", // Mint neon (từ #00FF99)
  "#FF99FF", // Light magenta (từ #FF66FF)
  "#99FFFF", // Sky cyan (từ #66FFFF)
  "#FF4DCC", // Vivid pink (từ #FF0088 // Purple neon (từ #CC00FF)
  "#4DFF99", // Lime neon (từ #00FF66)
  "#FF80CC", // Rose neon (từ #FF3399 // Candy pink (từ #FF00AA)
  "#4DFF80", // Acid green (từ #00FF33)
  "#FFAAFF", // Pastel magenta (từ #FF55FF)
  "#AAFFFF", // Pale cyan (từ #55FFFF)
  "#FF4D99", // Pink neon (từ #FF0066 // Violet neon (từ #AA00FF)
  "#4DFFAA", // Spring green (từ #00FF55) // Ice cyan (từ #22FFFF)
  "#FF4D80", // Crimson neon (từ #FF0044)
  "#4DFFD4", // Jade neon (từ #00FF88)
  "#FFB3FF", // Lilac neon (từ #FF77FF)
  "#B3FFFF", // Crystal cyan (từ #77FFFF // Hot pink (từ #FF00CC)
  "#FF4D80", // Scarlet neon (từ #FF0033) // Turquoise neon (từ #00FFBB)
  "#FFE6FF", // Bubblegum pink (từ #FF99FF)
  "#E6FFFF", // Frost cyan (từ #99FFFF)
  "#FF4D66", // Cherry neon (từ #FF0022) // Lagoon neon (từ #00FFDD)
  "#FFF0FF", // Lavender neon (từ #FFBBFF)
  "#F0FFFF", // Mist cyan (từ #BBFFFF)
  "#FF4D4D", // Blood neon (từ #FF0011) // Ocean neon (từ #00FFEE)
  "#FFF0FF", // Orchid neon (từ #FFDDFF)
  "#E6FFE6", // Pale mint (từ #CCFFCC)
  "#FF4D4D", // Pure red neon (từ #FF0000)
  "#4DFF66", // Forest neon (từ #00FF11)
  "#FFF0FF", // Blush neon (từ #FFEEFF)
  "#F0FFF0", // Ghost mint (từ #EEFFEE)
  "#FF80AA", // Coral neon (từ #FF0055)
  "#66FF4D", // Toxic green (từ #11FF00) // Blue neon (từ #33CCFF // Magenta neon (từ #FF00FF) // Bright magenta (từ #FF33FF) // Aqua neon (từ #33FFCC)
  "#FF4D99", // Pink neon (từ #FF0066 // Violet neon (từ #AA00FF)
  "#4DFFAA", // Spring green (từ #00FF55) // Flamingo pink (từ #FF22AA) // Cyan neon (từ #00FFFF) // Ice cyan (từ #22FFFF)
  "#FF4D80", // Crimson neon (từ #FF0044)
  "#4DFFD4", // Jade neon (từ #00FF88)
  "#FFB3FF", // Lilac neon (từ #FF77FF)
  "#B3FFFF", // Crystal cyan (từ #77FFFF // Hot pink (từ #FF00CC)
  "#FF4D80", // Scarlet neon (từ #FF0033) // Turquoise neon (từ #00FFBB)
  "#FFE6FF", // Bubblegum pink (từ #FF99FF)
  "#E6FFFF", // Frost cyan (từ #99FFFF)
  "#FF4D66", // Cherry neon (từ #FF0022) // Lagoon neon (từ #00FFDD)
  "#FFF0FF", // Lavender neon (từ #FFBBFF)
  "#F0FFFF", // Mist cyan (từ #BBFFFF)
  "#FF4D4D", // Blood neon (từ #FF0011) // Ocean neon (từ #00FFEE)
  "#FFF0FF", // Orchid neon (từ #FFDDFF)
  "#E6FFE6", // Pale mint (từ #CCFFCC)
  "#FF4D4D", // Pure red neon (từ #FF0000)
  "#4DFF66", // Forest neon (từ #00FF11)
  "#FFF0FF", // Blush neon (từ #FFEEFF)
  "#F0FFF0", // Ghost mint (từ #EEFFEE)
  "#FF80AA", // Coral neon (từ #FF0055)
  "#66FF4D", // Toxic green (từ #11FF00)
];

export const getTotalEntriesByTokenAddress = (
  kuroData: KuroData | null
): Map<string, number> => {
  const mapToken = new Map<string, number>();
  if (!kuroData || !kuroData.participants) return mapToken;

  kuroData.participants.forEach((player) => {
    player.deposits.forEach((deposit) => {
      if (mapToken.has(deposit.tokenAddress)) {
        mapToken.set(
          deposit.tokenAddress,
          (mapToken.get(deposit.tokenAddress) || 0) +
            parseFloat(convertWeiToEther(deposit.amount))
        );
      } else {
        mapToken.set(
          deposit.tokenAddress,
          parseFloat(convertWeiToEther(deposit.amount))
        );
      }
    });
  });

  return mapToken;
};

export default function Demo() {
  const { isSDKLoaded, context } = useFrame();
  const { kuroData, setPoolStatus, poolStatus, winnerData, refetchHistories } =
    useKuro();
  const { address } = useAccount();
  // có thể chỉnh sửa
  const [timeToShowWinner, setTimeToShowWinner] = useState<number>(
    TimeEnum._15SECS
  ); // Thời gian hiển thị người chiến thắng (30 giây)

  const [spinDuration] = useState<number>(TimeEnum._5SECS); // Thời gian quay mặc định: 5 giây
  const [fullRotations] = useState<number>(5); // Số vòng quay mặc định: 5 vòng

  const chartRef = useRef<HTMLDivElement>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    timeToShowWinner / 1000
  );

  const [pool, setPool] = useState<Map<string, number>>(new Map());
  const [progress, setProgress] = useState<number>(1);
  const [isYouAreWinner, setIsYouAreWinner] = useState(false);
  const [tokenMap, setTokenMap] = useState<Map<string, number>>(new Map());

  const mapToData = (
    map: Map<string, number>
  ): { label: string; value: number; color: string }[] => {
    const data: { label: string; value: number; color: string }[] = [];

    let index = 0;
    map.forEach((value, label) => {
      data.push({
        label,
        value,
        color: colors[index % colors.length], // Lấy màu theo index, vòng lại nếu vượt quá độ dài mảng colors
      });
      index++;
    });

    return data;
  };

  const spinWheel = useCallback(
    async (winner: string) => {
      if (pool.size == 0) return;

      if (!pool.has(winner)) {
        toast.error(`Winner ${winner} is not exists`);
        return;
      }

      const { start, end } = calculateRangeDegByOwner(winner, pool);

      const targetAngle =
        start +
        (end - start) / 2 +
        ((end - start) / 2) * (Math.random() * 1.6 - 0.8);
      const adjustmentAngle = 360 * fullRotations + targetAngle;

      if (chartRef.current) {
        const chartContainer = chartRef.current;
        chartContainer.style.transform = `rotate(${-adjustmentAngle}deg)`;
        chartContainer.style.transition = `transform ${spinDuration}ms ease-out`;

        setTimeout(() => {
          setPoolStatus(PoolStatus.SHOWING_WINNER);
          countdown(timeToShowWinner / 1000);
          setIsYouAreWinner(winner === address);
          refetchHistories(1);
          chartContainer.style.transform = `rotate(${-targetAngle}deg)`;
          chartContainer.style.transition = `none`;

          // show popup người chiến thắng chỗ này
        }, spinDuration);
      }
    },
    [poolStatus]
  );

  const calculateTotalPool = (map: Map<string, number>): number => {
    let totalPool = 0;
    map.forEach((value) => {
      totalPool += value;
    });
    return totalPool;
  };

  const calculateDegCornerByOwner = (
    address: string,
    map: Map<string, number>
  ): number => {
    const poolOfOwner = map.get(address);
    const totalPool = calculateTotalPool(map);
    let ownerDeg = 0;

    if (!poolOfOwner) return 0;
    if (totalPool === 0) return 0;

    ownerDeg = (360 * poolOfOwner) / totalPool;
    return ownerDeg;
  };

  const calculateRangeDegByOwner = (
    owner: string,
    map: Map<string, number>
  ): { start: number; end: number } => {
    let startDeg = 0;
    let endDeg = 0;

    for (const [key] of map) {
      if (key !== owner) {
        startDeg += calculateDegCornerByOwner(key, map);
      } else {
        endDeg = startDeg + calculateDegCornerByOwner(owner, map);
        break;
      }
    }

    return { start: startDeg, end: endDeg };
  };

  const countdown = (seconds: number): void => {
    // Kiểm tra nếu số giây âm thì không chạy
    if (seconds < 0) {
      return;
    }

    let remainingTime = seconds;
    // Tạo một interval chạy mỗi 1 giây (1000ms)
    const timer = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        setTimeRemaining(remainingTime);
      } else {
        setTimeRemaining(timeToShowWinner / 1000);
        clearInterval(timer);
      }
    }, 1000);
  };

  const updateTimer = async () => {
    if (kuroData?.startTime && kuroData.endTime) {
      const now = new Date().getTime() / 1000;

      const rangeTime = kuroData?.endTime - kuroData.startTime;
      const process = now - kuroData?.startTime;

      if (process > rangeTime) {
        setProgress(0);
      } else {
        setProgress(1 - process / rangeTime);
      }
    }
  };

  useEffect(() => {
    if (!kuroData) return;

    const newPool = new Map<string, number>();

    if (kuroData.participants.length > 0) {
      kuroData.participants.forEach((player: KuroParticipant) => {
        if (getUserEntries(player.address, kuroData) > 0) {
          newPool.set(player.address, getUserEntries(player.address, kuroData));
        }
      });
    } else if (parseFloat(kuroData.totalValue) > 0) {
      // Fallback nếu chưa có thông tin players
      newPool.set("Current Pool", parseFloat(kuroData.totalValue));
    }
    setPool(newPool);

    const mapToken = getTotalEntriesByTokenAddress(kuroData);
    setTokenMap(mapToken);
  }, [kuroData]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let timeOut: NodeJS.Timeout | null = null;

    if (
      poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT ||
      poolStatus === PoolStatus.WAITING_FOR_NEXT_ROUND ||
      poolStatus === PoolStatus.DRAWING_WINNER
    ) {
      return;
    } else if (poolStatus === PoolStatus.DEPOSIT_IN_PROGRESS) {
      interval = setInterval(updateTimer, 10);
    } else if (poolStatus === PoolStatus.SPINNING && winnerData) {
      spinWheel(winnerData.winner);
    } else if (poolStatus === PoolStatus.SHOWING_WINNER) {
      timeOut = setTimeout(() => {
        setPoolStatus(PoolStatus.WAITING_FOR_NEXT_ROUND);
      }, timeToShowWinner);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (timeOut) {
        clearTimeout(timeOut);
      }
    };
  }, [poolStatus, winnerData]);

  useEffect(() => {
    if (isYouAreWinner) {
      setTimeout(() => {
        setIsYouAreWinner(false);
      }, TimeEnum._9SECS);
    }
  }, [isYouAreWinner]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div
        style={{
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          padding: "20px",
        }}
        className="w-fit"
      >
        <div className="relative h-fit w-fit rounded-full p-3">
          <Image
            src={"/images/arrow.svg"}
            alt="arrow"
            width={44}
            height={44}
            className="absolute left-1/2 top-[20%] z-10 -translate-x-1/2 rotate-180"
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold">
            {(poolStatus === PoolStatus.DEPOSIT_IN_PROGRESS ||
              poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT) && (
              <>
                <p className="text-center">MON</p>
                <p className="text-center font-gajraj text-[52px] leading-[52px]">
                  {formatEther(kuroData?.totalValue || "0")}
                </p>
                <p className="text-center opacity-50">Deposited</p>
              </>
            )}

            {poolStatus === PoolStatus.DRAWING_WINNER && (
              <>
                <p className="ellipsis text-center opacity-50">
                  Drawing winner
                </p>
              </>
            )}

            {poolStatus === PoolStatus.SHOWING_WINNER && (
              <>
                <p className="text-center opacity-50">
                  Winner is {winnerData?.winner.slice(0, 6)}...
                  {winnerData?.winner.slice(-4)}
                </p>
                <p className="text-center opacity-50">
                  Next round in {timeRemaining}s
                </p>
              </>
            )}
          </div>
          <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rotate-90">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <defs>
                <clipPath id="circleClip">
                  <path
                    d={`
                     M 50 5
                     A 45 45 0 ${progress > 0.5 ? 1 : 0} 1 ${
                      50 + 45 * Math.cos(2 * Math.PI * progress - Math.PI / 2)
                    } ${
                      50 + 45 * Math.sin(2 * Math.PI * progress - Math.PI / 2)
                    }
                     L 50 50
                     Z
                   `}
                    fill="#000"
                  />
                </clipPath>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#fff13f"
                strokeWidth="2"
                strokeDasharray="5 2" // Tạo hiệu ứng dashed
                clipPath="url(#circleClip)"
                style={{
                  transition: "all 1s linear", // Hiệu ứng mượt mà
                  transform: "rotate(-90deg)", // Bắt đầu từ đỉnh
                  transformOrigin: "center",
                }}
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <div
            ref={chartRef}
            style={{
              position: "relative",
              width: "300px",
              height: "300px",
              transformOrigin: "center center",
            }}
            className="pool-wheel-custom"
          >
            <PieChart
              series={[
                {
                  innerRadius: 130,
                  outerRadius: 150,
                  paddingAngle: 2,
                  cornerRadius: 40,
                  startAngle: 0,
                  endAngle: 360,
                  data:
                    mapToData(pool).length > 0
                      ? mapToData(pool).map((d, index) => ({
                          label: formatEthereumAddress(d.label),
                          id: d.label,
                          value: Number(d.value),
                          color: colors[index % colors.length],
                        }))
                      : [
                          {
                            label: "No Data",
                            id: "no-data",
                            value: 1,
                          },
                        ],

                  valueFormatter: (value: { value: number }) => {
                    return mapToData(pool).length > 0
                      ? `${value.value} MON`
                      : "No deposits yet";
                  },

                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 110,
                    additionalRadius: -30,
                    color: "gray",
                  },
                },
              ]}
              margin={{ right: 5 }}
              width={300}
              height={300}
              hideLegend
            />
          </div>
        </div>
      </div>
    </div>
  );
}
