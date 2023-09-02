import { FiGlobe, FiInstagram, FiMail } from "react-icons/fi";

const socials: {
	name: string;
	url: string;
	icon: any;
}[] = [
	{
		name: "Email",
		url: "mailto:meraki@iiitu.ac.in",
		icon: <FiMail />,
	},
	{
		name: "Website",
		url: "https://iiitu.ac.in",
		icon: <FiGlobe />,
	},
	{
		name: "Instagram",
		url: "https://www.instagram.com/meraki_iiitu/",
		icon: <FiInstagram />,
	},
];

export default socials;
