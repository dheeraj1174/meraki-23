import { RESPONSE_MESSAGES } from "@/constants/enum";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import { ApiRequest, ApiResponse } from "@/types/api";

export const getAllParticipants = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const participants = await Participant.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "event",
				select: "name description",
			})
			.populate({
				path: "user",
				select: "name email avatar",
			})
			.populate({
				path: "team",
				select: "name",
				match: { team: { $exists: true } },
			});
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: participants,
		});
	} catch (error: any) {
		console.error(error);
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const getParticipantsForEvent = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const eventId = req.query.id;
		if (!eventId)
			return res
				.status(400)
				.json({ message: "Please select an event to participate in" });
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent)
			return res.status(404).json({ message: "Event not found" });
		const allparticipants = await Participant.find({ event: eventId })
			.populate({
				path: "event",
				select: "name description",
			})
			.populate({
				path: "user",
				select: "name email avatar",
			})
			.populate({
				path: "team",
				select: "name",
				match: { team: { $exists: true } },
			});
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: allparticipants,
		});
	} catch (error: any) {
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
