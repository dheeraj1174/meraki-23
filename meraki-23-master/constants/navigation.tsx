import {
	FiAirplay,
	FiFileText,
	FiHelpCircle,
	FiHome,
	FiImage,
	FiInfo,
	FiSend,
	FiUsers,
} from "react-icons/fi";

const navLinks: {
	icon: any;
	path: string;
	label: string;
}[] = [
	{
		label: "Home",
		path: "/",
		icon: <FiHome />,
	},
	{
		label: "Events",
		path: "/events",
		icon: <FiAirplay />,
	},
	{
		label: "Gallery",
		path: "/gallery",
		icon: <FiImage />,
	},
	{
		label: "About",
		path: "/about",
		icon: <FiInfo />,
	},
	{
		label: "Brochure",
		path: "/brochure",
		icon: <FiFileText />,
	},
	{
		label: "Sponsors",
		path: "/sponsors",
		icon: <FiUsers />,
	},
	{
		label: "Team",
		path: "/team",
		icon: <FiUsers />,
	},
	{
		label: "FAQs",
		path: "/faqs",
		icon: <FiHelpCircle />,
	},
	{
		label: "Contact Us",
		path: "/contact",
		icon: <FiSend />,
	},
];
export default navLinks;
