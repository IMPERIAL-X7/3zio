# Smart Contracts - 3ZIO Bridge# Sample Hardhat 3 Beta Project (`node:test` and `viem`)



This folder contains the Solidity smart contracts for the 3ZIO zero-knowledge cross-chain bridge.This project showcases a Hardhat 3 Beta project using the native Node.js test runner (`node:test`) and the `viem` library for Ethereum interactions.



## 📁 Contract StructureTo learn more about the Hardhat 3 Beta, please visit the [Getting Started guide](https://hardhat.org/docs/getting-started#getting-started-with-hardhat-3). To share your feedback, join our [Hardhat 3 Beta](https://hardhat.org/hardhat3-beta-telegram-group) Telegram group or [open an issue](https://github.com/NomicFoundation/hardhat/issues/new) in our GitHub issue tracker.



```## Project Overview

contract/

├── contracts/This example project includes:

│   ├── main.sol              # Core balance management contract

│   ├── Verifier.sol          # Circuit A verifier (auto-generated)- A simple Hardhat configuration file.

│   ├── VerifierB.sol         # Circuit B verifier (auto-generated)- Foundry-compatible Solidity unit tests.

│   ├── burner_verfier.sol    # Burn operation controller- TypeScript integration tests using [`node:test`](nodejs.org/api/test.html), the new Node.js native test runner, and [`viem`](https://viem.sh/).

│   ├── minter_verifier.sol   # Mint operation controller- Examples demonstrating how to connect to different types of networks, including locally simulating OP mainnet.

│   ├── data_types.sol        # Shared data structures

│   └── Counter.sol           # Test contract (not deployed)## Usage

├── scripts/

│   ├── test-simple.js        # Integration tests### Running Tests

│   └── setup-phase2.js       # Controller configuration

├── deployments/To run all the tests in the project, execute the following command:

│   ├── SEPOLIA_DEPLOYMENT.md # Deployment documentation

│   └── sepolia-deployment.json # Machine-readable addresses```shell

├── ignition/modules/npx hardhat test

│   └── Main.ts               # Hardhat Ignition deployment module```

└── test/                     # Contract unit tests

```You can also selectively run the Solidity or `node:test` tests:



---```shell

npx hardhat test solidity

## 🏗️ Contract Overviewnpx hardhat test nodejs

```

### Main_Contract

### Make a deployment to Sepolia

**Purpose:** Core balance management with public and private balances.

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

**Key Features:**

- Public balance tracking (transparent)To run the deployment to a local chain:

- Private balance commitments (hidden via Poseidon hash)

- Nullifier registry for double-spend prevention```shell

- Controller-based access controlnpx hardhat ignition deploy ignition/modules/Counter.ts

```

**Key Functions:**

```solidityTo run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

function getbalance(address user) external view returns (balance_data memory)

function burner(address user, uint256 curr_pub_balance, uint256 new_priv_balance, uint256 nullifier) external payable onlyBurnerYou can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

function minter(address user, uint256 curr_pub_balance, uint256 new_priv_balance, uint256 nullifier) external payable onlyMinter

function setBurnController(address _controller) external onlyOwnerTo set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

function setMintController(address _controller) external onlyOwner

``````shell

npx hardhat keystore set SEPOLIA_PRIVATE_KEY

**State Variables:**```

```solidity

mapping(address => balance_data) private balancesAfter setting the variable, you can run the deployment with the Sepolia network:

mapping(uint256 => bool) private unminted_proofs  // Nullifier tracking

address public burn_controller```shell

address public mint_controllernpx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts

address public owner```

