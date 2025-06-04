"use client";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";

const Header = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="w-full bg-[#140C22] backdrop-blur p-4 flex justify-between items-center">
      <Image src="/images/fuku-logo.png" alt="header" width={120} height={36} />
      {isConnected && (
        <p onClick={() => disconnect()} className="cursor-pointer text-cancel">
          Disconnect
        </p>
      )}
    </div>
  );
};

export default Header;
