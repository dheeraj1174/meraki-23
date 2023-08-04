import { RESPONSE_MESSAGES } from "@/constants/enum";
import { ApiRequest, ApiResponse } from "@/interfaces/api";
import Team from "@/models/Team";

export const getAllTeams = async (req: ApiRequest, res: ApiResponse) => {
	try {
		const teams = await Team.find();
		return res.status(200).json({
			message: RESPONSE_MESSAGES.SUCCESS,
			data: teams,
		});
	} catch (err) {
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
	} catch (err) {
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};
