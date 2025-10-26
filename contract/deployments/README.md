# Deployment Records - 3ZIO Bridge

This folder contains deployment records and documentation for all networks.

---

## 📁 Files

| File | Description |
|------|-------------|
| **SEPOLIA_DEPLOYMENT.md** | Human-readable deployment documentation |
| **sepolia-deployment.json** | Machine-readable deployment data |

---

## 📡 Current Deployments

### Sepolia Testnet (Active)

**Status:** ✅ Fully Operational  
**Deployed:** October 26, 2025  
**Chain ID:** 11155111

**Contracts:**
- **Main_Contract:** `0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB`
- **Groth16Verifier:** `0x99923435d5774c962dC5c604Ee9970748E9FD0E2`
- **Groth16VerifierB:** `0x777B6C1bB0608621f8d2AAd364890267A4488Ce1`
- **Burner_Verifier:** `0x8Da48CfBCFC981c0f4342D8c3e22cd5A5cB41eCE`
- **Minter_Verifier:** `0x78CAb97E087b7696eE31e0cdDCA25AcaA568C237`

See [SEPOLIA_DEPLOYMENT.md](./SEPOLIA_DEPLOYMENT.md) for complete details.

---

## 📝 Deployment Data Structure

### sepolia-deployment.json

```json
{
  "network": "sepolia",
  "chainId": 11155111,
  "deploymentDate": "2025-01-XX",
  "deployer": "0xFb93a8DcD5edc3FB6Cb34d77C6811835756c99A0",
  "rpcUrl": "https://ethereum-sepolia-rpc.publicnode.com",
  "version": "2.0-FINAL",
  "status": "OPERATIONAL",
  "contracts": {
    "MainContract": {
      "address": "0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB",
      "etherscan": "https://sepolia.etherscan.io/address/0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB",
      "configuration": {
        "burn_controller": "0x8Da48CfBCFC981c0f4342D8c3e22cd5A5cB41eCE",
        "mint_controller": "0x78CAb97E087b7696eE31e0cdDCA25AcaA568C237"
      }
    },
    ...
  },
  "configuration_transactions": {
    "setBurnController": { ... },
    "setMintController": { ... }
  },
  "testing": {
    "phase1_basic_functionality": "PASSED",
    "phase2_controller_setup": "PASSED"
  }
}
```

---

## 🔗 Quick Links

- **[View Deployment Details](./SEPOLIA_DEPLOYMENT.md)**
- **[Etherscan - Main Contract](https://sepolia.etherscan.io/address/0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB)**
- **[Full Project Summary](../../../DEPLOYMENT_COMPLETE.md)**

---

**Last Updated:** October 26, 2025
