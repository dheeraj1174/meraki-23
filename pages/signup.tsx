import React, { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { Input } from "@/library/form";
import Button from "@/library/Button";
import Link from "next/link";
import regex from "@/constants/regex";
import { registerValidator } from "@/validations/auth";
import { RegisterValues } from "@/types/auth";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { getRegistraionOtp, verifyRegistrationOtp } from "@/utils/api/auth";
import { BiHide, BiShow } from "react-icons/bi";
import { register as registerApi } from "@/utils/api/auth";
import useStore from "@/hooks/store";
import { stylesConfig } from "@/utils/functions";
import styles from "@/styles/pages/Auth.module.scss";
import Typography from "@/library/Typography";

const classNames = stylesConfig(styles, "auth");

const SignInPage: React.FC = () => {
	const router = useRouter();
	const { isCheckingLoggedIn, isLoggedIn } = useStore();

	const [showPassword, setShowPassword] = useState(false);
	const [inputCred, setInputCred] = useState<RegisterValues>({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [otp, setOtp] = useState(Array(6).fill(""));
	const [showOTPBox, setShowOTPBox] = useState(false);
	const [isOtpValid, setIsOtpValid] = useState(false);
	const [resendOTPTimeout, setResendOTPTimeout] = useState(60);

	const [requestingOtp, setRequestingOtp] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [registering, setRegistering] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputCred((prev) => ({ ...prev, [name]: value }));
	};

	const requestOTP = async (e?: any) => {
		e?.preventDefault();
		try {
			setRequestingOtp(true);
			await getRegistraionOtp(inputCred.email);
			toast.success("OTP sent to your email. It will expire in 1 minute");
			setShowOTPBox(true);
			setResendOTPTimeout(60);
			setOtpSent(true);
		} catch (error: any) {
			console.error(error);
			toast.error(
				error.message ?? error.toString() ?? "Something went wrong"
			);
		} finally {
			setRequestingOtp(false);
		}
	};

	const verifyOTP = async (otp: number[] | string[]) => {
		if (
			otp.join("").length !== 6 ||
			(otp.join("").length === 6 && otp.some((n: any) => isNaN(n)))
		) {
			toast.error("Invalid OTP entered");
			requestOTP();
			return;
		}
		try {
			setVerifyingOtp(true);
			await verifyRegistrationOtp(inputCred.email, otp.join(""));
			toast.success("OTP verified successfully");
			setIsOtpValid(true);
		} catch (error: any) {
			console.error(error);
			toast.error(
				error.message ?? error.toString() ?? "Something went wrong"
			);
		} finally {
			setVerifyingOtp(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isOtpValid) {
			toast.error("OTP is not verified");
			verifyOTP(otp);
			return;
		}
		try {
			await registerValidator(inputCred).catch((err) => {
				throw err.map((err: any) => err.message).join(", ");
			});
			setRegistering(true);
			await registerApi(inputCred);
			router.push({
				pathname: "/login",
				query: router.query,
			});
		} catch (error: any) {
			console.error(error);
			toast.error(error.message ?? error.toString());
		} finally {
			setRegistering(false);
		}
	};

	useEffect(() => {
		if (resendOTPTimeout > 0) {
			const timer = setTimeout(() => {
				setResendOTPTimeout(resendOTPTimeout - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [resendOTPTimeout]);

	useEffect(() => {
		if (!isCheckingLoggedIn && isLoggedIn)
			router.push(router.query.redirect?.toString() ?? "/");
	}, [isCheckingLoggedIn, isLoggedIn, router]);

	return (
		<main className={classNames("")}>
			<section
				className={classNames("-graphic")}
				style={{
					backgroundImage:
						"url(https://images.prismic.io/worldcoin-company-website/cfb5aaac-7497-4bb8-9890-ac4235a57520_what-is-a-hackathon%402x.jpg)",
				}}
			>
				<Typography
					type="heading"
					variant="display"
					className={classNames("-graphic__text")}
				>
					Meraki 23
					<br />
					Experience the wilderness of the web
				</Typography>
			</section>
			<section className={classNames("-content")}>
				<div className={classNames("-content-head")}>
					<h1 className={classNames("-content-head__icon")}>
						<Avatar
							src="https://github.com/akshatmittal61.png"
							alt="Akshat mittal"
							onClick={() => router.push("/")}
						/>
					</h1>
					<h1 className={classNames("-content-head__title")}>
						Create an Account
					</h1>
					<h3 className={classNames("-content-head__subtitle")}>
						Let&apos;s get you started
					</h3>
				</div>
				<form
					className={classNames("-content-form")}
					onSubmit={handleSubmit}
				>
					<Input
						type="text"
						name="name"
						placeholder="Name"
						value={inputCred.name}
						onChange={handleInputChange}
						error={
							inputCred.name.length > 0 &&
							!regex.name.test(inputCred.name)
						}
						errorMessage="Name must be atleast 3 characters"
					/>
					<Input
						type="email"
						name="email"
						placeholder="Email"
						value={inputCred.email}
						onChange={handleInputChange}
						disabled={isOtpValid}
						error={
							inputCred.email.length > 0 &&
							!regex.email.test(inputCred.email)
						}
						errorMessage="Email is not valid"
					/>

					{showOTPBox && !isOtpValid ? (
						<div
							className={classNames("-content-form-group")}
							style={{
								justifyContent: "space-between",
								flexFlow: "row nowrap",
								gap: "0",
							}}
						>
							{otp.map((data, index) => (
								<Input
									key={index}
									type="text"
									name={`otp${index}`}
									autoFocus={index === 0}
									value={data}
									style={{
										width: "3rem",
										textAlign: "center",
									}}
									styles={{
										box: { alignItems: "center" },
									}}
									onKeyUp={(e: any) => {
										if (e.target.value.length === 1) {
											if (
												e.target.value >= 0 &&
												e.target.value <= 9
											) {
												if (e.target.name === "otp5") {
													e.target.blur();
												} else {
													document
														.getElementsByName(
															"otp" +
																(+e.target.name[
																	e.target
																		.name
																		.length -
																		1
																] +
																	1)
														)[0]
														.focus();
												}
											} else {
												e.target.value = "";
											}
										}
									}}
									onChange={(e: any) => {
										if (
											e.target.value.length === 6 &&
											index === 0 &&
											e.target.value
												.split("")
												.every(
													(val: any) =>
														val >= 0 && val <= 9
												)
										) {
											const otpArray =
												e.target.value.split("");
											setOtp(otpArray);
											document
												.getElementsByName("otp5")[0]
												.focus();
											return;
										} else if (
											e.target.value === "" ||
											regex.otp.test(e.target.value)
										) {
											const otpArray = [...otp];
											if (e.target.value === "")
												otpArray[index] = "";
											else if (
												+e.target.value >= 0 &&
												+e.target.value <= 9
											)
												otpArray[index] =
													e.target.value;
											setOtp(otpArray);
										}
									}}
									onFocus={(e) => e.target.select()}
								/>
							))}
						</div>
					) : null}
					{!isOtpValid && regex.email.test(inputCred.email) ? (
						<div className={classNames("-content-form-group")}>
							{showOTPBox ? (
								<Button
									variant="light"
									type="button"
									disabled={
										!inputCred.email.length ||
										!regex.email.test(inputCred.email) ||
										resendOTPTimeout > 0
									}
									onClick={requestOTP}
									loading={requestingOtp}
								>
									{resendOTPTimeout > 0
										? `Retry in ${resendOTPTimeout} seconds`
										: "Resend OTP"}
								</Button>
							) : null}
							{otpSent ? (
								<Button
									variant="dark"
									type="button"
									disabled={
										!inputCred.email.length ||
										!regex.email.test(inputCred.email) ||
										requestingOtp ||
										!regex.otp.test(otp.join(""))
									}
									onClick={() => verifyOTP(otp)}
									loading={verifyingOtp}
								>
									Verify OTP
								</Button>
							) : (
								<Button
									variant="dark"
									type="button"
									disabled={
										showOTPBox ||
										!inputCred.email.length ||
										!regex.email.test(inputCred.email) ||
										requestingOtp
									}
									onClick={requestOTP}
									loading={requestingOtp}
								>
									Request OTP
								</Button>
							)}
						</div>
					) : null}
					{isOtpValid ? (
						<>
							<div className={classNames("-content-form-group")}>
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									placeholder="Password"
									value={inputCred.password}
									required
									onChange={handleInputChange}
									error={
										inputCred.password.length > 0 &&
										!regex.password.test(inputCred.password)
									}
									errorMessage="Password must be atleast 8 characters and must contain atleast one uppercase, one lowercase, one number and one special character"
									icon={
										showPassword ? (
											<BiHide
												onClick={() =>
													setShowPassword(false)
												}
											/>
										) : (
											<BiShow
												onClick={() =>
													setShowPassword(true)
												}
											/>
										)
									}
								/>
								<Input
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									placeholder="Confirm Password"
									value={inputCred.confirmPassword}
									required
									onChange={handleInputChange}
									error={
										typeof inputCred.confirmPassword ===
											"string" &&
										inputCred.confirmPassword.length > 0 &&
										inputCred.confirmPassword !==
											inputCred.password
									}
									errorMessage="Passwords do not match"
									icon={
										showPassword ? (
											<BiHide
												onClick={() =>
													setShowPassword(false)
												}
											/>
										) : (
											<BiShow
												onClick={() =>
													setShowPassword(true)
												}
											/>
										)
									}
								/>
							</div>
							<Button
								type="submit"
								variant="light"
								loading={registering}
							>
								Create Account
							</Button>
						</>
					) : null}
				</form>
				<div className={classNames("-content-footer")}>
					<p className={classNames("-content-footer__text")}>
						Already have an account?{" "}
						<Link href="/login">Login</Link>
					</p>
				</div>
			</section>
		</main>
	);
};

export default SignInPage;
