import React, { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { Input } from "@/library/form";
import Button from "@/library/Button";
import Link from "next/link";
import regex from "@/constants/regex";
import { loginValidator } from "@/validations/auth";
import { LoginValues } from "@/types/auth";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { BiHide, BiShow } from "react-icons/bi";
import { login as loginApi } from "@/utils/api/auth";
import useStore from "@/hooks/store";
import { fetchAuthenticatedUser } from "@/utils/api/auth";
import styles from "@/styles/pages/Auth.module.scss";
import { stylesConfig } from "@/utils/functions";
import Typography from "@/library/Typography";

const classNames = stylesConfig(styles, "auth");

const SignInPage: React.FC = () => {
	const router = useRouter();
	const { setUser, isCheckingLoggedIn, isLoggedIn, setIsLoggedIn } =
		useStore();

	const [inputCred, setInputCred] = useState<LoginValues>({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInputCred((prev) => ({ ...prev, [name]: value }));
	};

	const setGlobalUser = async () => {
		try {
			const user = await fetchAuthenticatedUser();
			setUser(user);
			setIsLoggedIn(true);
			return Promise.resolve(user);
		} catch (error) {
			console.error(error);
			setIsLoggedIn(false);
			return Promise.reject(error);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		try {
			await loginValidator(inputCred).catch((err) => {
				throw err.map((err: any) => err.message).join(", ");
			});
			const res = await loginApi(inputCred);
			localStorage.setItem("token", res.token);
			await setGlobalUser();
			if (router.query.redirect)
				router.push(router.query.redirect as string);
			else router.push("/");
		} catch (error: any) {
			console.error(error);
			toast.error(error.message ?? error ?? "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isCheckingLoggedIn && isLoggedIn)
			router.push(router.query.redirect?.toString() ?? "/");
	}, [isCheckingLoggedIn, isLoggedIn, router]);

	return (
		<main className={classNames("")}>
			<section className={classNames("-graphic")}>
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
						Login
					</h1>
					<h3 className={classNames("-content-head__subtitle")}>
						Welcome back again!
					</h3>
				</div>
				<form
					className={classNames("-content-form")}
					onSubmit={handleSubmit}
				>
					<Input
						type="email"
						name="email"
						placeholder="Email"
						value={inputCred.email}
						onChange={handleInputChange}
						error={
							inputCred.email.length > 0 &&
							!regex.email.test(inputCred.email)
						}
						errorMessage="Email is not valid"
					/>
					<Input
						type={showPassword ? "text" : "password"}
						name="password"
						placeholder="Password"
						value={inputCred.password}
						onChange={handleInputChange}
						icon={
							showPassword ? (
								<BiHide
									onClick={() => setShowPassword(false)}
								/>
							) : (
								<BiShow onClick={() => setShowPassword(true)} />
							)
						}
					/>
					<Button type="submit" variant="dark" loading={loading}>
						Login
					</Button>
				</form>
				<div className={classNames("-content-footer")}>
					<p className={classNames("-content-footer__text")}>
						Dont have an account?{" "}
						<Link
							href={{
								pathname: "/signup",
								query: router.query,
							}}
						>
							Signup
						</Link>
					</p>
					<p className={classNames("-content-footer__text")}>
						Forgot Password?{" "}
						<Link
							href={{
								pathname: "/reset-password",
								query: router.query,
							}}
						>
							Reset Password
						</Link>
					</p>
				</div>
			</section>
		</main>
	);
};

export default SignInPage;
