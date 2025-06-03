import { useEffect, useState, useRef } from "react";
import { colors, getTotalEntriesByTokenAddress } from "~/components/Demo";
import { Participant, useKuro } from "~/context/KuroContext";
import PlayerItem from "./PlayerItem";
import { IconX } from "@tabler/icons-react";
import { KuroParticipant } from "~/types/round";
import { getUserEntries } from "./TotalPlayer";
import { convertWeiToEther } from "~/utils/string";
import { useAuth } from "~/context/AuthContext";

interface ColoredParticipant extends KuroParticipant {
  color: string;
}
interface OverlayProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, setIsOpen }) => {
  const { kuroData } = useKuro();
  const { nativeBalance, getTokenSymbolByAddress } = useAuth();
  const [kuroDataWithColor, setKuroDataWithColor] = useState<
    ColoredParticipant[] | null
  >(null);
  const [sortedPlayers, setSortedPlayers] = useState<ColoredParticipant[]>([]);
  const [tokenMap, setTokenMap] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!kuroData) return;

    const newData = kuroData.participants.map((player, index) => ({
      ...player,
      color: colors[index] || colors[index % colors.length],
    }));

    setKuroDataWithColor(newData);
    const mapToken = getTotalEntriesByTokenAddress(kuroData);
    setTokenMap(mapToken);
  }, [kuroData]);

  useEffect(() => {
    if (!kuroDataWithColor) return;

    const sortedPlayers = [...kuroDataWithColor].sort(
      (a, b) =>
        getUserEntries(b.address, kuroData) -
        getUserEntries(a.address, kuroData)
    );

    setSortedPlayers(sortedPlayers);
  }, [kuroDataWithColor]);

  if (!kuroData) return null;

  return (
    <>
      {isOpen && (
        <div
          className="w-screen h-screen z-[999] fixed top-0 left-0"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed h-[60vh] bottom-0 left-0 w-full bg-gray-900 rounded-t-2xl p-4 bg-[#2E214C] z-[1000] duration-300 transition-all ease-in-out pb-4 flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-end">
          <IconX stroke={2} onClick={() => setIsOpen(false)} />
        </div>
        <div className="mt-6 flex flex-1 flex-col gap-2.5 overflow-auto mb-6">
          {sortedPlayers.length === 0 && (
            <div className="text-center text-gray-500">No player in pool</div>
          )}

          <div className="grid gap-2 grid-cols-3 text-xs place-items-center">
            {tokenMap.size > 0 &&
              [...tokenMap.entries()].map(([tokenAddress, totalDeposits]) => (
                <div className="p-0.5 rounded w-full">
                  <p>
                    ${getTokenSymbolByAddress(tokenAddress)}{" "}
                    {Number(totalDeposits.toFixed(4))}
                  </p>
                </div>
              ))}
          </div>

          <div className="sticky top-0 flex items-center justify-between font-semibold">
            <p className="text-foreground opacity-50">
              {sortedPlayers.length} Players
            </p>
          </div>
          {sortedPlayers.map((player, index) => (
            <PlayerItem
              key={player.address}
              rank={index + 1}
              avatar="/images/monad.svg"
              address={player.address}
              winrate={(
                (getUserEntries(player.address, kuroData) /
                  parseFloat(convertWeiToEther(kuroData.totalValue))) *
                100
              ).toFixed(2)}
              totalDeposits={getUserEntries(
                player.address,
                kuroData
              ).toString()}
              color={player.color}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Overlay;
