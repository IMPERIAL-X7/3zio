# 3zio
 A privacy-preserving protocol for transferring funds. It enables atomic private transfers between users without revealing the transferred amount, while ensuring integrity and preventing double-spends.

---

## Core Protocol

### short summary
- `noteC` binds Alice’s private-balance deduction to the note Bob can claim
- `proof_A` proves Alice deducted `n` and posted `noteC` honestly
- `proof_B` proves only recipient (holder of `pk_B`) can claim
- `nullifier` ensures one-time use of notes



### Phase 0: Preconditions
- Alice & Bob have accounts with:
  - `publicBalance`
  - `PrivateCommitment`
- Bob has encryption key `pk_B`
- Alice ensures `Pb[A] + Pr[A] ≥ n`

### Phase 1: Alice Creates Note & Posts Commitment

**Alice (off-chain):**
- Creates `note = (n, pk_B, salt)`
- Computes:
  - `noteC = Commit(n, pk_B, salt)`
  - `C_A' = Commit(Pr_A - n, rA')`
  - Optional: `ct = Enc(pk_B, note || meta)`, `hct = Hash(ct)`
- Generates `proof_A` proving:
  - Correct commitments
  - `noteC` is well-formed
  - Non-negative post-transfer balance

**Alice (on-chain):**
- Posts:
  - `proof_A`
  - `oldCommit = C_A`
  - `newCommit = C_A'`
  - `noteCommit = noteC`
  - `hct` (optional ciphertext pointer)
- Contract:
  - Verifies `proof_A`
  - Updates Alice’s commitment
  - Records `noteC` in registry or emits a `NoteCreated` event


### Phase 2: Alice Sends Ciphertext to Bob (Off-Chain)

- Alice sends `ct` to Bob using a secure channel (e.g., wallet message, IPFS, Signal)
- Bob decrypts to get `note` and verifies that `noteC = Commit(n, pk_B, salt)` matches the on-chain `noteC`


### Phase 3: Bob Claims the Note

**Bob (off-chain):**
- Decrypts `ct` to get `note`
- Builds `proof_B` proving:
  - Knowledge of `n`, `salt`, `sk_B`
  - Correct opening of `noteC`
  - Ownership of `pk_B`
  - Updated commitment `C_B' = Commit(Pr_B + n, rB')`
  - Optional: outputs nullifier `N`

**Bob (on-chain):**
- Posts:
  - `proof_B`
  - `noteCommit = noteC`
  - `oldCommit = C_B`
  - `newCommit = C_B'`
  - `nullifier = N`
- Contract:
  - Verifies `proof_B`
  - Ensures note was not claimed before (`!consumed`)
  - Marks note as claimed
  - Updates Bob’s commitment
  - Stores used `nullifier`

## some failure modes
- what if bob didnt claim the proof, (use refundable bonds)
- bob should not be able to claim non existing proofs, created by himself
- linkability, reveals IP/timming whuch can compromise with timmings

