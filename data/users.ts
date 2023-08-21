import { USER_ROLES } from "@/constants/enum";
import { IUser } from "@/types/auth";

const users: IUser[] = [
	{
		_id: "1",
		name: "John Doe",
		email: "john@outlook.com",
		role: USER_ROLES.USER,
		avatar: "https://github.com/john.png",
	},
	{
		_id: "2",
		name: "Jane Doe",
		email: "jjane@gmail.com",
		role: USER_ROLES.USER,
		avatar: "https://github.com/jane.png",
	},
	{
		_id: "3",
		name: "Admin",
		email: "admin@gmail.com",
		role: USER_ROLES.ADMIN,
		avatar: "https://github.com/admin.png",
	},
];

export default users;
