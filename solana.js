  window.connect = async function connect() {
    const resp = await window.solana.connect();
    return resp.publicKey.toString();
  }

  window.isPhantomInstalled = function isPhantomInstalled() {
    return window.solana && window.solana.isPhantom;
  }

  window.disconnect = function disconnect() {
    window.solana.disconnect();
  }

  window.createListing = function createListing(a) {
    console.log('1');
    // const { SystemProgram } = solanaWeb3;
    // const programID = new solanaWeb3.PublicKey(idl.metadata.address);
    // const network = solanaWeb3.clusterApiUrl('devnet');
    // const opts = {
    //   preflightCommitment: "processed"
    // }
    // console.log('2');
    // const getProvider = () => {
    //   const connection = new solanaWeb3.Connection(network, opts.preflightCommitment);
    //   const provider = new solanaWeb3.Provider(
    //     connection, window.solana, opts.preflightCommitment,
    //   );
    //   return provider;
    // }
    // console.log('3');
    // try {
    //   const provider = getProvider(),
    //     program = new solanaWeb3.Program(idl, programID, provider),
    //     listingBump = {},
    //     params = {};
      // await program.rpc.createListing(
      //   listingBump, // ???
      //   params, { // ??? 
      //   accounts: {
      //     owner: , // public key of the ship's owner
      //     listing: , // address of the listing account ?
      //     shipAccount: , // getAssociatedTokenAccount(mint) ?
      //     shipMint: , // mint address of the ship
      //     collateralMint: , // TODO: Didn't we said that collateral should be provided as value not a mint?
      //     feeDestination: , // address of the ATLAS token account of the owner
      //     feeMint: , // ATLAS mint address
      //     tokenProgram: splToken, 
      //     systemProgram: SystemProgram.programID,
      //   },
      //});
    // } catch (error) {
    //   console.log("Error while creating the listing", error)
    // }
  }

  var solanaWeb3Module = {
    connect : connect,
    isPhantomInstalled : isPhantomInstalled,
    disconnect : disconnect,
    createListing: createListing,
  };