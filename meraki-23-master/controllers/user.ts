import { RESPONSE_MESSAGES } from "@/constants/enum";
import { ApiRequest, ApiResponse } from "@/interfaces/api";
import Event from "@/models/Event";
import User from "@/models/User";
import mongoose from "mongoose";

export const getAllUsers = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const allUsers = await User.find()
			.select("-password")
			.sort({ createdAt: -1 });
		return res.status(200).json({ data: allUsers });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export const getMyRegistrations = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const userId = req.user?.id;
		const registrationDetails = await Event.aggregate([
			{
				// lookup for participants collection for every event
				$lookup: {
					from: "participants",
					localField: "_id",
					foreignField: "event",
					// match the participant.event with event._id
					pipeline: [
						{
							$match: {
								$expr: [{ $eq: ["$event", "$_id"] }],
							},
						},
					],
					// store the result in participants
					as: "participants",
				},
			},
			{
				// unwind the participants array
				$unwind: "$participants",
			},
			{
				// match the participant.user with the user._id to return only the current user's registrations
				$match: {
					"participants.user": new mongoose.Types.ObjectId(userId),
				},
			},
			{
				// lookup for users collection for every participant
				$lookup: {
					from: "users",
					localField: "participants.user",
					foreignField: "_id",
					// find the 1 user with the same _id as participant.user
					pipeline: [
						{
							$match: {
								$expr: [
									{ $eq: ["$_id", "$participants.user"] },
								],
							},
						},
						{ $limit: 1 },
					],
					as: "users",
				},
			},
			{
				// lookup for teams collection for every participant
				$lookup: {
					from: "teams",
					localField: "participants.team",
					foreignField: "_id",
					as: "team",
				},
			},
			{
				// project the required fields
				$project: {
					_id: 0,
					// project the event fields -> id, name, teamSize
					event: {
						id: "$_id",
						name: "$name",
						teamSize: "$teamSize",
					},
					// project the participant fields only if teamSize is 1
					// project the participant fields -> participant._id, user._id, user.name, user.email
					participant: {
						$cond: {
							if: { $eq: ["$teamSize", 1] },
							then: {
								id: "$participants._id",
								userId: "$participants.user",
								name: { $first: "$users.name" },
								email: { $first: "$users.email" },
								avatar: { $first: "$users.avatar" },
							},
							else: null,
						},
					},
					// project the team fields only if teamSize is greater than 1
					// project the team fields -> team._id, team.name, team.createdBy, team.members
					team: {
						$cond: {
							if: { $gt: ["$teamSize", 1] },
							then: {
								id: { $first: "$team._id" },
								name: { $first: "$team.name" },
								createdBy: { $first: "$team.createdBy" },
								members: [],
							},
							else: null,
						},
					},
				},
			},
			{
				// lookup for participants collection for every team
				$lookup: {
					from: "participants",
					localField: "team.id",
					foreignField: "team",
					as: "teamMembers",
					// match the participant.team with team._id
					pipeline: [
						{
							$match: {
								// match the participant.team with team._id and participant.user with user._id
								// to return only the team members
								$expr: [
									{ $eq: ["$team", "$team._id"] },
									{ $ne: ["$user", "$participant.user"] },
								],
							},
						},
						{
							$lookup: {
								from: "users",
								localField: "user",
								foreignField: "_id",
								// find the 1 user with the same _id as participant.user
								pipeline: [
									{
										$match: {
											$expr: [{ $eq: ["$_id", "$user"] }],
										},
									},
									{ $limit: 1 },
								],
								as: "users",
							},
						},
						{
							// project the required fields from users collection -> id, name, email
							$project: {
								_id: 0,
								id: "$_id",
								userId: "$user",
								name: { $first: "$users.name" },
								email: { $first: "$users.email" },
								avatar: { $first: "$users.avatar" },
								status: 1,
							},
						},
					],
				},
			},
			{
				// project the required fields for response -> event, participant, team
				$project: {
					event: 1,
					participant: 1,
					team: {
						$cond: {
							if: { $gt: ["$event.teamSize", 1] },
							then: {
								id: "$team.id",
								name: "$team.name",
								createdBy: "$team.createdBy",
								members: "$teamMembers",
							},
							else: null,
						},
					},
				},
			},
		]);
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: registrationDetails,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
