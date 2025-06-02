import { formatEther } from "ethers";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface PlayerItemProps {
  rank: number;
  avatar: string;
  address: string;
  winrate: string;
  totalDeposits: string;
  color?: string;
}

const PlayerItem: React.FC<PlayerItemProps> = ({
  address,
  winrate,
  totalDeposits,
  color,
}) => {
  const getBorderColor = () => {
    if (color) {
      return color;
    } else return "#8371E9";
  };

  return (
    <div
      style={{ borderColor: getBorderColor() }}
      className={`flex items-center justify-between rounded border-r-4 bg-[#3F367559]/50 px-4 py-2`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>avt</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold">
          {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-end text-xs font-semibold">{winrate}%</p>
        <div className="flex items-center justify-end gap-1">
          <p className="text-end text-sm">
            <span className="font-bold text-yellow-500">{totalDeposits}</span>{" "}
          </p>
          <Image
            src={"/images/monad_logo.svg"}
            alt="logo"
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerItem;
