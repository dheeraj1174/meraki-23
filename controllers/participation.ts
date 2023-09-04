import {
	RESPONSE_MESSAGES,
	TEAM_PARTICIPATION_STATUS,
	USER_ROLES,
} from "@/constants/enum";
import Event from "@/models/Event";
import Participant from "@/models/Participant";
import Team from "@/models/Team";
import User from "@/models/User";
import { ApiRequest, ApiResponse } from "@/types/api";
import {
	sendAcceptedInTeam,
	sendRegistrationConfirmation,
	sendRejectedInTeam,
	sendRequestedInTeam,
	sendWithdrawnFromEvent,
} from "@/utils/emails";
import mongoose from "mongoose";

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
		const eventId: any = req.query.id;
		if (!eventId)
			return res
				.status(400)
				.json({ message: "Please select an event to view teams" });
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent)
			return res.status(404).json({ message: "Event not found" });
		const allTeams = await Participant.aggregate([
			{ $match: { event: new mongoose.Types.ObjectId(eventId) } },
			{
				$lookup: {
					from: "teams",
					localField: "team",
					foreignField: "_id",
					as: "team",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$team" },
			{ $unwind: "$user" },
			{
				$group: {
					_id: "$team._id",
					name: { $first: "$team.name" },
					createdBy: { $first: "$team.createdBy" },
					participants: {
						$push: {
							_id: "$_id",
							userId: "$user._id",
							name: "$user.name",
							email: "$user.email",
							avatar: "$user.avatar",
							status: "$status",
						},
					},
				},
			},
		]);
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: allTeams,
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
		const eventId: any = req.query.id;
		if (!eventId)
			return res
				.status(400)
				.json({ message: "Please select an event to participate in" });
		const foundEvent = await Event.findById(eventId);
		if (!foundEvent)
			return res.status(404).json({ message: "Event not found" });
		const allparticipants = await Participant.aggregate([
			{ $match: { event: new mongoose.Types.ObjectId(eventId) } },
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$group: {
					_id: "$_id",
					name: { $first: "$user.name" },
					email: { $first: "$user.email" },
					avatar: { $first: "$user.avatar" },
					status: { $first: "$status" },
				},
			},
		]);
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

export const getTeamParticipants = async (
	req: ApiRequest,
	res: ApiResponse
) => {
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
		const foundParticipant = await Participant.findOne({
			event: eventId,
			user: req.user?.id,
		});
		const teamId = req.body.teamId;
		if (foundParticipant) {
			return res.status(409).json({
				message: "You have already registered in this event",
			});
		}
		if (foundEvent.teamSize === 1) {
			if (teamId)
				return res.status(400).json({
					message: "This event only accepts individual participants",
				});
			const newParticipant = await Participant.create({
				event: eventId,
				user: req.user?.id,
				status: TEAM_PARTICIPATION_STATUS.ACCEPTED,
			});
			await newParticipant.populate({
				path: "event",
				select: "name description",
			});
			await newParticipant.populate({
				path: "user",
				select: "name email avatar",
			});
			await sendRegistrationConfirmation(
				newParticipant.user.email,
				newParticipant.event.name
			);
			return res.status(201).json({
				message: RESPONSE_MESSAGES.SUCCESS,
				data: newParticipant,
			});
		} else {
			if (!teamId)
				return res
					.status(400)
					.json({ message: "Please select a team to join" });
			const foundTeam = await Team.findById(teamId);
			if (!foundTeam)
				return res.status(404).json({ message: "Team not found" });
			const noOfParticipants = await Participant.countDocuments({
				team: teamId,
			});
			if (noOfParticipants >= foundEvent.teamSize) {
				return res.status(409).json({
					message: "Team is already full",
				});
			}
			const newParticipant = await Participant.create({
				event: eventId,
				team: teamId,
				user: req.user?.id,
				status: TEAM_PARTICIPATION_STATUS.PENDING,
			});
			const foundTeamLeader = await User.findById(
				foundTeam.createdBy.toString()
			);
			const foundUser = await User.findById(req.user?.id);
			await sendRequestedInTeam(
				foundTeamLeader.email,
				foundEvent.name,
				foundUser.name,
				foundTeam.name
			);
			await newParticipant.populate({
				path: "event",
				select: "name description",
			});
			await newParticipant.populate({
				path: "team",
				select: "name",
			});
			await newParticipant.populate({
				path: "user",
				select: "name email avatar",
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

export const handleParticipantStatusInTeam = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	const teamId = req.query.id;
	if (!teamId)
		return res
			.status(400)
			.json({ message: "Please select a team to approve" });
	try {
		const participantId = req.body.participantId;
		if (!participantId)
			return res
				.status(400)
				.json({ message: "Please select a participant to approve" });
		const foundTeam = await Team.findById(teamId);
		if (!foundTeam)
			return res.status(404).json({ message: "Team not found" });
		const foundParticipant = await Participant.findOne({
			team: teamId,
			user: participantId,
		});
		if (!foundParticipant)
			return res.status(404).json({ message: "Participant not found" });
		const loggedInUser = await User.findById(req.user?.id);
		if (
			foundParticipant.createdBy.toString() !== req.user?.id &&
			loggedInUser.role !== USER_ROLES.ADMIN
		)
			return res.status(403).json({
				message: "You are not authorized to approve this participant",
			});
		if (
			!req.body.status ||
			!Object.values(TEAM_PARTICIPATION_STATUS).includes(req.body.status)
		) {
			return res.status(400).json({
				message: "Please select a valid status to approve or reject",
			});
		}
		const foundUser = await User.findById(foundParticipant.user.toString());
		const foundEvent = await Event.findById(
			foundParticipant.event.toString()
		);
		if (req.body.status === TEAM_PARTICIPATION_STATUS.ACCEPTED) {
			foundParticipant.status = TEAM_PARTICIPATION_STATUS.ACCEPTED;
			await foundParticipant.save();
			await sendAcceptedInTeam(
				foundUser?.email,
				foundEvent.name,
				foundTeam.name
			);
		} else if (req.body.status === TEAM_PARTICIPATION_STATUS.REJECTED) {
			await Participant.findByIdAndDelete(foundParticipant._id);
			await sendRejectedInTeam(
				foundUser?.email,
				foundEvent.name,
				foundTeam.name
			);
		} else {
			return res.status(400).json({
				message: "Please select a valid status to approve",
			});
		}
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: foundParticipant,
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

export const getParticipantForEvent = async (
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
		const foundParticipant = await Participant.findOne({
			event: eventId,
			user: req.user?.id,
		});
		if (!foundParticipant) {
			return res
				.status(404)
				.json({ message: "You are not registered for this event" });
		}
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: foundParticipant,
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

export const approveParticipant = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const participantId = req.query.id;
		const foundParticipant = await Participant.findById(participantId);
		if (!foundParticipant) {
			return res.status(404).json({ message: "Participant not found" });
		}
		const loggedInUser = await User.findById(req.user?.id);
		const eventId = foundParticipant.event.toString();
		const foundEvent = await Event.findById(eventId);
		if (foundEvent.teamSize === 1) {
			return res.status(400).json({
				message: "This event only accepts individual participants",
			});
		} else {
			const teamId = foundParticipant.team.toString();
			const foundTeam = await Team.findById(teamId);
			if (
				loggedInUser.role !== USER_ROLES.ADMIN &&
				foundTeam.createdBy.toString() !== req.user?.id
			) {
				return res.status(403).json({
					message:
						"You are not authorized to approve this participant",
				});
			}
			foundParticipant.status = TEAM_PARTICIPATION_STATUS.ACCEPTED;
			const foundUser = await User.findById(
				foundParticipant.user.toString()
			);
			await foundParticipant.save();
			await sendAcceptedInTeam(
				foundUser?.email,
				foundEvent.name,
				foundTeam.name
			);
			return res.status(200).json({
				message: RESPONSE_MESSAGES.SUCCESS,
				data: foundParticipant,
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

export const removeParticipantFromEvent = async (
	req: ApiRequest,
	res: ApiResponse
) => {
	try {
		const participantId = req.query.id;
		const foundParticipant = await Participant.findById(participantId);
		if (!foundParticipant)
			return res.status(404).json({ message: "Participant not found" });
		const loggedInUser = await User.findById(req.user?.id);
		const eventId = foundParticipant.event;
		const foundEvent = await Event.findById(eventId);
		if (foundEvent.teamSize === 1) {
			if (
				foundParticipant.user.toString() !== req.user?.id &&
				loggedInUser.role !== USER_ROLES.ADMIN
			) {
				return res.status(403).json({
					message:
						"You are not authorized to remove this participant",
				});
			}
		} else {
			const teamId = foundParticipant.team;
			const foundTeam = await Team.findById(teamId);
			if (
				loggedInUser.role !== USER_ROLES.ADMIN &&
				foundTeam.createdBy.toString() !== req.user?.id &&
				foundParticipant.user.toString() !== req.user?.id
			) {
				return res.status(403).json({
					message:
						"You are not authorized to remove this participant",
				});
			}
			if (
				foundParticipant.user.toString() ===
				foundTeam.createdBy.toString()
			) {
				return res.status(403).json({
					message: "Team creator cannot be removed from the team.",
				});
			}
		}
		await Participant.findByIdAndDelete(foundParticipant._id);
		const foundUser = await User.findById(foundParticipant.user.toString());
		await sendWithdrawnFromEvent(foundUser?.email, foundEvent.name);
		return res.status(204).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: foundParticipant,
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
