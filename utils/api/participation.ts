import http from "../http";
import { TEAM_PARTICIPATION_STATUS } from "@/types/team";

export const getAllParticipants = async () => {
	try {
		const response = await http.get("/participants");
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getParticipantsForEvent = async (id: string) => {
	try {
		const response = await http.get(`/events/${id}/participants`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getParticipantsForTeam = async (id: string) => {
	try {
		const response = await http.get(`/teams/${id}/participants`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const participateInEvent = async (id: string, teamId?: string) => {
	try {
		const body = teamId ? { teamId } : {};
		const response = await http.post(`/events/${id}/participate`, body);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const participantStatusInTeam = async (
	teamId: string,
	participantId: string,
	status: TEAM_PARTICIPATION_STATUS
) => {
	try {
		const response = await http.patch(`/teams/${teamId}/participants`, {
			participantId,
			status: `${status}`,
		});
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getParticipantForEvent = async (eventId: string) => {
	try {
		const response = await http.get(`/participation/${eventId}`);
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};
