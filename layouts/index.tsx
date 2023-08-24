import React, { useEffect } from "react";
import Seo from "./Seo";
import { frontendBaseUrl } from "@/constants/variables";
import { Toaster } from "react-hot-toast";
import useStore from "@/hooks/store";
import { fetchAuthenticatedUser } from "@/utils/api/auth";
import { useRouter } from "next/router";
import { USER_ROLES } from "@/constants/enum";

const Layout: React.FC<any> = ({ children }) => {
	const router = useRouter();
	const { setIsLoggedIn, setIsCheckingLoggedIn, setUser } = useStore();

	const loginUser = async () => {
		try {
			setIsCheckingLoggedIn(true);
			const res = await fetchAuthenticatedUser();
			setUser(res.user);
			setIsLoggedIn(true);
			return Promise.resolve(res.user);
		} catch (error) {
			console.error(error);
			setIsLoggedIn(false);
			return Promise.reject(error);
		} finally {
			setIsCheckingLoggedIn(false);
		}
	};

	useEffect(() => {
		if (localStorage.getItem("token")) {
			loginUser()
				.then((user) => {
					if (
						router.pathname.startsWith("/admin") &&
						user.role !== USER_ROLES.ADMIN
					) {
						router.push("/profile");
					}
				})
				.catch((error) => {
					if (router.pathname.startsWith("/admin"))
						router.push("/login");
					console.error(error);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Seo
				title="Meraki - Technical Fest of IIIT Una"
				description="Meraki is the annual technical fest of IIIT Una. It is a 3-day event held in September. It is a platform for students to showcase their technical skills and knowledge."
				image="/images/favicon.png"
				icons={["icon", "shortcut icon", "apple-touch-icon"].map(
					(item) => {
						return {
							rel: item,
							href: `${frontendBaseUrl}/favicon.ico`,
							type: "icon/ico",
						};
					}
				)}
				twitter={{
					card: "summary_large_image",
					site: "@akshatmittal61",
					author: "@akshatmittal61",
					title: "Meraki - Technical Fest of IIIT Una",
					description:
						"Meraki is the annual technical fest of IIIT Una. It is a 3-day event held in September. It is a platform for students to showcase their technical skills and knowledge.",
					image: `${frontendBaseUrl}/og-image.png`,
					url: frontendBaseUrl,
				}}
				og={{
					title: "Meraki - Technical Fest of IIIT Una",
					description:
						"Meraki is the annual technical fest of IIIT Una. It is a 3-day event held in September. It is a platform for students to showcase their technical skills and knowledge.",
					images: [16, 32, 70, 128, 144, 192, 512]
						.map((size) => ({
							url: `${frontendBaseUrl}/favicon-${size}.png`,
							secureUrl: `${frontendBaseUrl}/favicon-${size}.png`,
							type: "image/png",
							width: size,
							height: size,
							alt: "Meraki - Technical Fest of IIIT Una",
						}))
						.concat([
							{
								url: `${frontendBaseUrl}/card.png`,
								secureUrl: `${frontendBaseUrl}/card.png`,
								type: "image/png",
								width: 800,
								height: 600,
								alt: "Meraki - Technical Fest of IIIT Una",
							},
							{
								url: `${frontendBaseUrl}/og-image.png`,
								secureUrl: `${frontendBaseUrl}/og-image.png`,
								type: "image/png",
								width: 1200,
								height: 630,
								alt: "Meraki - Technical Fest of IIIT Una",
							},
						]),
					url: frontendBaseUrl,
					type: "website",
					siteName: "Meraki - Technical Fest of IIIT Una",
				}}
				themeColor="#121f3d"
				canonical={frontendBaseUrl}
				siteName="Meraki - Technical Fest of IIIT Una"
			/>
			{children}
			<Toaster position="top-center" />
		</>
	);
};

export default Layout;
