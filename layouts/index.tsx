import React from "react";
import Seo from "./Seo";
import { frontendBaseUrl } from "@/constants/variables";
import { Toaster } from "react-hot-toast";

const Layout: React.FC<any> = ({ children }) => {
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
							href: "/favicon.ico",
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
					image: "/images/og-image.png",
					url: frontendBaseUrl,
				}}
				og={{
					title: "Meraki - Technical Fest of IIIT Una",
					description:
						"Meraki is the annual technical fest of IIIT Una. It is a 3-day event held in September. It is a platform for students to showcase their technical skills and knowledge.",
					images: [
						{
							url: "/images/og-image.png",
							secureUrl: "/images/og-image.png",
							type: "image/png",
							width: 1200,
							height: 630,
							alt: "Meraki - Technical Fest of IIIT Una",
						},
					],
					url: frontendBaseUrl,
					type: "website",
					siteName: "Meraki - Technical Fest of IIIT Una",
				}}
				themeColor="#121f3d"
			/>
			{children}
			<Toaster position="top-center" />
		</>
	);
};

export default Layout;
