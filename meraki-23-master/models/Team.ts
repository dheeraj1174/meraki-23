import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		event: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
			required: true,
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;
