import RoomSchema from "../rooms/room.schema.js";
import mongoose from "mongoose";
const RoomModel = mongoose.model("Room", RoomSchema);

class SearchRoomsRepository {
    async findByCityAndState(city, state) {
        const query = { isAvailable: true };
        if (city) query["address.city"] = city;
        if (state) query["address.state"] = state;
        return RoomModel.find(query);
    }
}

export default SearchRoomsRepository;
