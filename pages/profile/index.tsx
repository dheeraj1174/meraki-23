import Avatar from "@/components/Avatar";
import { defaultAvatar } from "@/constants/variables";
import useStore from "@/hooks/store";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import { Input } from "@/library/form";
import styles from "@/styles/pages/Profile.module.scss";
import { patchUserDetails } from "@/utils/api/auth";
import { stylesConfig } from "@/utils/functions";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCaretLeftBold } from "react-icons/pi";

const classes = stylesConfig(styles, "profile");

const ProfilePage: React.FC = () => {
	const router = useRouter();
	const { user, setUser, isCheckingLoggedIn, isLoggedIn } = useStore();

	const [updatingProfile, setUpdatingProfile] = useState(false);
	const [profileContents, setProfileContents] = useState({
		name: user?.name,
		email: user?.email,
		avatar: user?.avatar,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProfileContents((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const updateProfile = async (e: any = undefined) => {
		e?.preventDefault();
		try {
			setUpdatingProfile(true);
			const body: any = { name: profileContents.name };
			if (
				profileContents.avatar &&
				profileContents.avatar !== defaultAvatar
			) {
				body.avatar = profileContents.avatar;
			}
			const res = await patchUserDetails(body);
			setUser({
				...user,
				...res.data,
			});
			toast.success("Profile updated");
		} catch (error: any) {
			console.error(error);
			toast.error(error?.message ?? "Something went wrong");
		} finally {
			setUpdatingProfile(false);
		}
	};

	useEffect(() => {
		if (!isCheckingLoggedIn) {
			if (!isLoggedIn) {
				router.push(`/login?redirect=${router.asPath}`);
			}
		}
	}, [isCheckingLoggedIn, isLoggedIn, router]);

	useEffect(() => {
		setProfileContents({
			name: user?.name,
			email: user?.email,
			avatar: user?.avatar,
		});
	}, [user]);

	return (
		<main className={classes("")}>
			<div className={classes("-header")}>
				<button
					className={classes("-header-back")}
					onClick={() => {
						router.push("/");
					}}
				>
					<PiCaretLeftBold />
				</button>
				<Typography
					type="heading"
					variant="display"
					className={classes("-heading")}
				>
					My Profile
				</Typography>
			</div>
			{isLoggedIn && user ? (
				<section className={classes("-body")}>
					<form className={classes("-form")} onSubmit={updateProfile}>
						<Input
							label="Name"
							name="name"
							value={profileContents.name}
							type="text"
							onChange={handleChange}
							placeholder="Enter your name"
							error={profileContents.name === ""}
							errorMessage="Name is required"
							required
						/>
						<Input
							label="Email"
							name="email"
							value={profileContents.email}
							type="email"
							onChange={handleChange}
							placeholder="Enter your email"
							error={profileContents.email === ""}
							errorMessage="Email is required"
							required
							disabled
						/>
						<Input
							label="Avatar"
							name="avatar"
							value={
								profileContents.avatar === defaultAvatar
									? ""
									: profileContents.avatar
							}
							type="url"
							onChange={handleChange}
							title="Enter a valid image URL"
							placeholder="Enter your avatar URL"
							error={profileContents.avatar === ""}
							errorMessage="Enter a valid image URL"
						/>
						<Button
							variant="dark"
							loading={updatingProfile}
							type="submit"
						>
							Update Profile
						</Button>
					</form>
					<Avatar
						src={profileContents.avatar ?? defaultAvatar}
						alt={user?.name}
						size={256}
						className={classes("-avatar")}
					/>
				</section>
			) : isCheckingLoggedIn ? (
				<div className={classes("-loading")}>
					<AiOutlineLoading3Quarters
						className={classes("-loading-icon")}
					/>
				</div>
			) : null}
		</main>
	);
};

export default ProfilePage;
