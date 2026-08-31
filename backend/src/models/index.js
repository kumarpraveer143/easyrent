import mongoose from "mongoose";

import UserSchema from "../features/users/user.schema.js";
import RoomSchema from "../features/rooms/room.schema.js";
import requestSchema from "../features/request/request.schema.js";
import relationshipSchema from "../features/relationship/relationship.schema.js";
import HistorySchema from "../features/history/history.schema.js";
import favouriteSchema from "../features/favourite/favourite.schema.js";

/**
 * One place where every model is registered, under one canonical name each.
 *
 * Models used to be registered ad-hoc at module scope across seven files and
 * the names did not line up:
 *   - "Room" was registered twice (room.repository + searchRooms.repository)
 *   - the same History schema was registered as BOTH "History" and "history",
 *     producing two model objects over one collection
 *   - the relationship model was registered lowercase as "relationship", while
 *     every ref pointing at it said "Relation" or "Relationship"
 *   - payment.repository looked up mongoose.model('Relation'), which was never
 *     registered at all — a guaranteed MissingSchemaError on every call to
 *     GET /api/payment/history/:userId
 *
 * Canonical names are singular and PascalCase. Mongoose pluralises them to the
 * same collections the app already used (users, rooms, requests, relationships,
 * histories, favourites), so nothing moves.
 */

// `mongoose.model(name, schema)` is idempotent for the same schema object, but
// guard anyway so hot-reload and repeated imports can't throw OverwriteModelError.
const register = (name, schema) =>
  mongoose.models[name] ?? mongoose.model(name, schema);

export const User = register("User", UserSchema);
export const Room = register("Room", RoomSchema);
export const Request = register("Request", requestSchema);
export const Relationship = register("Relationship", relationshipSchema);
export const History = register("History", HistorySchema);
export const Favourite = register("Favourite", favouriteSchema);

export default { User, Room, Request, Relationship, History, Favourite };
