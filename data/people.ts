import { PERSON_ROLE } from "@/constants/enum";
import { IPerson } from "@/types/people";

const people: IPerson[] = [
	{
		name: "Klaus Mikaelson",
		image: "https://i.pinimg.com/736x/29/7d/ba/297dbab7eb6c28a4691a63d4691c1029.jpg",
		bio: "The Original Hybrid.",
		twitter: "https://twitter.com/klausmikaelson",
		instagram: "https://www.instagram.com/klaus.mikealsonn/",
		email: "mailto:klaus@originals.com",
		role: [PERSON_ROLE.FACULTY_COORDINATOR],
	},
	{
		name: "Dylan O'Brien",
		image: "https://www.tvguide.com/a/img/resize/1e5e7ea59b78a16d9fbd685ebaec882e7e4bbba2/hub/2023/01/25/b62fc90d-6d44-444f-8b6e-b8a32529d874/teenwolf-news.jpg?auto=webp&width=1092",
		bio: "Scott McCall's best friend and a true alpha.",
		twitter: "https://twitter.com/dylanobrien",
		instagram: "https://www.instagram.com/dylanobrien/",
		email: "mailto:dylan@beaconhillsmemorial.us",
		role: [PERSON_ROLE.STUDENT_COORDINATOR],
	},
	{
		name: "Katherine Pierce",
		image: "https://www.sosyncd.com/wp-content/uploads/2022/08/24-3.png",
		bio: "I am Katherine Pierce, I am a survivor.",
		instagram: "https://www.instagram.com/katherinexvamp/",
		email: "mailto:katherine@mysticfalls.us",
		role: [PERSON_ROLE.ALUMNI],
	},
	{
		name: "Sheldon Cooper",
		image: "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/28/1499708962-gettyimages-98445192.jpg",
		bio: "Bazinga!",
		twitter: "https://twitter.com/sonofMaryCooper",
		instagram: "https://www.instagram.com/sheldoncooperunofficial/",
		email: "mailto:sheldon@caltech.us",
		role: [PERSON_ROLE.DEVELOPMENT_TEAM],
	},
	{
		name: "Chandler Bing",
		image: "https://play-images-prod-ctf.tech.tvnz.co.nz/api/v1/web/image/1mTMyzpzLPbDv36UMKSp8I/81dfbd6a4cff583ef0f2314cfc623c70/friends-characters-chandler.jpg.81dfbd6a4cff583ef0f2314cfc623c70.jpg?width=640&height=360",
		bio: "Could I be wearing any more clothes?",
		twitter: "https://twitter.com/NoContxtBing",
		instagram: "https://www.instagram.com/chandler_bingofficial/",
		email: "mailto:chanandler@chickduck.us",
		role: [PERSON_ROLE.DEVELOPMENT_TEAM],
	},
	{
		name: "Barney Stinson",
		image: "https://www.pinkvilla.com/images/2022-09/barney_stinson.jpg",
		bio: "It's gonna be legen... wait for it... dary!",
		twitter: "https://twitter.com/Broslife",
		instagram: "https://www.instagram.com/barney_stinson.officiel/",
		email: "mailto:barney@brobibs.dev",
		role: [PERSON_ROLE.STUDENT_COORDINATOR],
	},
];

export default people;
