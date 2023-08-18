import { FiGithub, FiLink, FiLinkedin } from "react-icons/fi";

const socials: {
	name: string;
	url: string;
	icon: any;
}[] = [
	{
		name: "GitHub",
		url: "https://github.com/akshatmittal61",
		icon: <FiGithub />,
	},
	{
		name: "LinkedIn",
		url: "https://www.linkedin.com/in/akshatmittal61/",
		icon: <FiLinkedin />,
	},
	{
		name: "Portfolio",
		url: "https://akshatmittal61.vercel.app/",
		icon: <FiLink />,
	},
];

export default socials;
