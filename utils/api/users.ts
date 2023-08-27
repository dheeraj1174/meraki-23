import http from "../http";

export const getAllUsers = async () => {
	try {
		const response = await http.get("/users");
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};

export const getMyRegistrations = async () => {
	try {
		const response = await http.get("/users/registrations");
		return Promise.resolve(response.data);
	} catch (error: any) {
		console.error(error);
		return Promise.reject(error.response.data);
	}
};
