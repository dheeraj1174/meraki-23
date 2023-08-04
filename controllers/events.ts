import { RESPONSE_MESSAGES } from "@/constants/enum";
import { ApiRequest, ApiResponse } from "@/interfaces/api";
import Event from "@/models/Event";

export const getAllEvents = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const allEvents = await Event.find().populate({
			path: "createdBy",
			select: "name email avatar",
		});
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: allEvents,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const getEventById = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const event = await Event.findById(req.query.id).populate({
			path: "createdBy",
			select: "name email avatar",
		});
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: event,
		});
	} catch (error: any) {
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Event not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
