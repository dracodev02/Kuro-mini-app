export interface Player {
    address: string;
    deposit: string;
    entries: number;
    winrate: number;
}

export type RoundStatus = 'None' | 'Open' | 'Drawn' | 'Cancelled';

export interface Round {
  _id?: string;
  roundId: number;
  status: RoundStatus;
  cutoffTime?: number;
  numberOfParticipants: number;
  totalValue: string;
  winner: string;
  participants: KuroParticipant[];
  completedAt?: Date;
  endTime: number;
  createdAt?: Date;
  updatedAt?: Date;
  winnerClaimed: boolean;
  txClaimed: string;
  kuroContractAddress?: string;
} 

export interface RoundHistoryResponse<T> {
  data: T[];
  message: string;
  page: number;
  size: number;
  success: boolean;
  total: number;
}
// {
//     "_id": "682306e619caccbc0320ae4d",
//     "roundId": "90",
//     "__v": 0,
//     "allWinnersClaimed": false,
//     "createdAt": "2025-05-13T08:46:30.487Z",
//     "drawnAt": 0,
//     "endTime": 1747126789,
//     "numberOfPlayers": "1",
//     "participants": [
//       {
//         "address": "0x636eC300E982747Cd5b667b353581EB690723B3e",
//         "deposit": "10000000000000000",
//         "roomNumber": 5,
//         "_id": "68230a10f8038355c757a7ff"
//       }
//     ],
//     "protocolFeeOwed": "0",
//     "safeRoom": 0,
//     "startTime": 1747126669,
//     "status": 4,
//     "totalEntries": "0",
//     "totalValue": "10000000000000000",
//     "updatedAt": "2025-05-13T09:00:00.563Z",
//     "winners": [
//       {
//         "address": "0x636eC300E982747Cd5b667b353581EB690723B3e",
//         "deposit": "10000000000000000",
//         "claimed": false,
//         "txHash": "",
//         "claimedAt": 0,
//         "_id": "68230a10f8038355c757a803"
//       }
//     ]
//   }

export interface KinpuParticipant {
  address: string;
  deposit: bigint;
  roomNumber: number;
}

export interface KuroParticipant {
  address: string;
  deposits: {
    amount: BigInt;
    tokenAddress: `0x${string}`;
    _id: string,
  }[];
  _id: string;
}
  
export interface KinpuData {
  roundId: number;
  status: number;
  startTime: number;
  endTime: number;
  drawnAt: number;
  numberOfParticipants: number;
  winner: string;
  totalValue: string;
  totalEntries: string;
  participants: KinpuParticipant[];
  isShowingWinner: boolean;
  remainingTime?: number;
  isHistoricalRound?: boolean;
  currentRoundId?: string;
  carryOverReward?: string;
  error?: string;
}
  
export interface KinpuWinnerAnnounced {
  drawnAt: number;
  participants: KinpuParticipant[];
  roundId: number;
  safeRoom: number;
  totalValue: string;
  winners: KinpuWinner[];
}
  
export interface KinpuWinner {
  address: string;
  claimed: boolean;
  claimedAt: number;
  deposit: string;
  txHash: string;
  _id: string;
}

export interface KinpuRoundHistory {
  _id: string;
  roundId: number;
  __v: number;
  allWinnersClaimed: boolean;
  createdAt: Date;
  drawnAt: number;
  endTime: number;
  numberOfPlayers: number;
  participants: KinpuParticipant[];
  protocolFeeOwed: string;
  safeRoom: number;
  startTime: number;
  status: number;
  totalEntries: string;
  totalValue: string;
  updatedAt: Date;
  winners: KinpuWinner[];
  carryOverReward: string;
}

export interface KuroWinnerAnnounced {
  data: {
    drawnAt: number;
    participants: KuroParticipant[];
    roundId: number;
    totalValue: string;
    winner: string;
  }
}

export interface SupportedTokenInfo {
  address: string;
  isSupported: boolean;
  decimals: number;
  isActive: boolean;
  minDeposit: bigint;
  ratio: bigint;
  symbol?: string;
  name?: string;
  description?: string;
  balance?: bigint;
  allowance?: bigint;
}