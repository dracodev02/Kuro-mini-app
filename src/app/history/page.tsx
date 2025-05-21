"use client";
import { useState } from "react";
import HistoryTable from "./historyTable";

const History = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="px-4 py-5">
      <div className="p-1 bg-[#3F3675] flex rounded-[8px]">
        <div
          onClick={() => setActiveTab(0)}
          className={`flex-1 py-2 rounded ${
            activeTab == 0 ? "bg-[#8371E9] text-white" : "text-[#A1A1AA]"
          }`}
        >
          <p className="text-center">All</p>
        </div>
        <div
          onClick={() => setActiveTab(1)}
          className={`flex-1 py-2 rounded ${
            activeTab == 1 ? "bg-[#8371E9] text-white" : "text-[#A1A1AA]"
          }`}
        >
          <p className="text-center">You Win</p>
        </div>
      </div>
      {activeTab == 0 && <HistoryTable type="all" />}
      {activeTab == 1 && <HistoryTable type="youWin" />}
    </div>
  );
};

export default History;
