import http from "../http";

export const getTeams = async () => {
	try {
		const response = await http.get("/teams");
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getTeam = async (id: string) => {
	try {
		const response = await http.get(`/teams/${id}`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getTeamsForEvent = async (id: string) => {
	try {
		const response = await http.get(`/events/${id}/teams`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getTeamNamesForEvent = async (id: string) => {
	try {
		const response = await http.get(`/events/${id}/teams-name`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const createTeam = async (data: { name: string; event: string }) => {
	try {
		const response = await http.post("/teams", data);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const removeTeam = async (id: string) => {
	try {
		const response = await http.delete(`/teams/${id}`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};
