# Seeding Strategy

This seed flow is designed for repeatability and speed for regular local runs.

## Why this approach

- Uses deterministic pseudo-random generation (`SEED_RANDOM_SEED`) so data shape is reproducible.
- Reads full names by combining entries from `first_names.txt` and `last_names.txt`.
- Implemented in TypeScript (`prisma/seed.ts`) for type safety and consistency with the backend stack.
- Uses `createMany` in configurable batches (`SEED_BATCH_SIZE`) to minimize round trips.
- Defaults to truncating `Employee` before insert for clean, idempotent reruns.
- Supports append mode for incremental growth benchmarks.

## Commands

- `npm run seed` -> default run (truncate + insert)
- `npm run seed:reset` -> explicit truncate + insert
- `npm run seed:append` -> append without truncate

## Tunables

- `SEED_EMPLOYEE_COUNT` (default: `10000`)
- `SEED_BATCH_SIZE` (default: `2000`)
- `SEED_RANDOM_SEED` (default: `20260527`)

### Example

```bash
SEED_EMPLOYEE_COUNT=50000 SEED_BATCH_SIZE=5000 npm run seed
```
