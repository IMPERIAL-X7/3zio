import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("Basic Contract Tests", function () {
  let mainContract: any;
  let verifierA: any;
  let verifierB: any;
  let burnerVerifier: any;
  let minterVerifier: any;
  let owner: any;
  let user: any;

  before(async function () {
    const accounts = await hre.viem.getWalletClients();
    owner = accounts[0];
    user = accounts[1];
  });

  describe("Main_Contract Deployment", function () {
    it("Should deploy Main_Contract successfully", async function () {
      const mainContractFactory = await hre.viem.deployContract("Main_Contract");
      mainContract = mainContractFactory;
      
      expect(mainContract.address).to.be.properAddress;
      console.log("✅ Main_Contract deployed at:", mainContract.address);
    });

    it("Should set the correct owner", async function () {
      const ownerAddress = await mainContract.read.owner();
      expect(ownerAddress.toLowerCase()).to.equal(owner.account.address.toLowerCase());
      console.log("✅ Owner set correctly:", ownerAddress);
    });

    it("Should return zero balances for new user", async function () {
      const balance = await mainContract.read.getbalance([user.account.address]);
      expect(balance.pub_balance).to.equal(0n);
      expect(balance.priv_balance).to.equal(0n);
      console.log("✅ New user has zero balances");
    });
  });

  describe("Verifier Contracts Deployment", function () {
    it("Should deploy Groth16Verifier (Circuit A)", async function () {
      const verifierFactory = await hre.viem.deployContract("Groth16Verifier");
      verifierA = verifierFactory;
      
      expect(verifierA.address).to.be.properAddress;
      console.log("✅ Groth16Verifier (A) deployed at:", verifierA.address);
    });

    it("Should deploy Groth16VerifierB (Circuit B)", async function () {
      const verifierBFactory = await hre.viem.deployContract("Groth16VerifierB");
      verifierB = verifierBFactory;
      
      expect(verifierB.address).to.be.properAddress;
      console.log("✅ Groth16VerifierB (B) deployed at:", verifierB.address);
    });
  });

  describe("Burner_Verifier Deployment", function () {
    it("Should deploy Burner_Verifier with Main_Contract and Verifier", async function () {
      const burnerFactory = await hre.viem.deployContract("Burner_Verifier", [
        mainContract.address,
        verifierA.address
      ]);
      burnerVerifier = burnerFactory;
      
      expect(burnerVerifier.address).to.be.properAddress;
      console.log("✅ Burner_Verifier deployed at:", burnerVerifier.address);
    });

    it("Should have correct references", async function () {
      const realContractAddr = await burnerVerifier.read.real_contract();
      const verifierAddr = await burnerVerifier.read.verifier();
      
      expect(realContractAddr.toLowerCase()).to.equal(mainContract.address.toLowerCase());
      expect(verifierAddr.toLowerCase()).to.equal(verifierA.address.toLowerCase());
      console.log("✅ Burner_Verifier references are correct");
    });
  });

  describe("Minter_Verifier Deployment", function () {
    it("Should deploy Minter_Verifier with all required contracts", async function () {
      const minterFactory = await hre.viem.deployContract("Minter_Verifier", [
        mainContract.address,
        verifierA.address,
        verifierB.address
      ]);
      minterVerifier = minterFactory;
      
      expect(minterVerifier.address).to.be.properAddress;
      console.log("✅ Minter_Verifier deployed at:", minterVerifier.address);
    });

    it("Should have correct references", async function () {
      const realContractAddr = await minterVerifier.read.real_contract();
      const verifierAAddr = await minterVerifier.read.A_verifier();
      const verifierBAddr = await minterVerifier.read.B_verifier();
      
      expect(realContractAddr.toLowerCase()).to.equal(mainContract.address.toLowerCase());
      expect(verifierAAddr.toLowerCase()).to.equal(verifierA.address.toLowerCase());
      expect(verifierBAddr.toLowerCase()).to.equal(verifierB.address.toLowerCase());
      console.log("✅ Minter_Verifier references are correct");
    });
  });

  describe("Contract Integration", function () {
    it("Should show all contracts are properly deployed and linked", async function () {
      console.log("\n📋 Deployment Summary:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Main_Contract:      ", mainContract.address);
      console.log("Groth16Verifier:    ", verifierA.address);
      console.log("Groth16VerifierB:   ", verifierB.address);
      console.log("Burner_Verifier:    ", burnerVerifier.address);
      console.log("Minter_Verifier:    ", minterVerifier.address);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("✅ All contracts deployed and integrated successfully!");
    });
  });
});
