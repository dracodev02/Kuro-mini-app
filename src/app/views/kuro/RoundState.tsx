"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KuroStatus, PoolStatus, useKuro } from "~/context/KuroContext";

const RoundState = () => {
  const { kuroData, poolStatus, setPoolStatus, winnerData } = useKuro();

  const [remainingTime, setRemainingTime] = useState("");

  // Tính toán thời gian còn lại với useCallback
  const calculateTimeLeft = useCallback(() => {
    if (!kuroData || kuroData.endTime === 0) return;
    if (
      poolStatus === PoolStatus.CANCELED ||
      poolStatus === PoolStatus.SPINNING ||
      poolStatus === PoolStatus.WAITING_FOR_NEXT_ROUND ||
      poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT ||
      poolStatus == PoolStatus.SHOWING_WINNER
    )
      return;

    const endTimeMs = Number(kuroData.endTime) * 1000;
    const currentTime = Date.now();
    const difference = endTimeMs - currentTime;

    if (difference < 0) {
      setPoolStatus(PoolStatus.DRAWING_WINNER);
      return;
    }
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setRemainingTime(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")} remaining`
    );
  }, [kuroData, setPoolStatus, poolStatus]);

  // Tính remainingTime với useMemo
  const memoizedRemainingTime = useMemo(() => {
    calculateTimeLeft();
    return remainingTime;
  }, [kuroData, calculateTimeLeft, remainingTime]);

  useEffect(() => {
    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [kuroData, calculateTimeLeft]);

  return (
    <div className="mx-6 flex flex-col gap-4 py-6 pb-4">
      <div className="flex items-center justify-between font-semibold">
        <div className="flex items-center gap-2">
          <p className="opacity-50">Round #{kuroData?.roundId || 0}</p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full bg-accept/15 px-4 py-1 text-sm`}
        >
          {poolStatus === PoolStatus.WAITING_FOR_NEXT_ROUND && (
            <span className="ellipsis ml-2 text-accept">
              Setting up next round
            </span>
          )}
          {poolStatus === PoolStatus.WAIT_FOR_FIST_DEPOSIT && (
            <span className="ml-2 text-accept">Waiting for Deposits</span>
          )}
          {poolStatus === PoolStatus.DEPOSIT_IN_PROGRESS && (
            <span className="ml-2 text-accept">{memoizedRemainingTime}</span>
          )}
          {poolStatus === PoolStatus.DRAWING_WINNER && (
            <span className="ellipsis ml-2 text-accept">Drawing</span>
          )}
          {poolStatus === PoolStatus.SPINNING && (
            <span className="ellipsis ml-2 text-accept">Spinning</span>
          )}
          {poolStatus === PoolStatus.SHOWING_WINNER && (
            <span className="ml-2 text-accept">
              Winner is {winnerData?.winner.slice(0, 6)}...
              {winnerData?.winner.slice(-4)}
            </span>
          )}
          {poolStatus === PoolStatus.CANCELED && (
            <span className="ml-2 text-red-500">Cancelled</span>
          )}
        </div>
      </div>

      {/* <Separator /> */}

      {/* Hiển thị thông tin người thắng nếu round đã kết thúc */}
      {/* {kuroData?.status === KuroStatus.DRAWN && kuroData?.winner && (
        <div className="mt-2 p-2 bg-blue-500/10 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-blue-500">🏆</span>
              <span className="font-semibold text-blue-500">Winner:</span>
            </div>
            <div className="font-mono text-blue-500">
              {kuroData?.winner}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RoundState;
