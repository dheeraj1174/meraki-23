import { RESPONSE_MESSAGES } from "@/constants/enum";
import { ApiRequest, ApiResponse } from "@/interfaces/api";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import Team from "@/models/Team";
import { IEvent } from "@/types/event";
import { createEventValidator } from "@/validations/event";

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
		console.error(error);
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
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Event not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const createEvent = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const { name, description, date, image, teamSize } = req.body;
		let errors: any = null;
		await createEventValidator({
			name,
			description,
			date,
			image,
			teamSize,
		}).catch((err) => {
			errors = err;
		});
		if (errors) {
			return res.status(400).json({ errors });
		}
		const foundEvent = await Event.findOne({ name });
		if (foundEvent) {
			return res.status(409).json({
				message: "Event with this name already exists",
			});
		}
		const event = await Event.create({
			name,
			description,
			date,
			image,
			createdBy: req.user?.id,
		});
		return res.status(201).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: event,
		});
	} catch (error: any) {
		console.error(error);
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const updateEvent = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const eventId = req.query.id;
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ message: "Event not found" });
		}
		if (event.createdBy.toString() !== req.user?.id) {
			return res.status(401).json({ message: "Not authorized" });
		}
		const updateDetails: Partial<IEvent> = {};
		type KeysToUpdate =
			| "name"
			| "description"
			| "date"
			| "image"
			| "teamSize";
		const keysToUpdate: KeysToUpdate[] = [
			"name",
			"description",
			"date",
			"image",
			"teamSize",
		];
		keysToUpdate.forEach((key: KeysToUpdate) => {
			if (key in req.body) {
				updateDetails[key] = req.body[key];
			}
		});
		const updatedEvent = await Event.findByIdAndUpdate(
			eventId,
			{ $set: updateDetails },
			{ new: true }
		);
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: updatedEvent,
		});
	} catch (error: any) {
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Event not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const deleteEvent = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const eventId = req.query.id;
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent) {
			res.status(404).json({ message: "Event not found" });
		}
		await Participant.deleteMany({ event: eventId });
		await Team.deleteMany({ event: eventId });
		await Event.findByIdAndDelete(eventId);
		return res.status(204).json({ message: RESPONSE_MESSAGES.SUCCESS });
	} catch (error: any) {
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Event not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
