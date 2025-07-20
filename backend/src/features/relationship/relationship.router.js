import express from "express";
import RelationshipController from "./relationship.controller.js";
import landOwnerAuth from "../../middleware/landOwners.js";
import jwtAuth from "../../middleware/jwtAuth.js";

const relationshipRouter = express.Router();

const relationshipController = new RelationshipController();

//route to accept the request of the user
relationshipRouter.post("/accept", landOwnerAuth, (req, res) => {
  relationshipController.accept(req, res);
});

//route to reject the request of the renters
relationshipRouter.post("/reject", landOwnerAuth, (req, res) => {
  relationshipController.rejectRequest(req, res);
});

//route to get all the details of the renters from relationship as array
relationshipRouter.get("/getRenters", landOwnerAuth, (req, res) => {
  relationshipController.getRenters(req, res);
});

//route to get if the relation exist or not!
relationshipRouter.post("/isRelationship", landOwnerAuth, (req, res) => {
  relationshipController.isRoomAvailable(req, res);
});

//route to remove renters from the relationship (Archieve the renters)
relationshipRouter.post("/removeRenter", landOwnerAuth, (req, res) => {
  relationshipController.removeRenter(req, res);
});

//route to permanently delete the relationship with history
relationshipRouter.delete("/deleteRenter/:id", landOwnerAuth, (req, res) => {
  relationshipController.deleteRenter(req, res);
});

//route get the room details of the particular renters
relationshipRouter.get("/getRoomDetails", jwtAuth, (req, res) => {
  relationshipController.getRoomDetailsByRenterId(req, res);
});

//route to get all the history of a particular renters
relationshipRouter.get("/historyOfRenter", jwtAuth, (req, res) => {
  relationshipController.getHistoryOfRenter(req, res);
});

//route to see wheather the user is in some room or not!
relationshipRouter.get("/engaged", jwtAuth, (req, res) => {
  relationshipController.engaged(req, res);
});

//router of the landowner to see the archieve users history!
relationshipRouter.post("/isArchieve", landOwnerAuth, (req, res) => {
  relationshipController.isArchieve(req, res);
});

//router to check is the room exit in the relationship of not! (to confirm before deleting the room!)
relationshipRouter.post("/relationByRoomId", landOwnerAuth, (req, res) => {
  relationshipController.relationByRoomId(req, res);
});

export default relationshipRouter;
