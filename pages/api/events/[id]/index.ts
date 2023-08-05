import { RESPONSE_MESSAGES } from "@/constants/enum";
import { deleteEvent, getEventById, updateEvent } from "@/controllers/events";
import connectDB from "@/db";
import { isAdmin } from "@/middleware/roles";
import { ApiRequest, ApiResponse } from "@/types/api";

const handler = async (req: ApiRequest, res: ApiResponse) => {
	try {
		await connectDB();
		const { method } = req;

		switch (method) {
			case "GET":
				return getEventById(req, res);
			case "PATCH":
				return isAdmin(updateEvent)(req, res);
			case "DELETE":
				return isAdmin(deleteEvent)(req, res);
			default:
				res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
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
