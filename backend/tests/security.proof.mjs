/**
 * Adversarial proof for B03/B04. Each case ATTEMPTS the attack that worked at
 * commit e7cbe68 and asserts it is now refused.
 *
 * A test that only checks the happy path proves nothing here.
 */
const API = "http://localhost:3100/api";

let pass = 0,
  fail = 0;

function check(name, ok, detail = "") {
  if (ok) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}${detail ? "  <- " + detail : ""}`);
  }
}

async function req(method, path, { body, cookie, raw } = {}) {
  const r = await fetch(API + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await r.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: r.status, json, cookies: r.headers.getSetCookie?.() ?? [], raw: text };
}

const jar = (setCookie) => setCookie.map((c) => c.split(";")[0]).join("; ");

// ---------------------------------------------------------------- setup ----
const ts = Date.now();
const landlordA = {
  name: "Owner A", userType: "landowner", email: `a${ts}@example.com`,
  password: "Passw0rd!23", phoneNumber: "9000000001", dateOfBirth: "1980-01-01",
  homeAddress: { street: "1 A Road", city: "Bengaluru", state: "Karnataka", zipCode: "560001" },
};
const landlordB = {
  name: "Owner B", userType: "landowner", email: `b${ts}@example.com`,
  password: "Passw0rd!23", phoneNumber: "9000000002", dateOfBirth: "1981-01-01",
  homeAddress: { street: "2 B Road", city: "Pune", state: "Maharashtra", zipCode: "411001" },
};
const renterC = {
  name: "Renter C", userType: "renter", email: `c${ts}@example.com`,
  password: "Passw0rd!23", phoneNumber: "9000000003", dateOfBirth: "1995-01-01",
  homeAddress: { street: "3 C Road", city: "Pune", state: "Maharashtra", zipCode: "411002" },
};

for (const u of [landlordA, landlordB, renterC]) await req("POST", "/users/register", { body: u });

const loginA = await req("POST", "/users/login", { body: { email: landlordA.email, password: landlordA.password } });
const loginB = await req("POST", "/users/login", { body: { email: landlordB.email, password: landlordB.password } });
const loginC = await req("POST", "/users/login", { body: { email: renterC.email, password: renterC.password } });

const A = jar(loginA.cookies);
const B = jar(loginB.cookies);
const C = jar(loginC.cookies);

const roomA = await req("POST", "/rooms", {
  cookie: A,
  body: {
    roomNumber: 901, rentPrice: 12000, roomType: "single", numberOfRooms: 1,
    numberOfBathrooms: 1,
    address: { street: "1 A Road", city: "Bengaluru", state: "Karnataka", zipCode: "560001" },
  },
});
const roomAId = roomA.json?.room?._id;

console.log("\n=== SEC-08  login must not return the password hash ===");
check("no `password` field on the login response", loginA.json?.user?.password === undefined,
  `got: ${JSON.stringify(loginA.json?.user ?? {}).slice(0, 120)}`);

console.log("\n=== SEC-03  signup must not accept userType: admin ===");
const admin = await req("POST", "/users/register", {
  body: { ...renterC, email: `admin${ts}@example.com`, phoneNumber: "9000000009", userType: "admin" },
});
check("admin signup is clamped to a non-admin role",
  admin.json?.user?.userType !== "admin", `got userType: ${admin.json?.user?.userType}`);

console.log("\n=== SEC-01  the rent ledger must not be world-writable ===");
const relFake = "507f1f77bcf86cd799439011";
check("POST /history/:id  unauthenticated -> 401",
  (await req("POST", `/history/${relFake}`, { body: { rentPaid: 1, date: new Date() } })).status === 401);
check("GET  /history/:id  unauthenticated -> 401",
  (await req("GET", `/history/${relFake}`)).status === 401);
check("PATCH /history/:id unauthenticated -> 401",
  (await req("PATCH", `/history/${relFake}`, { body: { rentPaid: 999999 } })).status === 401);
check("DELETE /history/:id unauthenticated -> 401",
  (await req("DELETE", `/history/${relFake}`)).status === 401);

console.log("\n=== SEC-07  chat must not be world-readable ===");
check("GET /chat/:relationId unauthenticated -> 401",
  (await req("GET", `/chat/${relFake}`)).status === 401);

console.log("\n=== SEC-02  identity must not come from the userId cookie ===");
const spoof = await req("GET", "/relationship/getRoomDetails", { cookie: `userId=${loginC.json?.user?._id}` });
check("a forged userId cookie with no token -> 401", spoof.status === 401,
  `got ${spoof.status}`);

const spoofRooms = await req("GET", "/rooms/myRoom", {
  cookie: `${B}; userId=${loginA.json?.user?._id}`,
});
check("landlord B cannot read A's rooms by forging userId",
  !(spoofRooms.json?.message ?? []).some((r) => r._id === roomAId),
  `leaked ${(spoofRooms.json?.message ?? []).length} rooms`);

console.log("\n=== SEC-06  a landowner must not act on another's room ===");
check("B cannot DELETE A's room",
  [403, 404].includes((await req("DELETE", `/rooms/${roomAId}`, { cookie: B })).status));
check("B cannot re-price A's room",
  [403, 404].includes((await req("PUT", `/rooms/${roomAId}`, { cookie: B, body: { rentPrice: 1 } })).status));
check("B cannot toggle A's room availability",
  [403, 404].includes((await req("POST", `/rooms/toggle-room/${roomAId}`, { cookie: B })).status));
check("B cannot list applicants for A's room",
  [403, 404].includes((await req("GET", `/request/users/${roomAId}`, { cookie: B })).status));
check("B cannot force-accept a tenant into A's room",
  [403, 404].includes((await req("POST", "/relationship/accept", {
    cookie: B, body: { roomId: roomAId, renterId: loginC.json?.user?._id },
  })).status));

// A really can act on their own room — the gate must not be a blanket deny.
check("A CAN still update their own room",
  (await req("PUT", `/rooms/${roomAId}`, { cookie: A, body: { rentPrice: 12500 } })).status === 200);

console.log("\n=== SEC-04  the charge amount must not come from the browser ===");
const cheap = await req("POST", "/payment/create-checkout-session", {
  cookie: C,
  body: { relationId: relFake, amount: 1, renterId: loginC.json?.user?._id, ownerId: loginA.json?.user?._id, roomId: roomAId },
});
check("a client-supplied amount of Rs1 is refused", cheap.status >= 400,
  `got ${cheap.status}`);

console.log("\n=== SEC-09  applicant PII must not be exposed ===");
await req("POST", `/request/${roomAId}`, { cookie: C });
const applicants = await req("GET", `/request/users/${roomAId}`, { cookie: A });
const first = applicants.json?.users?.[0];
check("applicant payload carries no aadharCardNumber", first?.aadharCardNumber === undefined);
check("applicant payload carries no dateOfBirth", first?.dateOfBirth === undefined);
check("applicant payload carries no homeAddress", first?.homeAddress === undefined);
check("applicant payload still has the name the landlord needs", typeof first?.name === "string");

console.log("\n=== BUG-05  the state-search endpoint must respond ===");
const t0 = Date.now();
const search = await req("GET", "/search/state?state=Karnataka");
check(`GET /search/state responds (${Date.now() - t0}ms)`, search.status === 200,
  `status ${search.status}`);

console.log("\n=== BUG-03  admin routes must be reachable for admins only ===");
check("a landowner cannot reach the admin user list",
  [401, 403].includes((await req("GET", "/users", { cookie: A })).status));

console.log("\n=== health ===");
const health = await fetch("http://localhost:3100/health").then((r) => r.json());
check("health check reports the database", health.database === "connected");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