```

---

### Groth16Verifier (Circuit A)

**Auto-generated from:** `circuits/update_balance.circom`

**Purpose:** Verifies zk-SNARK proofs for balance state transitions.

**Public Signals (5):**
1. `old_commitment` - Previous balance commitment
2. `new_commitment` - Updated balance commitment
3. `curr_pub_balance` - Current public balance
4. `new_priv_balance` - New private balance
5. `nullifier` - Unique proof identifier

**Key Function:**
```solidity
function verifyProof(
    uint[2] memory _pA,
    uint[2][2] memory _pB,
    uint[2] memory _pC,
    uint[5] memory _pubSignals
) public view returns (bool)
```

---

### Groth16VerifierB (Circuit B)

**Auto-generated from:** `circuits/proofB.circom`

**Purpose:** Verifies zk-SNARK proofs for amount validation.

**Public Signals (3):**
1. `old_commitment` - Previous commitment
2. `new_commitment` - New commitment
3. `amount_hash` - Poseidon hash of transfer amount

**Key Function:**
```solidity
function verifyProof(
    uint[2] memory _pA,
    uint[2][2] memory _pB,
    uint[2] memory _pC,
    uint[3] memory _pubSignals
) public view returns (bool)
```

---

### Burner_Verifier

**Purpose:** Handles burn operations on source chain with ZK verification.

**Dependencies:**
- `Main_Contract` - For balance updates
- `Groth16Verifier` - For proof verification

**Key Function:**
```solidity
function BurnerVerifier(Proof calldata proof) external payable
```

**Flow:**
1. Extracts public signals from proof
2. Verifies proof via `Groth16Verifier`
3. If valid, calls `Main_Contract.burner()` to update balances
4. Records nullifier to prevent reuse

---

### Minter_Verifier

**Purpose:** Handles mint operations on destination chain with dual ZK verification.

**Dependencies:**
- `Main_Contract` - For balance updates
- `Groth16Verifier` - For Circuit A proof
- `Groth16VerifierB` - For Circuit B proof

**Key Function:**
```solidity
function Minter_VerifierVerifier(Proof calldata proof_A, ProofB calldata proof_B) external payable
```

**Flow:**
1. Verifies both proofs independently
2. Validates `amount_hash` matches between proofs
3. Checks nullifier hasn't been used
4. If all checks pass, calls `Main_Contract.minter()`

---

## 🚀 Deployment

### Prerequisites

```bash
pnpm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Deploy to Sepolia

```bash
# Set environment variables
echo "SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" > .env
echo "PRIVATE_KEY=your_private_key_here" >> .env

# Deploy using Hardhat Ignition
npx hardhat ignition deploy ./ignition/modules/Main.ts --network sepolia
```

### Configure Controllers (Post-Deployment)

```bash
SEPOLIA_PRIVATE_KEY=<your-key> node scripts/setup-phase2.js
```

This script:
1. Verifies ownership
2. Sets `burn_controller` to `Burner_Verifier` address
3. Sets `mint_controller` to `Minter_Verifier` address

---

## 🧪 Testing

### Run Integration Tests

```bash
SEPOLIA_PRIVATE_KEY=<your-key> node scripts/test-simple.js
```

**Tests performed:**
1. ✅ Owner verification
2. ✅ Balance query functionality
3. ✅ Burn controller configuration
4. ✅ Mint controller configuration
5. ✅ Burner_Verifier reference validation
6. ✅ Minter_Verifier reference validation

### Run Unit Tests

```bash
npx hardhat test
```

---

## 📡 Live Deployment (Sepolia)

**Network:** Sepolia Testnet (Chain ID: 11155111)  
**Deployment Date:** October 26, 2025  
**Status:** ✅ Fully Operational

### Contract Addresses

