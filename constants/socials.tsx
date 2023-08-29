import { FiGlobe, FiInstagram } from "react-icons/fi";

const socials: {
	name: string;
	url: string;
	icon: any;
}[] = [
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
