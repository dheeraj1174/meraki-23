import { OTP_TYPES } from "@/constants/enum";
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		otp: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			required: true,
			default: OTP_TYPES.REGISTER,
			enum: Object.values(OTP_TYPES),
		},
	},
	{
		timestamps: true,
	}
);

const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);

export default Otp;
