import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		brochure: {
			type: String,
		},
		registrationsStart: {
			type: Date,
		},
		registrationsEnd: {
			type: Date,
		},
		eventStart: {
			type: Date,
		},
		eventEnd: {
			type: Date,
		},
		image: {
			type: String,
		},
		teamSize: {
			type: Number,
			required: true,
			default: 1,
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

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

export default Event;
