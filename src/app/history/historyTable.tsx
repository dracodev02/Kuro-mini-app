"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useKuro } from "~/context/KuroContext";
import { KuroParticipant, Player, Round } from "~/types/round";
import {
  convertTimestampToDateTime,
  convertWeiToEther,
  formatEthereumAddress,
} from "~/utils/string";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/Button";
import Link from "next/link";
import { useAccount } from "wagmi";

export const getTotalUserEntries = (round: Round, address: string): bigint => {
  if (!round.participants || !address) return BigInt(0);

  const user = round.participants.find(
    (player) => player.address.toLowerCase() === address.toLowerCase()
  );
  if (!user) return BigInt(0);

  return BigInt(
    user.deposits.reduce((sum, deposit) => {
      return sum + Number(deposit.amount);
    }, 0)
  );
};

export const findPlayerByAddress = (
  round: Round,
  address: string
): KuroParticipant | undefined => {
  return round.participants.find(
    (player) => player.address.toLowerCase() === address.toLowerCase()
  );
};

export const calculateWinLeverage = (
  round: Round,
  player: KuroParticipant | undefined
) => {
  if (!player) return 0;
  const totalDeposit = Number(convertWeiToEther(round.totalValue));
  const playerDeposit = Number(
    convertWeiToEther(getTotalUserEntries(round, player.address).toString())
  );

  if (totalDeposit === 0 || playerDeposit === 0) {
    return 0;
  }

  return (totalDeposit / playerDeposit).toFixed(2);
};
const HistoryTable = ({ type = "all" }: { type: "youWin" | "all" }) => {
  const {
    handleClaimPrizes,
    refetchHistories,
    isFetchingKuroHistory,
    allHistories,
    myWinHistories,
    handleWithdraw,
  } = useKuro();

  const [roundHistory, setRoundHistory] = useState<Round[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { address } = useAccount();

  useEffect(() => {
    if (type === "all") {
      setRoundHistory(allHistories?.data || []);
      setTotalPages(Math.ceil((allHistories?.total || 0) / limit));
    } else {
      setRoundHistory(myWinHistories?.data || []);
      setTotalPages(Math.ceil((myWinHistories?.total || 0) / limit));
    }
  }, [allHistories, myWinHistories]);

  useEffect(() => {
    refetchHistories(page, limit, type);
  }, [page, address, type]);

  return (
    <div className="w-full">
      <div className="rounded-md">
        <Table className="rounded-xl">
          <TableHeader>
            <TableRow className="bg-card text-gray">
              <TableHead className="whitespace-nowrap py-6">Rounds</TableHead>
              <TableHead className="whitespace-nowrap py-6">Winner</TableHead>
              <TableHead className="whitespace-nowrap py-6">
                Participants
              </TableHead>
              <TableHead className="whitespace-nowrap py-6">
                Prize Pool
              </TableHead>
              <TableHead className="whitespace-nowrap max-w-[116px] py-6">
                Winner Entries
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[116px] py-6">
                Win
              </TableHead>
              <TableHead className="whitespace-nowrap min-w-[116px] py-6">
                Your Entry
              </TableHead>
              <TableHead className="whitespace-nowrap py-6">
                Time Ends
              </TableHead>
              {type === "youWin" && (
                <TableHead className="whitespace-nowrap py-6"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetchingKuroHistory && roundHistory.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={type === "youWin" ? 9 : 8}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                  <p>Loading...</p>
                </TableCell>
              </TableRow>
            ) : roundHistory.length > 0 ? (
              roundHistory.map((round) => (
                <TableRow
                  key={round.roundId}
                  className="transition hover:bg-[#3F367559]"
                >
                  <TableCell className="py-4 font-bold text-gray">
                    {round.roundId}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${round.winner}`}
                        />
                        <AvatarFallback>WL</AvatarFallback>
                      </Avatar>
                      <p>{formatEthereumAddress(round.winner)}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <p className="w-full text-center">
                        {round.numberOfParticipants}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Image
                        src="/images/monad_logo.svg"
                        alt="logo"
                        width={16}
                        height={16}
                      />
                      {convertWeiToEther(round.totalValue)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[116px] py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Image
                        src="/images/monad_logo.svg"
                        alt="logo"
                        width={16}
                        height={16}
                      />
                      {convertWeiToEther(
                        getTotalUserEntries(round, round.winner).toString()
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="w-fit rounded-[6px] bg-accept/15 px-2 py-1 font-medium text-accept">
                      x
                      {calculateWinLeverage(
                        round,
                        findPlayerByAddress(round, round.winner)
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 font-semibold">
                      <Image
                        src="/images/monad_logo.svg"
                        alt="logo"
                        width={16}
                        height={16}
                      />
                      {address && findPlayerByAddress(round, address)
                        ? convertWeiToEther(
                            getTotalUserEntries(round, address).toString()
                          )
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1">
                      <p className="font-medium text-gray">
                        {convertTimestampToDateTime(round.endTime)}
                      </p>
                    </div>
                  </TableCell>
                  {type === "youWin" &&
                    !round.winnerClaimed &&
                    (round.participants.length === 1 ? (
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleWithdraw(
                                round.roundId,
                                round.kuroContractAddress
                              )
                            }
                            className="h-6 !py-0 px-2"
                          >
                            Withdraw
                          </Button>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell className="py-4">
                        <div className="flex items-center justify-between gap-2">
                          <Button
                            onClick={async () =>
                              handleClaimPrizes(
                                round.roundId,
                                round.participants.map((idx) =>
                                  getTotalUserEntries(round, idx.address)
                                ),
                                round.kuroContractAddress
                              )
                            }
                            className="h-6 !py-0 px-2"
                          >
                            Claim
                          </Button>
                          {/* {address &&
                      address.toLowerCase() ===
                      round.winner.toLowerCase() && (
                        <PopupShareWinRound round={round}>
                          <Button variant="ghost" size="icon">
                            <ShareIcon size={12} />
                          </Button>
                        </PopupShareWinRound>
                      )} */}
                        </div>
                      </TableCell>
                    ))}

                  {type === "youWin" && round.winnerClaimed && (
                    <TableCell className="py-4">
                      <div className="flex w-full flex-1 items-center justify-between">
                        <Link
                          className="cursor-pointer hover:underline"
                          target="_blank"
                          href={
                            "https://testnet.monadexplorer.com/tx/" +
                            round.txClaimed
                          }
                        >
                          {formatEthereumAddress(round.txClaimed)}
                        </Link>
                        {/* {address &&
                      address.toLowerCase() ===
                        round.winner.toLowerCase() && (
                        <PopupShareWinRound round={round}>
                          <Button variant="ghost" size="icon">
                            <ShareIcon size={12} />
                          </Button>
                        </PopupShareWinRound>
                      )} */}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={type === "youWin" ? 9 : 8}
                  className="text-gray-500 h-24 text-center text-sm"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end px-4 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <p>
            Page {page} / {totalPages || 1} - Total {roundHistory.length}{" "}
            results
          </p>
        </div>
        <div className="space-x-2 flex items-center">
          <div
            className={`p-2 rounded border border-gray ${
              page <= 1 || isFetchingKuroHistory
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            //   disabled={page <= 1 || }
          >
            <ChevronLeft className="h-4 w-4" />
          </div>
          <div
            className={`p-2 rounded border border-gray ${
              page >= totalPages || isFetchingKuroHistory
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
            onClick={() => setPage(page < totalPages ? page + 1 : page)}
            //   disabled={page >= totalPages || }
          >
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
