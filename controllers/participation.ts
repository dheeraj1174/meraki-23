import { RESPONSE_MESSAGES, TEAM_PARTICIPATION_STATUS } from "@/constants/enum";
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

export const getTeamsForEvent = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const eventId = req.query.id;
		if (!eventId)
			return res
				.status(400)
				.json({ message: "Please select an event to view teams" });
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent)
			return res.status(404).json({ message: "Event not found" });
		const allTeams = await Participant.find({ event: eventId })
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
		const groupedTeams = allTeams.reduce((acc: any, curr: any) => {
			if (curr.team) {
				if (!acc[curr.team.name]) {
					acc[curr.team.name] = [];
				}
				acc[curr.team.name].push(curr);
			}
			return acc;
		}, {});
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: groupedTeams,
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

export const getTeam = async (req: ApiRequest, res: ApiResponse) => {
	const teamId = req.query.id;
	if (!teamId)
		return res
			.status(400)
			.json({ message: "Please select a team to view participants" });
	try {
		const allParticipants = await Participant.find({ team: teamId })
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
		if (!allParticipants.length) {
			return res.status(404).json({ message: "Team not found" });
		}
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: allParticipants,
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

export const participateInEvent = async (req: ApiRequest, res: ApiResponse) => {
	const eventId = req.query.id;
	if (!eventId)
		return res
			.status(400)
			.json({ message: "Please select an event to participate in" });
	try {
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent)
			return res.status(404).json({ message: "Event not found" });
		const foundParticipant = await Participant.findOne({
			event: eventId,
			user: req.user?.id,
		});
		if (foundParticipant) {
			return res.status(409).json({
				message: "You have already registered in this event",
			});
		}
		if (foundEvent.teamSize === 1) {
			const newParticipant = await Participant.create({
				event: eventId,
				user: req.user?.id,
				status: TEAM_PARTICIPATION_STATUS.ACCEPTED,
			});
			return res.status(201).json({
				message: RESPONSE_MESSAGES.SUCCESS,
				data: newParticipant,
			});
		} else {
			const teamId = req.body.teamId;
			if (!teamId)
				return res
					.status(400)
					.json({ message: "Please select a team to join" });
			const foundTeam = await Participant.findOne({
				event: eventId,
				team: teamId,
			});
			if (!foundTeam)
				return res.status(404).json({ message: "Team not found" });
			const newParticipant = await Participant.create({
				event: eventId,
				team: teamId,
				user: req.user?.id,
				status: TEAM_PARTICIPATION_STATUS.PENDING,
			});
			return res.status(201).json({
				message: RESPONSE_MESSAGES.SUCCESS,
				data: newParticipant,
			});
		}
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
