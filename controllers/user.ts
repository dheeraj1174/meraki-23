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
				$lookup: {
					from: "participants",
					localField: "_id",
					foreignField: "event",
					pipeline: [
						{
							$match: {
								$expr: [{ $eq: ["$event", "$_id"] }],
							},
						},
					],
					as: "participants",
				},
			},
			{
				$unwind: "$participants",
			},
			{
				$match: {
					"participants.user": new mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "participants.user",
					foreignField: "_id",
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
				$lookup: {
					from: "teams",
					localField: "participants.team",
					foreignField: "_id",
					as: "team",
				},
			},
			{
				$project: {
					_id: 0,
					event: {
						id: "$_id",
						name: "$name",
						teamSize: "$teamSize",
					},
					participant: {
						$cond: {
							if: { $eq: ["$teamSize", 1] },
							then: {
								id: "$participants._id",
								userId: "$participants.user",
								name: { $first: "$users.name" },
								email: { $first: "$users.email" },
							},
							else: null,
						},
					},
					team: {
						$cond: {
							if: { $gt: ["$teamSize", 1] },
							then: {
								id: { $first: "$team._id" },
								name: { $first: "$team.name" },
								createdBy: { $first: "$team.createdBy" },
								members: [
									{
										id: "$participants._id",
										userId: "$participants.user",
										name: "$participants.name",
									},
								],
							},
							else: null,
						},
					},
				},
			},
			{
				$lookup: {
					from: "participants",
					localField: "team.id",
					foreignField: "team",
					as: "teamMembers",
					pipeline: [
						{
							$match: {
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
							$project: {
								_id: 0,
								id: "$_id",
								userId: "$user",
								name: { $first: "$users.name" },
								email: { $first: "$users.email" },
							},
						},
					],
				},
			},
			{
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
			{
				$lookup: {
					from: "users",
					localField: "team.createdBy",
					foreignField: "_id",
					as: "teamCreatedBy",
					// limit to 1
					pipeline: [
						{
							$match: {
								$expr: [{ $eq: ["$_id", "$team.createdBy"] }],
							},
						},
						{ $limit: 1 },
					],
				},
			},
			{
				$project: {
					event: 1,
					participant: 1,
					team: {
						id: "$team.id",
						name: "$team.name",
						createdBy: {
							id: { $first: "$teamCreatedBy._id" },
							name: { $first: "$teamCreatedBy.name" },
							email: { $first: "$teamCreatedBy.email" },
						},
						members: "$team.members",
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
