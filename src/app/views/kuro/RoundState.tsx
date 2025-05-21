"use client";
import { useEffect, useState } from "react";
import { KuroStatus, useKuro } from "~/context/KuroContext";

const RoundState = () => {
  const { kuroData } = useKuro();

  const [remainingTime, setRemainingTime] = useState("");

  // Tính toán thời gian còn lại
  useEffect(() => {
    if (!kuroData?.endTime) return;

    const calculateTimeLeft = () => {
      const endTimeMs = Number(kuroData.endTime) * 1000;
      const currentTime = Date.now();
      const difference = endTimeMs - currentTime;

      if (difference <= 0) {
        return;
      }
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setRemainingTime(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")} remaining`
      );
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [kuroData?.endTime]);

  return (
    <div className="mx-6 flex flex-col gap-4 py-6 pb-4">
      <div className="flex items-center justify-between font-semibold">
        <div className="flex items-center gap-2">
          <p className="opacity-50">Round #{kuroData?.roundId || 0}</p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-4 py-1 text-sm ${
            kuroData?.status === KuroStatus.DRAWN
              ? "bg-blue-500/20 text-blue-500"
              : kuroData?.status === KuroStatus.DRAWING
              ? "bg-warning/15 text-warning"
              : "bg-accept/15 text-accept"
          }`}
        >
          {remainingTime && <p>{remainingTime}</p>}
          {kuroData?.status === KuroStatus.OPEN &&
            kuroData?.numberOfParticipants == 0 && (
              <span className="ml-2 text-accept">Waiting for Deposits...</span>
            )}
          {kuroData?.status === KuroStatus.NONE && (
            <span className="ml-2 text-warning">Waiting for start...</span>
          )}
          {kuroData?.status === KuroStatus.DRAWING && (
            <span className="ml-2 text-warning">Drawing...</span>
          )}
          {kuroData?.status === KuroStatus.DRAWN && (
            <span className="ml-2 text-blue-500">Withdrawing...</span>
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
