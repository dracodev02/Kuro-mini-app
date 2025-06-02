export const YoloABI =
  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "uint40",
          "name": "_roundDuration",
          "type": "uint40"
        },
        {
          "internalType": "uint256",
          "name": "_valuePerEntry",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_protocolFeeRecipient",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_protocolFeeBp",
          "type": "uint16"
        },
        {
          "internalType": "uint40",
          "name": "_maximumNumberOfParticipantsPerRound",
          "type": "uint40"
        },
        {
          "internalType": "address",
          "name": "_keeper",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "EnforcedPause",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ExpectedPause",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "entryCount",
          "type": "uint256"
        }
      ],
      "name": "Deposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "depositIndices",
          "type": "uint256[]"
        }
      ],
      "name": "DepositsWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "newKeeper",
          "type": "address"
        }
      ],
      "name": "KeeperUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint40",
          "name": "maximumNumberOfParticipantsPerRound",
          "type": "uint40"
        }
      ],
      "name": "MaximumNumberOfParticipantsPerRoundUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isAllowed",
          "type": "bool"
        }
      ],
      "name": "OutflowAllowedUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "depositIndices",
          "type": "uint256[]"
        }
      ],
      "name": "PrizesClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "protocolFeeBp",
          "type": "uint16"
        }
      ],
      "name": "ProtocolFeeBpUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ProtocolFeePayment",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "protocolFeeRecipient",
          "type": "address"
        }
      ],
      "name": "ProtocolFeeRecipientUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint40",
          "name": "roundDuration",
          "type": "uint40"
        }
      ],
      "name": "RoundDurationUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum Kuro.RoundStatus",
          "name": "status",
          "type": "uint8"
        }
      ],
      "name": "RoundStatusUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "valuePerEntry",
          "type": "uint256"
        }
      ],
      "name": "RoundValuePerEntryUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "MINIMUM_PLAYERS_FOR_VALID_ROUND",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cancel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "roundId",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "depositIndices",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct Kuro.WithdrawalCalldata",
          "name": "withdrawalCalldata",
          "type": "tuple"
        }
      ],
      "name": "claimPrizes",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currentRoundId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "drawWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "depositIndex",
          "type": "uint256"
        }
      ],
      "name": "getDeposit",
      "outputs": [
        {
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "entryCount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "withdrawn",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        }
      ],
      "name": "getDepositsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "getRoundData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "enum Kuro.RoundStatus",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint40",
              "name": "startTime",
              "type": "uint40"
            },
            {
              "internalType": "uint40",
              "name": "endTime",
              "type": "uint40"
            },
            {
              "internalType": "uint40",
              "name": "drawnAt",
              "type": "uint40"
            },
            {
              "internalType": "uint40",
              "name": "numberOfParticipants",
              "type": "uint40"
            },
            {
              "internalType": "address",
              "name": "winner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "totalValue",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalEntries",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "protocolFeeOwed",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "prizesClaimed",
              "type": "bool"
            }
          ],
          "internalType": "struct Kuro.RoundInfo",
          "name": "roundInfo",
          "type": "tuple"
        },
        {
          "internalType": "address[]",
          "name": "participants",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "userDepositIndices",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "systemParams",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        }
      ],
      "name": "getRoundInfo",
      "outputs": [
        {
          "internalType": "enum Kuro.RoundStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint40",
          "name": "startTime",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "endTime",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "drawnAt",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "numberOfParticipants",
          "type": "uint40"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalEntries",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "protocolFeeOwed",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "prizesClaimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        }
      ],
      "name": "getRoundParticipants",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "participants",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserDepositIndices",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "roundId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasUserWithdrawnDeposits",
      "outputs": [
        {
          "internalType": "bool",
          "name": "hasWithdrawn",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "keeper",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maximumNumberOfParticipantsPerRound",
      "outputs": [
        {
          "internalType": "uint40",
          "name": "",
          "type": "uint40"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "outflowAllowed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolFeeBp",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolFeeRecipient",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "roundDuration",
      "outputs": [
        {
          "internalType": "uint40",
          "name": "",
          "type": "uint40"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "rounds",
      "outputs": [
        {
          "internalType": "enum Kuro.RoundStatus",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint40",
          "name": "startTime",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "endTime",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "drawnAt",
          "type": "uint40"
        },
        {
          "internalType": "uint40",
          "name": "numberOfParticipants",
          "type": "uint40"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalEntries",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "protocolFeeOwed",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "prizesClaimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "toggleOutflowAllowed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "togglePaused",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newKeeper",
          "type": "address"
        }
      ],
      "name": "updateKeeper",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint40",
          "name": "_maximumNumberOfParticipantsPerRound",
          "type": "uint40"
        }
      ],
      "name": "updateMaximumNumberOfParticipantsPerRound",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint16",
          "name": "_protocolFeeBp",
          "type": "uint16"
        }
      ],
      "name": "updateProtocolFeeBp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_protocolFeeRecipient",
          "type": "address"
        }
      ],
      "name": "updateProtocolFeeRecipient",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint40",
          "name": "_roundDuration",
          "type": "uint40"
        }
      ],
      "name": "updateRoundDuration",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_valuePerEntry",
          "type": "uint256"
        }
      ],
      "name": "updateValuePerEntry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "valuePerEntry",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "roundId",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "depositIndices",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct Kuro.WithdrawalCalldata",
          "name": "withdrawalCalldata",
          "type": "tuple"
        }
      ],
      "name": "withdrawDeposits",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const;


  export const YoloABIMultiToken = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "uint40",
          name: "_roundDuration",
          type: "uint40",
        },
        {
          internalType: "uint256",
          name: "_valuePerEntry",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_protocolFeeRecipient",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "_protocolFeeBp",
          type: "uint16",
        },
        {
          internalType: "uint40",
          name: "_maximumNumberOfParticipantsPerRound",
          type: "uint40",
        },
        {
          internalType: "address",
          name: "_keeper",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "EnforcedPause",
      type: "error",
    },
    {
      inputs: [],
      name: "ExpectedPause",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [],
      name: "ReentrancyGuardReentrantCall",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "normalizedValue",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "entryCount",
          type: "uint256",
        },
      ],
      name: "Deposited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "depositIndices",
          type: "uint256[]",
        },
      ],
      name: "DepositsWithdrawn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "FundsRescued",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newKeeper",
          type: "address",
        },
      ],
      name: "KeeperUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint40",
          name: "maximumNumberOfParticipantsPerRound",
          type: "uint40",
        },
      ],
      name: "MaximumNumberOfParticipantsPerRoundUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "isAllowed",
          type: "bool",
        },
      ],
      name: "OutflowAllowedUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "winner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "depositIndices",
          type: "uint256[]",
        },
      ],
      name: "PrizesClaimed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint16",
          name: "protocolFeeBp",
          type: "uint16",
        },
      ],
      name: "ProtocolFeeBpUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "ProtocolFeePayment",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "protocolFeeRecipient",
          type: "address",
        },
      ],
      name: "ProtocolFeeRecipientUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint40",
          name: "roundDuration",
          type: "uint40",
        },
      ],
      name: "RoundDurationUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum Kuro.RoundStatus",
          name: "status",
          type: "uint8",
        },
      ],
      name: "RoundStatusUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "valuePerEntry",
          type: "uint256",
        },
      ],
      name: "RoundValuePerEntryUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minDeposit",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ratio",
          type: "uint256",
        },
      ],
      name: "SupportedTokenAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minDeposit",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "ratio",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isActive",
          type: "bool",
        },
      ],
      name: "SupportedTokenEdited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "SupportedTokenRemoved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Unpaused",
      type: "event",
    },
    {
      inputs: [],
      name: "MINIMUM_PLAYERS_FOR_VALID_ROUND",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "minDeposit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ratio",
          type: "uint256",
        },
      ],
      name: "addSupportedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "cancel",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "roundId",
              type: "uint256",
            },
            {
              internalType: "uint256[]",
              name: "depositIndices",
              type: "uint256[]",
            },
          ],
          internalType: "struct Kuro.WithdrawalCalldata",
          name: "withdrawalCalldata",
          type: "tuple",
        },
      ],
      name: "claimPrizes",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "currentRoundId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "drawWinner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "minDeposit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ratio",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool",
        },
      ],
      name: "editSupportedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "depositIndex",
          type: "uint256",
        },
      ],
      name: "getDeposit",
      outputs: [
        {
          internalType: "address",
          name: "depositor",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "entryCount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "withdrawn",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "getDepositsCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "userAddress",
          type: "address",
        },
      ],
      name: "getRoundData",
      outputs: [
        {
          components: [
            {
              internalType: "enum Kuro.RoundStatus",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "uint40",
              name: "startTime",
              type: "uint40",
            },
            {
              internalType: "uint40",
              name: "endTime",
              type: "uint40",
            },
            {
              internalType: "uint40",
              name: "drawnAt",
              type: "uint40",
            },
            {
              internalType: "uint40",
              name: "numberOfParticipants",
              type: "uint40",
            },
            {
              internalType: "address",
              name: "winner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "totalValue",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "totalEntries",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "protocolFeeOwed",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "prizesClaimed",
              type: "bool",
            },
          ],
          internalType: "struct Kuro.RoundInfo",
          name: "roundInfo",
          type: "tuple",
        },
        {
          internalType: "address[]",
          name: "participants",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "userDepositIndices",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "systemParams",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "getRoundInfo",
      outputs: [
        {
          internalType: "enum Kuro.RoundStatus",
          name: "status",
          type: "uint8",
        },
        {
          internalType: "uint40",
          name: "startTime",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "endTime",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "drawnAt",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "numberOfParticipants",
          type: "uint40",
        },
        {
          internalType: "address",
          name: "winner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "totalValue",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalEntries",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "protocolFeeOwed",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "prizesClaimed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "getRoundParticipants",
      outputs: [
        {
          internalType: "address[]",
          name: "participants",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "getRoundTokenBalances",
      outputs: [
        {
          internalType: "address[]",
          name: "tokens",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "balances",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getSupportedTokens",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "getUserDepositIndices",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "getUserDepositsInRound",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "userAddress",
              type: "address",
            },
            {
              components: [
                {
                  internalType: "address",
                  name: "tokenAddress",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              internalType: "struct Kuro.TokenDeposit[]",
              name: "deposits",
              type: "tuple[]",
            },
          ],
          internalType: "struct Kuro.UserDeposits[]",
          name: "users",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "user",
          type: "address",
        },
      ],
      name: "hasUserWithdrawnDeposits",
      outputs: [
        {
          internalType: "bool",
          name: "hasWithdrawn",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "keeper",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maximumNumberOfParticipantsPerRound",
      outputs: [
        {
          internalType: "uint40",
          name: "",
          type: "uint40",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "outflowAllowed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "protocolFeeBp",
      outputs: [
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "protocolFeeRecipient",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "removeSupportedToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "rescueFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "roundDuration",
      outputs: [
        {
          internalType: "uint40",
          name: "",
          type: "uint40",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "rounds",
      outputs: [
        {
          internalType: "enum Kuro.RoundStatus",
          name: "status",
          type: "uint8",
        },
        {
          internalType: "uint40",
          name: "startTime",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "endTime",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "drawnAt",
          type: "uint40",
        },
        {
          internalType: "uint40",
          name: "numberOfParticipants",
          type: "uint40",
        },
        {
          internalType: "address",
          name: "winner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "totalValue",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalEntries",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "protocolFeeOwed",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "prizesClaimed",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "supportedTokens",
      outputs: [
        {
          internalType: "bool",
          name: "isSupported",
          type: "bool",
        },
        {
          internalType: "uint8",
          name: "decimals",
          type: "uint8",
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "minDeposit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ratio",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "toggleOutflowAllowed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "togglePaused",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "tokenList",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newKeeper",
          type: "address",
        },
      ],
      name: "updateKeeper",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint40",
          name: "_maximumNumberOfParticipantsPerRound",
          type: "uint40",
        },
      ],
      name: "updateMaximumNumberOfParticipantsPerRound",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint16",
          name: "_protocolFeeBp",
          type: "uint16",
        },
      ],
      name: "updateProtocolFeeBp",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_protocolFeeRecipient",
          type: "address",
        },
      ],
      name: "updateProtocolFeeRecipient",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint40",
          name: "_roundDuration",
          type: "uint40",
        },
      ],
      name: "updateRoundDuration",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_valuePerEntry",
          type: "uint256",
        },
      ],
      name: "updateValuePerEntry",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "valuePerEntry",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "roundId",
              type: "uint256",
            },
            {
              internalType: "uint256[]",
              name: "depositIndices",
              type: "uint256[]",
            },
          ],
          internalType: "struct Kuro.WithdrawalCalldata",
          name: "withdrawalCalldata",
          type: "tuple",
        },
      ],
      name: "withdrawDeposits",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ] as const;