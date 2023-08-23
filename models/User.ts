import { USER_ROLES } from "@/constants/enum";
import { defaultAvatar } from "@/constants/variables";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: USER_ROLES.USER,
			enum: Object.values(USER_ROLES),
		},
		avatar: {
			type: String,
			default: defaultAvatar,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
