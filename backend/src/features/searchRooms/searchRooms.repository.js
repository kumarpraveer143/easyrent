import { Room as RoomModel } from "../../models/index.js";

class SearchRoomsRepository {
    async findByCityAndState(city, state) {
        const query = { isAvailable: true };
        if (city) query["address.city"] = city;
        if (state) query["address.state"] = state;
        return RoomModel.find(query);
    }
}

export default SearchRoomsRepository;
