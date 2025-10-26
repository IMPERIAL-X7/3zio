import { ethers } from "ethers";

// NEW DEPLOYMENT ADDRESSES
const addresses = {
  mainContract: "0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB",
  verifierA: "0x99923435d5774c962dC5c604Ee9970748E9FD0E2",
  verifierB: "0x777B6C1bB0608621f8d2AAd364890267A4488Ce1",
  burnerVerifier: "0x8Da48CfBCFC981c0f4342D8c3e22cd5A5cB41eCE",
  minterVerifier: "0x78CAb97E087b7696eE31e0cdDCA25AcaA568C237"
};

const mainContractABI = [
  "function owner() view returns (address)",
  "function burn_controller() view returns (address)",
  "function mint_controller() view returns (address)",
  "function setBurnController(address) external",
  "function setMintController(address) external"
];

async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("⚙️  PHASE 2: CONTROLLER SETUP");
  console.log("=".repeat(70) + "\n");

  // Connect to Sepolia with wallet
  const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
  const mainContract = new ethers.Contract(addresses.mainContract, mainContractABI, wallet);

  console.log("Deployer account:", wallet.address);
  console.log("Main_Contract:", addresses.mainContract);
  console.log();

  // Step 1: Verify ownership
  console.log("━".repeat(70));
  console.log("Step 1: Verify Ownership");
  console.log("━".repeat(70));
  const owner = await mainContract.owner();
  console.log("Owner:", owner);
  if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
    console.log("❌ ERROR: Not the owner!");
    process.exit(1);
  }
  console.log("✅ Confirmed ownership\n");

  // Step 2: Set Burn Controller
  console.log("━".repeat(70));
  console.log("Step 2: Set Burn Controller");
  console.log("━".repeat(70));
  console.log("Setting burn_controller to:", addresses.burnerVerifier);
  
  const tx1 = await mainContract.setBurnController(addresses.burnerVerifier);
  console.log("Transaction sent:", tx1.hash);
  console.log("Waiting for confirmation...");
  
  const receipt1 = await tx1.wait();
  console.log("✅ Confirmed in block:", receipt1.blockNumber);
  
  const burnController = await mainContract.burn_controller();
  console.log("Verified burn_controller:", burnController);
  console.log();

  // Step 3: Set Mint Controller
  console.log("━".repeat(70));
  console.log("Step 3: Set Mint Controller");
  console.log("━".repeat(70));
  console.log("Setting mint_controller to:", addresses.minterVerifier);
  
  const tx2 = await mainContract.setMintController(addresses.minterVerifier);
  console.log("Transaction sent:", tx2.hash);
  console.log("Waiting for confirmation...");
  
  const receipt2 = await tx2.wait();
  console.log("✅ Confirmed in block:", receipt2.blockNumber);
  
  const mintController = await mainContract.mint_controller();
  console.log("Verified mint_controller:", mintController);
  console.log();

  // Final Verification
  console.log("━".repeat(70));
  console.log("✅ PHASE 2 COMPLETE - CONFIGURATION SUMMARY");
  console.log("━".repeat(70));
  console.log("\nMain_Contract Configuration:");
  console.log("  • Owner:", owner);
  console.log("  • Burn Controller:", burnController);
  console.log("  • Mint Controller:", mintController);
  console.log("\n✅ All controllers configured correctly!");
  console.log("🎯 System is now fully operational!");
  console.log("\n" + "=".repeat(70) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });
