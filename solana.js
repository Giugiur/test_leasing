var publicKey = '';
const { SystemProgram, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey } = solanaWeb3,
  { Provider, Program, BN } = web3,
  { Token, TOKEN_PROGRAM_ID } = splToken,
  { Buffer } = buffer,
  idl = {
  "version": "0.1.0",
  "name": "star_atlas_lending",
  "constants": [
    {
      "name": "COLLATERAL_CLAIM_BUFFER_HOURS",
      "type": "u16",
      "value": "24"
    },
    {
      "name": "MIN_TERM_IN_HOURS",
      "type": "u16",
      "value": "1"
    },
    {
      "name": "SECONDS_IN_HOUR",
      "type": "u16",
      "value": "3600"
    },
    {
      "name": "ATLAS",
      "type": {
        "defined": "&str"
      },
      "value": "\"ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx\""
    },
    {
      "name": "USDC",
      "type": {
        "defined": "&str"
      },
      "value": "\"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\""
    },
    {
      "name": "COLLATERAL_ESCROW",
      "type": {
        "defined": "&[u8]"
      },
      "value": "b\"jpsal:collateral_escrow\""
    },
    {
      "name": "LEASE",
      "type": {
        "defined": "&[u8]"
      },
      "value": "b\"jpsal:lease\""
    },
    {
      "name": "LISTING",
      "type": {
        "defined": "&[u8]"
      },
      "value": "b\"jpsal:listing\""
    }
  ],
  "instructions": [
    {
      "name": "claimCollateral",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lease",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeLease",
      "accounts": [
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lease",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeListing",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shipAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createListing",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shipAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shipMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeDestination",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "feeMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "listingBump",
          "type": "u8"
        },
        {
          "name": "params",
          "type": {
            "defined": "NewListingParams"
          }
        }
      ]
    },
    {
      "name": "extendLease",
      "accounts": [
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "lease",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "extensionInHours",
          "type": "u16"
        }
      ]
    },
    {
      "name": "payLeaseFees",
      "accounts": [
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "listing",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lease",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "returnShip",
      "accounts": [
        {
          "name": "borrower",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lease",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shipAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startLease",
      "accounts": [
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "lease",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collateralMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "listing",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "shipAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeSource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "feeDestination",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "leaseBump",
          "type": "u8"
        },
        {
          "name": "escrowBump",
          "type": "u8"
        },
        {
          "name": "params",
          "type": {
            "defined": "NewLeaseParams"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Lease",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "listing",
            "type": "publicKey"
          },
          {
            "name": "borrower",
            "type": "publicKey"
          },
          {
            "name": "collateralMint",
            "type": "publicKey"
          },
          {
            "name": "collateralEscrow",
            "type": "publicKey"
          },
          {
            "name": "collateralEscrowBump",
            "type": "u8"
          },
          {
            "name": "startTime",
            "type": "u64"
          },
          {
            "name": "endTime",
            "type": "u64"
          },
          {
            "name": "pendingFeeBalance",
            "type": "u64"
          },
          {
            "name": "returned",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "shipAccount",
            "type": "publicKey"
          },
          {
            "name": "shipMint",
            "type": "publicKey"
          },
          {
            "name": "feeDestination",
            "type": "publicKey"
          },
          {
            "name": "feeMint",
            "type": "publicKey"
          },
          {
            "name": "collateral",
            "type": {
              "option": {
                "defined": "CollateralRequirement"
              }
            }
          },
          {
            "name": "feePerHour",
            "type": "u64"
          },
          {
            "name": "requirePrepay",
            "type": "bool"
          },
          {
            "name": "remainingLeasableHours",
            "type": "u16"
          },
          {
            "name": "guild",
            "type": {
              "option": {
                "defined": "GuildTag"
              }
            }
          },
          {
            "name": "open",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CollateralRequirement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minimum",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "GuildTag",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "NewListingParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feePerHour",
            "type": "u64"
          },
          {
            "name": "guild",
            "type": {
              "option": {
                "defined": "GuildTag"
              }
            }
          },
          {
            "name": "maxTermInHours",
            "type": "u16"
          },
          {
            "name": "minCollateral",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "requirePrepay",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "NewLeaseParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "guild",
            "type": {
              "option": {
                "defined": "GuildTag"
              }
            }
          },
          {
            "name": "termInHours",
            "type": "u16"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "LeaseCreated",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "borrower",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "endTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LeaseExtended",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "newEndTime",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ListingCreated",
      "fields": [
        {
          "name": "pubkey",
          "type": "publicKey",
          "index": true
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "CollateralClaimAfterReturn",
      "msg": "Attempting to claim borrower collateral after they have returned the lease."
    },
    {
      "code": 6001,
      "name": "CollateralClaimEmpty",
      "msg": "The collateral escrow account is empty and has nothing to claim."
    },
    {
      "code": 6002,
      "name": "CollateralClaimWithoutBuffer",
      "msg": "Attempting to claim borrower colllateral within the allocated buffer time."
    },
    {
      "code": 6003,
      "name": "CollateralMintMismatch",
      "msg": "The mint of the collateral source or escrow does not match the required mint."
    },
    {
      "code": 6004,
      "name": "CollateralSourceBalanceInsufficient",
      "msg": "The balance of the collateral source is insufficient for the lease requirement."
    },
    {
      "code": 6005,
      "name": "CollateralValueInsufficient",
      "msg": "The value of the posted collateral is insufficient for the listing."
    },
    {
      "code": 6006,
      "name": "ExtendingExpiredLease",
      "msg": "Attempting to extend a lease that has already expired."
    },
    {
      "code": 6007,
      "name": "ExtendingNewLease",
      "msg": "Attempting to extend a lease that has not been active for over an hour."
    },
    {
      "code": 6008,
      "name": "ExtendingReturnedLease",
      "msg": "Attempting to extend a lease that has already been returned to the owner."
    },
    {
      "code": 6009,
      "name": "FeeMintMismatch",
      "msg": "The mint of the fee source or destination does not match the required mint."
    },
    {
      "code": 6010,
      "name": "FeeSourceBalanceInsufficient",
      "msg": "The balance of the fee source is insufficient for the required lease fee."
    },
    {
      "code": 6011,
      "name": "GuildLockMismatch",
      "msg": "The provided guild tag for the borrower did not match the listing required guild."
    },
    {
      "code": 6012,
      "name": "InvalidFeeMint",
      "msg": "The provided fee mint did not match either USDC or ATLAS mints."
    },
    {
      "code": 6013,
      "name": "LeaseClosureBeforePayment",
      "msg": "Attempting to close a lease prior to payment all pending fees."
    },
    {
      "code": 6014,
      "name": "LeaseClosureBeforeShipReturn",
      "msg": "Attempting to close a lease prior to returning the leased ship."
    },
    {
      "code": 6015,
      "name": "LeaseCollateralInsufficient",
      "msg": "The lease does not provide the collateral that is required by the listing."
    },
    {
      "code": 6016,
      "name": "LeaseFeeAlreadyPaid",
      "msg": "Attempting to pay a lease fee that was already marked as paid."
    },
    {
      "code": 6017,
      "name": "LeasePostPaymentPriorToReturn",
      "msg": "Attempting to post-pay a lease fee prior to returning to borrowed asset(s)."
    },
    {
      "code": 6018,
      "name": "ListingIsNotOpen",
      "msg": "The provided listing should be open but has been marked as closed."
    },
    {
      "code": 6019,
      "name": "ListingIsOpen",
      "msg": "The provided listing should be closed but is still marked as open."
    },
    {
      "code": 6020,
      "name": "ListingNotEligibleForClosing",
      "msg": "Attempting to close a listing that is leased or has remaining leasable hours."
    },
    {
      "code": 6021,
      "name": "ListingRequiresPrePayment",
      "msg": "Attempting to post-pay lease fee for a listing that requires pre-payment."
    },
    {
      "code": 6022,
      "name": "MaxTermNotGreaterThanMinimum",
      "msg": "The provided max term in hours was not greater than the minimum."
    },
    {
      "code": 6023,
      "name": "MintHasAuthority",
      "msg": "The token mint has a non-disabled mint authority."
    },
    {
      "code": 6024,
      "name": "NonZeroMintDecimals",
      "msg": "The token mint has a non-zero decimals value."
    },
    {
      "code": 6025,
      "name": "ShipAccountShouldContainOne",
      "msg": "The balance on the nft ship account should equal 1."
    },
    {
      "code": 6026,
      "name": "ShipMintMismatch",
      "msg": "The ship token account did not match the mint provided."
    },
    {
      "code": 6027,
      "name": "TermNotWithinBounds",
      "msg": "The offer term in hours is not between 1 and the maximum set by the listing."
    },
    {
      "code": 6028,
      "name": "TokenAccountOwnerMismatch",
      "msg": "The token account owner did not match the owner provided."
    }
  ]
  },
  network = clusterApiUrl('devnet'),
  opts = {
    preflightCommitment: "processed"
  },
  connection = new Connection(network, opts.preflightCommitment),
  programID = '3691iwYqSCkfAMgBc3SqJ7R5hz8CFDYWbCuKr1swqhGr', //TODO: Get the program ID from the IDL
  getProvider = () => {
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  },
  setPublicKey = (key) => {
    publicKey = key;
  };

window.connect = async function connect() {
  const resp = await window.solana.connect();
  setPublicKey(resp.publicKey.toString());
  return resp.publicKey.toString();
}

window.isPhantomInstalled = function isPhantomInstalled() {
  return window.solana && window.solana.isPhantom;
}

window.disconnect = function disconnect() {
  window.solana.disconnect();
}

window.createListing = async function createListing(maxHoursToLease, ratePerHour, collateralValue, listsToGuild, requirePrepayment, mint) {
  const decoded = bs58.decode('secret key'),//TODO: Remove this
    wallet = Keypair.fromSecretKey(decoded); //TODO: change to provider.wallet?
  try {
    const provider = getProvider(),
      program = new Program(idl, programID, provider),
      jpSalListing = 'jpsal:listing', //TODO: get this from IDL->constants
      shipMint = await Token.createMint(
        connection,
        wallet,
        wallet.publicKey,
        null,
        9,
        TOKEN_PROGRAM_ID,
      ),
      atlasMint = await Token.createMint(
        program.provider.connection,
        wallet,
        wallet.publicKey,
        null,
        8,
        TOKEN_PROGRAM_ID
      ),
      collateralMint = await Token.createMint(
        program.provider.connection,
        wallet,
        wallet.publicKey,
        null,
        0,
        TOKEN_PROGRAM_ID
      ),
      shipAccount = await shipMint.createAssociatedTokenAccount(wallet.publicKey),
      shipMintAddress = new PublicKey(mint), //TODO: Get ship's mint address
      atlasMintAddress = new PublicKey('ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx'),
      feeDestination = await atlasMint.createAssociatedTokenAccount(wallet.publicKey),
      [listingPubkey, listingBump] = await PublicKey.findProgramAddress(
        [Buffer.from(jpSalListing), wallet.publicKey.toBytes(), shipMint.publicKey.toBytes()],
        program.programId
      ),
      params = {
        feePerHour: new BN(ratePerHour),
        guild: listsToGuild,
        maxTermInHours: maxHoursToLease,
        minCollateral: new BN(collateralValue),
        requirePrepay: requirePrepayment
      };
      await program.instruction.createListing(
        listingBump,
        params, {
        accounts: {
          owner: wallet.publicKey,
          listing: listingPubkey,
          shipAccount: shipAccount,
          shipMint: shipMint.publicKey,
          collateralMint: collateralMint.publicKey,
          feeDestination: feeDestination,
          feeMint: atlasMint.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        },
        signers: [wallet]
      });
      //getListing();
      console.log();
  } catch (error) {
    console.log("Error while creating the listing", error)
  }
}

var solanaWeb3Module = {
  connect : connect,
  isPhantomInstalled : isPhantomInstalled,
  disconnect : disconnect,
  createListing: createListing,
};