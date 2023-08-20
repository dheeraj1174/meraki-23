import { RESPONSE_MESSAGES } from "@/constants/enum";
import { getTeamById, removeTeam } from "@/controllers/team";
import connectDB from "@/db";
import authMiddleware from "@/middleware/auth";
import { ApiRequest, ApiResponse } from "@/types/api";

const handler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await connectDB();
		const { method } = req;

		switch (method) {
			case "GET":
				return getTeamById(req, res);
			case "DELETE":
				return authMiddleware(removeTeam)(req, res);
			default:
				res.setHeader("Allow", ["GET", "DELETE"]);
				return res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error: any) {
		console.error(error);
		return res
			.status(500)
			.json({ message: RESPONSE_MESSAGES.SERVER_ERROR });
	}
};

export default handler;