| Contract | Address | Etherscan |
|----------|---------|-----------|
| **Main_Contract** | `0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB` | [View](https://sepolia.etherscan.io/address/0xb21AD25eC6d65d92C998c76a22b3f5Dce2F9F7CB) |
| **Groth16Verifier** | `0x99923435d5774c962dC5c604Ee9970748E9FD0E2` | [View](https://sepolia.etherscan.io/address/0x99923435d5774c962dC5c604Ee9970748E9FD0E2) |
| **Groth16VerifierB** | `0x777B6C1bB0608621f8d2AAd364890267A4488Ce1` | [View](https://sepolia.etherscan.io/address/0x777B6C1bB0608621f8d2AAd364890267A4488Ce1) |
| **Burner_Verifier** | `0x8Da48CfBCFC981c0f4342D8c3e22cd5A5cB41eCE` | [View](https://sepolia.etherscan.io/address/0x8Da48CfBCFC981c0f4342D8c3e22cd5A5cB41eCE) |
| **Minter_Verifier** | `0x78CAb97E087b7696eE31e0cdDCA25AcaA568C237` | [View](https://sepolia.etherscan.io/address/0x78CAb97E087b7696eE31e0cdDCA25AcaA568C237) |

See [`deployments/SEPOLIA_DEPLOYMENT.md`](deployments/SEPOLIA_DEPLOYMENT.md) for complete deployment details.

---

## 🔧 Configuration

### Hardhat Configuration

Key settings in `hardhat.config.ts`:

```typescript
{
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
}
```

### Environment Variables

Create `.env` file:

```bash
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here
```

**Note:** `.env` is git-ignored for security.

---

## 📝 Data Structures

### Proof (Circuit A)

```solidity
struct Proof {
    uint[2] A;
    uint[2][2] B;
    uint[2] C;
    uint[] _publicSignals;  // 5 signals
}
```

### ProofB (Circuit B)

```solidity
struct ProofB {
    uint[2] A;
    uint[2][2] B;
    uint[2] C;
    uint[3] _publicSignals;  // 3 signals
}
```

### balance_data

```solidity
struct balance_data {
    uint256 pub_balance;   // Public, visible balance
    uint256 priv_balance;  // Private, commitment only
}
```

---

## 🔒 Security Considerations

### Access Control

- **Owner Functions:** Only contract owner can set controllers
- **Controller Functions:** Only authorized controllers can update balances
- **Modifiers:** `onlyOwner`, `onlyBurner`, `onlyMinter`

### Nullifier System

```solidity
mapping(uint256 => bool) private unminted_proofs;
```

- Prevents double-spending
- Tracks used proofs
- Set to `true` on burn, `false` on mint

### Proof Verification

- All proofs verified via auto-generated Groth16 verifiers
- Invalid proofs revert transaction
- Proof data must match circuit constraints

---

## 📊 Gas Estimates

| Operation | Estimated Gas | Notes |
|-----------|--------------|-------|
| Deploy Main_Contract | ~1.5M gas | One-time |
| Deploy Verifier | ~2.5M gas | Per verifier |
| Burn Operation | ~250K gas | Includes proof verification |
| Mint Operation | ~350K gas | Dual proof verification |
| Set Controller | ~50K gas | Admin function |

*Estimates based on Sepolia deployment. Actual gas may vary.*

---

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Clean build artifacts
npx hardhat clean

# Start local node
npx hardhat node

# Deploy locally
npx hardhat ignition deploy ./ignition/modules/Main.ts --network localhost

# Verify on Etherscan (optional)
npx hardhat verify --network sepolia <contract_address>
```

---

## 📚 Additional Resources

- **Hardhat Documentation:** https://hardhat.org/docs
- **Groth16 Proofs:** https://github.com/iden3/snarkjs
- **Circom Language:** https://docs.circom.io/

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** Compilation errors with verifier contracts  
**Solution:** Regenerate verifiers from circuits using snarkJS

**Issue:** "Not authorized" error  
**Solution:** Ensure controllers are set via `setup-phase2.js`

**Issue:** Proof verification fails  
**Solution:** Check public signals match circuit outputs exactly

**Issue:** Transaction reverts with "Proof already used"  
**Solution:** Nullifier has been consumed, generate new proof

---

## 📞 Support

For contract-specific questions:
1. Check contract comments in `contracts/`
2. Review test cases in `test/`
3. Examine deployment logs in `deployments/`

---

**Last Updated:** October 26, 2025  
**Solidity Version:** 0.8.28  
**Framework:** Hardhat 3.0.9
