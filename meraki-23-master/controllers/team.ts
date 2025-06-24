import {
	RESPONSE_MESSAGES,
	TEAM_PARTICIPATION_STATUS,
	USER_ROLES,
} from "@/constants/enum";
import { ApiRequest, ApiResponse } from "@/interfaces/api";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import Team from "@/models/Team";
import User from "@/models/User";
import { sendRegistrationConfirmation, sendTeamRemoved } from "@/utils/emails";

export const getAllTeams = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const teams = await Team.find();
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: teams,
		});
	} catch (error: any) {
		console.error(error);
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const getTeamById = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const team = await Team.findById(req.query.id);
		if (!team) return res.status(404).json({ message: "Team not found" });
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: team,
		});
	} catch (error: any) {
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Team not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const createTeam = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const { name, event } = req.body;
		const foundEvent = await Event.findById(event);
		const currentDate = new Date();
		if (currentDate < foundEvent.registrationsStart) {
			return res.status(400).json({
				message: "Registrations for this event have not started yet",
			});
		} else if (currentDate > foundEvent.registrationsEnd) {
			return res.status(403).json({
				message: "Registrations for this event have ended",
			});
		}
		if (!name) {
			return res.status(400).json({ message: "Team name is required" });
		}
		if (!event) {
			return res.status(400).json({ message: "Event is required" });
		}
		if (!foundEvent) {
			return res.status(404).json({ message: "Event not found" });
		}
		const foundParticipant = await Participant.find({
			event,
			user: req.user?.id,
		});
		if (foundEvent.teamSize === 1) {
			return res.status(400).json({
				message: "This event does not allows team participation",
			});
		}
		if (foundParticipant && foundParticipant.length > 0) {
			return res.status(409).json({
				message: "You have already registered in this event",
			});
		}
		const foundTeam = await Team.findOne({ name });
		if (foundTeam) {
			return res
				.status(409)
				.json({ message: "This team name has been taken" });
		}
		const newTeam = await Team.create({
			name,
			event,
			createdBy: req.user?.id,
		});
		await Participant.create({
			event,
			team: newTeam._id,
			user: req.user?.id,
			status: TEAM_PARTICIPATION_STATUS.ACCEPTED,
		});
		const foundUser = await User.findById(req.user?.id);
		await sendRegistrationConfirmation(
			foundUser?.email,
			foundEvent.name,
			req.body.name
		);
		await newTeam.populate({
			path: "createdBy",
			select: "name email avatar",
		});
		await newTeam.populate({
			path: "event",
			select: "name description date image teamSize",
		});
		return res.status(201).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: newTeam,
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

export const removeTeam = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const teamId = req.query.id;
		if (!teamId) {
			return res.status(400).json({ message: RESPONSE_MESSAGES.FAILED });
		}
		const foundTeam = await Team.findById(teamId);
		if (!foundTeam) {
			return res.status(404).json({ message: "No Team found" });
		}
		const foundUser = await User.findById(req.user?.id);
		if (
			foundTeam.createdBy.toString() !== req.user?.id.toString() &&
			foundUser.role !== USER_ROLES.ADMIN
		) {
			return res.status(403).json({
				message: "Only the creator can delete this team",
			});
		}
		const foundEvent = await Event.findById(foundTeam.event.toString());
		await Participant.deleteMany({ team: teamId });
		await Team.findByIdAndDelete(teamId);
		await sendTeamRemoved(
			foundUser?.email,
			foundEvent?.name,
			foundTeam.name
		);
		return res.status(204).json({ message: RESPONSE_MESSAGES.SUCCESS });
	} catch (error: any) {
		console.error(error);
		if (error.kind === "ObjectId") {
			return res.status(404).json({ message: "Team not found" });
		}
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const getTeamNamesForEvent = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const eventId = req.query.id;
		if (!eventId) {
			return res.status(400).json({ message: "Event is required" });
		}
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent) {
			return res.status(404).json({ message: "Event not found" });
		}
		const teams = await Team.find({ event: eventId }).select("name");
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: teams,
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
