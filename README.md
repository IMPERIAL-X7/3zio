# EZIO

Private, unlinkable fund transfers powered by zero-knowledge proofs. 3zio enables confidential payments where the transferred amount and sender–receiver linkage remain hidden, while correctness and one‑time spend are enforced on-chain.

<p>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Status" src="https://img.shields.io/badge/status-Research%2FPOC-purple">
</p>

<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;justify-content:space-between">
  <img src="./assets/frontend_1.jpg" alt="App screenshot 1" style="width:48%;max-width:450px;height:auto;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
  <img src="./assets/frontend_2.jpg" alt="App screenshot 2" style="width:48%;max-width:450px;height:auto;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
</div>

## Why 3zio ?
- Built on a modified EIP‑7503 (zk wormhole) flow
- No sender/receiver linkage is preserved
- No linkability through IP or timings
- Transferred amount remains private
- Nullifier prevents double spends

## How it works

![Core protocol](./assets/protocol.jpg)

At a glance:

- `noteC` binds Alice’s private balance deduction to the note Bob can later claim
- `proof_A` proves Alice honestly deducted `n` and posted `noteC`
- `proof_B` proves only the intended recipient (holder of `pk_B`) can claim
- A `nullifier` guarantees each note can be used only once

## Project layout

- `./ezio` – main frontend
- `./contract` – Solidity smart contracts (Hardhat v3)
- `./contract_v2` – next‑gen experiments
- `./circuits` – Circom circuits for zk proofs

## Quickstart

Below are the minimal steps to compile and check the Circom circuits. Frontend and contracts have their own standard workflows; see the respective folders for details.

### Circuits

Compile circuits:

```bash
cd circuits
make
```

Verify constraints/proofs (where applicable):

```bash
make verify
```

### Frontend (ezio)

The `ezio` app is the primary UI. Typical steps are: install deps, set env vars, and start the dev server. See `./ezio` for details.

### Contracts

Contracts live in `./contract` (with additional work in `./contract_v2`). Use a modern Node.js + Hardhat toolchain. See the folders for tasks such as build, test, and deploy.

## Security properties

- Privacy: amount, sender, and receiver are not linkable on‑chain
- Integrity: proofs enforce correct balance updates
- Unlinkability: network‑level correlation reduced (no timing/IP linkage in protocol design)
- One‑time spend: nullifiers prevent note reuse

## Contributing

Issues and PRs are welcome. If you’re proposing a protocol change, please include a short rationale and any security considerations.

## License

MIT © 3zio contributors
