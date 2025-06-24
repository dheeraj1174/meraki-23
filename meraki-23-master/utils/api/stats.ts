import http from "../http";

export const fetchGlobalStats = async () => {
	try {
		const response = await http.get("/stats");
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};
