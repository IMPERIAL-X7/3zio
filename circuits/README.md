# Circuits 
directory to store all the circuits file 

## intial setup
- install circom [installation setup](https://docs.circom.io/getting-started/installation/)
- basic libraries
```bash
npm init
npm install -g snarkjs
npm install circomlib
```

## compilation 

### Circuit A: update_balance.circom (Burner/Sender Side)
**compilation**
```bash 
# Compile circuit
circom update_balance.circom --r1cs --wasm --sym -l ./node_modules

# Generate proving key (Powers of Tau)
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau --name="First contribution"

# stage2 generation power of tau
snarkjs powersoftau prepare phase2 pot12_final.ptau pot12_final_phase2.ptau -v
snarkjs groth16 setup update_balance.r1cs pot12_final_phase2.ptau update_balance_0000.zkey

#phase 2 ceremony
snarkjs zkey contribute update_balance_0000.zkey update_balance_0001.zkey --name="First contribution" -v

# Generate proving/verifying keys
snarkjs zkey export verificationkey update_balance_0001.zkey update_balance.vkey.json
```
**Verifier generation**
```bash
snarkjs zkey export solidityverifier update_balance_0001.zkey ../contract/contracts/Verifier.sol
```

### Circuit B: proofB.circom (Minter/Receiver Side)
**compilation**
```bash 
# Compile circuit
circom proofB.circom --r1cs --wasm --sym

# Generate proving key (Powers of Tau) - reuse if already generated
# snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
# snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau --name="First contribution"
# snarkjs powersoftau prepare phase2 pot12_final.ptau pot12_final_phase2.ptau

# stage2 generation for proofB
snarkjs groth16 setup proofB.r1cs pot12_final_phase2.ptau proofB_0000.zkey

# Generate proving/verifying keys
snarkjs zkey export verificationkey proofB_0000.zkey proofB.vkey.json
```
**Verifier generation**
```bash
snarkjs zkey export solidityverifier proofB_0000.zkey ../contract/contracts/VerifierB.sol
```

