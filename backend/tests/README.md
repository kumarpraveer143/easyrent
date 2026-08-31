# Proof suites

These are **adversarial** suites, not happy-path tests. Each case attempts the
attack or the malformed input that actually worked at commit `e7cbe68` and
asserts it is now refused — plus, in every section, at least one case proving
valid input still gets through, so a blanket-deny regression fails the suite.

They run against a **live server**, so they need one up first. They are the
current stand-in for B10 (Vitest + Supertest); porting them is what closes B10.

## Running them

```bash
npm run test:proof
```

That expects:

1. MongoDB reachable at `MONGO_DB_URL` — a **replica set**, because B09's
   transactions need one. Locally:

```bash
docker run -d --name easyrent-mongo -p 27018:27017 mongo:7 --replSet rs0 --bind_ip_all
```

   then initiate it once:

```bash
docker exec easyrent-mongo mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```

2. The API running on the port the suites point at (`http://localhost:3100`).

## What each covers

| File | Covers |
|---|---|
| `security.proof.mjs` | SEC-01 · SEC-02 · SEC-03 · SEC-04 · SEC-06 · SEC-07 · SEC-08 · SEC-09, plus BUG-03 and BUG-05 |
| `validation.proof.mjs` | B02 — per-field rules, unknown-field stripping, malformed ids returning 400 rather than 500 |
| `seed.mjs` | Creates a landlord, a renter and six rooms so the UI has real content |

## A note on the ids

The suites create their own users with timestamped emails, so they can run
repeatedly against the same database without colliding. They do not clean up
after themselves — point them at a scratch database, never a real one.
