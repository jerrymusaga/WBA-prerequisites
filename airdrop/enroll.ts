import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, WbaPrereq } from "./programs/wba_prereq";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
const keypair = getKeypairFromEnvironment("PRIVATE_KEY");

const connection = new Connection("https://api.devnet.solana.com");

// Github account
const github = Buffer.from("jerrymusaga", "utf8");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create our program
const program: Program<WbaPrereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
      })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here:
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
