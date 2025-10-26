import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MainModule = buildModule("MainModule", (m) => {
  // Deploy Main_Contract
  const mainContract = m.contract("Main_Contract");

  // Deploy Groth16Verifier (Circuit A)
  const verifierA = m.contract("Groth16Verifier");

  // Deploy Groth16VerifierB (Circuit B)
  const verifierB = m.contract("Groth16VerifierB");

  // Deploy Burner_Verifier with dependencies
  const burnerVerifier = m.contract("Burner_Verifier", [mainContract, verifierA]);

  // Deploy Minter_Verifier with dependencies
  const minterVerifier = m.contract("Minter_Verifier", [
    mainContract,
    verifierA,
    verifierB,
  ]);

  return {
    mainContract,
    verifierA,
    verifierB,
    burnerVerifier,
    minterVerifier,
  };
});

export default MainModule;
