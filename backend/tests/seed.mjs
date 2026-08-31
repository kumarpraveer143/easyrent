const API = "http://localhost:3100/api";

async function post(path, body, cookie) {
  const r = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, json, setCookie: r.headers.getSetCookie?.() ?? [] };
}

const landlord = {
  name: "Ramesh Iyer", userType: "landowner", houseName: "Iyer Nilayam",
  email: "ramesh@example.com", password: "Passw0rd!23", phoneNumber: "9876543210",
  dateOfBirth: "1978-04-12",
  homeAddress: { street: "14 Kasturba Road", city: "Bengaluru", state: "Karnataka", zipCode: "560001" },
};
const renter = {
  name: "Anita Sharma", userType: "renter",
  email: "anita@example.com", password: "Passw0rd!23", phoneNumber: "9812345670",
  dateOfBirth: "1996-09-02",
  homeAddress: { street: "8 Nehru Nagar", city: "Pune", state: "Maharashtra", zipCode: "411001" },
};

const rooms = [
  { roomNumber: 101, rentPrice: 14500, roomType: "single",    numberOfRooms: 1, numberOfBathrooms: 1, address: { street: "14 Kasturba Road",   city: "Bengaluru", state: "Karnataka",   zipCode: "560001" } },
  { roomNumber: 102, rentPrice: 22000, roomType: "apartment", numberOfRooms: 2, numberOfBathrooms: 2, address: { street: "14 Kasturba Road",   city: "Bengaluru", state: "Karnataka",   zipCode: "560001" } },
  { roomNumber: 103, rentPrice:  9000, roomType: "shared",    numberOfRooms: 1, numberOfBathrooms: 1, address: { street: "3 Residency Road",   city: "Bengaluru", state: "Karnataka",   zipCode: "560025" } },
  { roomNumber: 201, rentPrice: 31000, roomType: "house",     numberOfRooms: 3, numberOfBathrooms: 2, address: { street: "22 Koregaon Park",   city: "Pune",      state: "Maharashtra", zipCode: "411001" } },
  { roomNumber: 202, rentPrice: 17500, roomType: "studio",    numberOfRooms: 1, numberOfBathrooms: 1, address: { street: "9 Baner Road",       city: "Pune",      state: "Maharashtra", zipCode: "411045" } },
  { roomNumber: 301, rentPrice: 26000, roomType: "apartment", numberOfRooms: 2, numberOfBathrooms: 2, address: { street: "5 Linking Road",     city: "Mumbai",    state: "Maharashtra", zipCode: "400050" } },
];

for (const u of [landlord, renter]) {
  const r = await post("/users/register", u);
  console.log(`register ${u.email}: ${r.status} ${r.json?.message ?? "ok"}`);
}

const login = await post("/users/login", { email: landlord.email, password: landlord.password });
console.log(`login landlord: ${login.status}`);
const cookie = login.setCookie.map((c) => c.split(";")[0]).join("; ");
if (!cookie) { console.error("no cookie returned — aborting"); process.exit(1); }

for (const room of rooms) {
  const r = await post("/rooms", room, cookie);
  console.log(`room ${room.roomNumber} (${room.roomType}, Rs${room.rentPrice}): ${r.status}`);
}

const avail = await fetch(API + "/rooms/availableRoom").then((r) => r.json());
console.log(`\navailable rooms now: ${avail.totalCount}`);
console.log("landlord: ramesh@example.com / Passw0rd!23");
console.log("renter:   anita@example.com  / Passw0rd!23");
