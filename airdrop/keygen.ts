import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();
console.log(`Publick key: ${keypair.publicKey.toBase58()}`);
console.log(`Secret Key: ${keypair.secretKey}`);
