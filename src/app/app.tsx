"use client";

import dynamic from "next/dynamic";
import RoundState from "./views/kuro/RoundState";
import TotalPlayer from "./views/kuro/TotalPlayer";
import Deposit from "./views/kuro/Deposit";
import { useEffect } from "react";
import { useKuro } from "~/context/KuroContext";

// note: dynamic import is required for components that use the Frame SDK
const Demo = dynamic(() => import("~/components/Demo"), {
  ssr: false,
});

export default function App() {
  const { connectToSocket, disconnectFromSocket } = useKuro();

  useEffect(() => {
    // Kết nối socket khi vào trang Kuro
    connectToSocket();

    // Cleanup khi rời khỏi trang
    return () => {
      disconnectFromSocket();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <RoundState />
      <Demo />
      <TotalPlayer />
      <Deposit />
    </div>
  );
}
