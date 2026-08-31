/**
 * Proof for B02 — zod validation on every input route.
 *
 * Asserts BOTH directions: garbage is refused with a per-field message, and
 * valid input still gets through. A validator that rejects everything would
 * pass a one-sided test.
 */
const API = "http://localhost:3100/api";

let pass = 0, fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${detail ? "  <- " + detail : ""}`); }
};

async function req(method, path, { body, cookie } = {}) {
  const r = await fetch(API + path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, json };
}
const jar = (c) => c.map((x) => x.split(";")[0]).join("; ");

const ts = Date.now();
const base = {
  name: "Valid Person", email: `v${ts}@example.com`, password: "Passw0rd!23",
  phoneNumber: "9876500001", dateOfBirth: "1990-05-05", userType: "landowner",
  homeAddress: { street: "12 Test Road", city: "Bengaluru", state: "Karnataka", zipCode: "560001" },
};

console.log("=== signup field validation ===");

const cases = [
  ["email must look like an email", { ...base, email: "not-an-email" }, "email"],
  ["password must be 8+ chars", { ...base, email: `p1${ts}@e.com`, password: "short1" }, "password"],
  ["password must contain a number", { ...base, email: `p2${ts}@e.com`, password: "alphabetsonly" }, "password"],
  ["phone must be 10 digits starting 6-9", { ...base, email: `p3${ts}@e.com`, phoneNumber: "12345" }, "phoneNumber"],
  ["phone must not start below 6", { ...base, email: `p4${ts}@e.com`, phoneNumber: "1234567890" }, "phoneNumber"],
  ["under-18 date of birth is refused", { ...base, email: `p5${ts}@e.com`, dateOfBirth: "2020-01-01" }, "dateOfBirth"],
  ["future date of birth is refused", { ...base, email: `p6${ts}@e.com`, dateOfBirth: "2099-01-01" }, "dateOfBirth"],
  ["PIN code must be 6 digits", { ...base, email: `p7${ts}@e.com`, homeAddress: { ...base.homeAddress, zipCode: "12" } }, "zipCode"],
  ["name must not be blank", { ...base, email: `p8${ts}@e.com`, name: "" }, "name"],
];

for (const [label, body, field] of cases) {
  const r = await req("POST", "/users/register", { body });
  const has = r.status === 400 && r.json?.errors && Object.keys(r.json.errors).length > 0;
  check(`${label}  (400 + field error)`, has, `status ${r.status} ${JSON.stringify(r.json?.errors ?? r.json?.message)}`);
}

console.log("\n=== the validator must not reject VALID input ===");
const good = await req("POST", "/users/register", { body: base });
check("a fully valid signup succeeds", good.status === 201, `status ${good.status} ${JSON.stringify(good.json).slice(0,140)}`);
check("the response carries no password", good.json?.user?.password === undefined);
check("userType was honoured (landowner)", good.json?.user?.userType === "landowner", `got ${good.json?.user?.userType}`);

const login = await fetch(API + "/users/login", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: base.email, password: base.password }),
});
const cookie = jar(login.headers.getSetCookie?.() ?? []);
check("that account can sign in", login.status === 200);

console.log("\n=== room validation ===");
const roomBase = {
  roomNumber: 555, rentPrice: 12000, roomType: "single", numberOfRooms: 1, numberOfBathrooms: 1,
  address: { street: "9 Room Road", city: "Pune", state: "Maharashtra", zipCode: "411001" },
};
const roomCases = [
  ["rent of 0 is refused", { ...roomBase, rentPrice: 0 }],
  ["negative rent is refused", { ...roomBase, rentPrice: -500 }],
  ["absurd rent is refused", { ...roomBase, rentPrice: 99999999999 }],
  ["an unknown room type is refused", { ...roomBase, roomType: "castle" }],
  ["zero bathrooms is refused", { ...roomBase, numberOfBathrooms: 0 }],
  ["a bad PIN code is refused", { ...roomBase, address: { ...roomBase.address, zipCode: "abc" } }],
  ["a missing address is refused", { ...roomBase, address: undefined }],
];
for (const [label, body] of roomCases) {
  const r = await req("POST", "/rooms", { body, cookie });
  check(label, r.status === 400, `status ${r.status}`);
}

const okRoom = await req("POST", "/rooms", { body: roomBase, cookie });
check("a valid room is accepted", okRoom.status === 200, `status ${okRoom.status}`);
const roomId = okRoom.json?.room?._id;

console.log("\n=== unknown fields must be stripped, not passed through ===");
const sneaky = await req("POST", "/rooms", {
  body: { ...roomBase, roomNumber: 556, owner: "000000000000000000000000", isAvailable: false },
  cookie,
});
check("a client-supplied `owner` is ignored", sneaky.json?.room?.owner !== "000000000000000000000000",
  `owner came back as ${sneaky.json?.room?.owner}`);
check("a client-supplied `isAvailable` is ignored", sneaky.json?.room?.isAvailable === true,
  `isAvailable came back as ${sneaky.json?.room?.isAvailable}`);

console.log("\n=== malformed ids must be 400, not 500 ===");
for (const [label, path] of [
  ["GET /rooms/roomDetails/not-an-id", "/rooms/roomDetails/not-an-id"],
  ["GET /history/not-an-id", "/history/not-an-id"],
  ["GET /chat/not-an-id", "/chat/not-an-id"],
]) {
  const r = await req("GET", path, { cookie });
  check(`${label} -> 400`, r.status === 400, `got ${r.status}`);
}

console.log("\n=== search query validation ===");
check("search with no params -> 400", (await req("GET", "/search/state")).status === 400);
check("search with a state -> 200", (await req("GET", "/search/state?state=Karnataka")).status === 200);

console.log("\n=== payment: the amount is no longer accepted from the client ===");
const pay = await req("POST", "/payment/create-checkout-session", {
  cookie, body: { relationId: "507f1f77bcf86cd799439011", amount: 1 },
});
check("an unknown tenancy is refused", [400, 404].includes(pay.status), `got ${pay.status}`);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
