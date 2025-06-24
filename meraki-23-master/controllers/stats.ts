import { RESPONSE_MESSAGES } from "@/constants/enum";
import Event from "@/models/Event";
import { ApiRequest, ApiResponse } from "@/types/api";

export const getGlobalStats = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const stats = await Event.aggregate([
			{
				$lookup: {
					from: "participants",
					localField: "_id",
					foreignField: "event",
					as: "participants",
				},
			},
			{
				$lookup: {
					from: "teams",
					localField: "_id",
					foreignField: "event",
					as: "teams",
				},
			},
			{
				$group: {
					_id: "$_id",
					event: {
						$first: {
							id: "$_id",
							name: "$name",
							teamSize: "$teamSize",
						},
					},
					participants: { $sum: { $size: "$participants" } },
					teams: { $first: "$teams" },
				},
			},
			{
				$addFields: {
					teams: {
						$cond: {
							if: { $gt: ["$event.teamSize", 1] },
							then: { $size: "$teams" },
							else: null,
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					event: 1,
					participants: 1,
					teams: 1,
				},
			},
			{
				$project: {
					_id: 0,
					event: 1,
					participants: 1,
					teams: {
						$cond: {
							if: { $gt: ["$event.teamSize", 1] },
							then: "$teams",
							else: null,
						},
					},
				},
			},
		]);
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: stats,
		});
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
