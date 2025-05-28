"use client";
import Image from "next/image";
import Overlay from "../kuro/PLayersInPool";
import { IconAlignBoxLeftStretch, IconHistory } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";

const Navigator = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <>
      <Overlay isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex justify-around bg-[#140C22] backdrop-blur p-1 fixed bottom-0 left-0 w-full">
        <div className="flex flex-col justify-center items-center">
          <Link
            href={"/"}
            onClick={() => setActiveTab(0)}
            className="w-[24px] h-[24px] aspect-square"
          >
            <Image
              src="/images/kuro-logo.svg"
              alt="header"
              width={24}
              height={24}
              className="w-full h-full"
            />
          </Link>
          <p>Kuro</p>
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className={`flex flex-col justify-center items-center cursor-pointer ${
            activeTab == 1 ? "text-white" : "text-gray"
          }`}
        >
          <IconAlignBoxLeftStretch width={24} height={24} />
          <p>Activity</p>
        </div>
        <Link
          href={"/history"}
          className={`flex flex-col justify-center items-center ${
            activeTab == 2 ? "text-white" : "text-gray"
          }`}
        >
          <IconHistory width={24} height={24} />
          <p>History</p>
        </Link>
      </div>
    </>
  );
};

export default Navigator;
