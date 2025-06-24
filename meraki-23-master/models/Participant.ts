import { TEAM_PARTICIPATION_STATUS } from "@/constants/enum";
import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema(
	{
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		status: {
			type: String,
			default: TEAM_PARTICIPATION_STATUS.PENDING,
			enum: Object.values(TEAM_PARTICIPATION_STATUS),
		},
	},
	{
		timestamps: true,
	}
);

const Participant =
	mongoose.models.Participant ||
	mongoose.model("Participant", ParticipantSchema);

export default Participant;
