import { useEffect, useState, useRef } from "react";
import { colors } from "~/components/Demo";
import { Participant, useKuro } from "~/context/KuroContext";
import PlayerItem from "./PlayerItem";

interface ColoredParticipant extends Participant {
  color: string;
}

interface OverlayProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, setIsOpen }) => {
  const { kuroData } = useKuro();
  const [kuroDataWithColor, setKuroDataWithColor] = useState<
    ColoredParticipant[] | null
  >(null);
  const [sortedPlayers, setSortedPlayers] = useState<ColoredParticipant[]>([]);
  useEffect(() => {
    if (!kuroData) return;

    const newData = kuroData.participants.map((player, index) => ({
      ...player,
      color: colors[index] || colors[index % colors.length],
    }));

    setKuroDataWithColor(newData);
  }, [kuroData]);

  useEffect(() => {
    if (!kuroDataWithColor) return;

    const sortedPlayers = [...kuroDataWithColor].sort(
      (a, b) => parseFloat(b.deposit) - parseFloat(a.deposit)
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
        <div
          onClick={() => setIsOpen(false)}
          className="w-12 h-2 bg-gray mx-auto rounded-full cursor-grab"
        />
        <div className="mt-6 flex flex-1 flex-col gap-2.5 overflow-auto mb-6">
          {sortedPlayers.length === 0 && (
            <div className="text-center text-gray-500">No player in pool</div>
          )}
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
                (Number(player.deposit) / Number(kuroData.totalValue)) *
                100
              ).toFixed(2)}
              totalDeposits={player.deposit}
              color={player.color}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Overlay;
