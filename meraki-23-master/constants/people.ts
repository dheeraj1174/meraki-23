import { PERSON_ROLE } from "@/constants/enum";
import { IPerson } from "@/types/people";
import rawData from "@/data/people.json";

const getRole = (role: string) => {
	switch (role) {
		case "Faculty Coordinator":
			return PERSON_ROLE.FACULTY_COORDINATOR;
		case "Student Coordinator":
			return PERSON_ROLE.STUDENT_COORDINATOR;
		case "Alumni Member":
			return PERSON_ROLE.ALUMNI;
		case "Development Team":
			return PERSON_ROLE.DEVELOPMENT_TEAM;
		default:
			return PERSON_ROLE.STUDENT_COORDINATOR;
	}
};

const getDriveImageUrl = (url: string) => {
	const params = new URLSearchParams(url);
	const id = params.get("id");
	return `https://drive.google.com/uc?export=view&id=${id}`;
};

const people: IPerson[] = rawData.map((person) => ({
	name: person["Full Name"],
	image: getDriveImageUrl(
		person["Profile Photo(preferably focused on face)"]
	),
	bio: person["Short Bio (Bob the builder, building the web)"],
	twitter: person["Twitter Profile URL"],
	instagram: person["Instagram Profile URL"],
	email: person["Your Email"] as string,
	role: person["Designation in Organising Committee"].split(";").map(getRole),
}));

export default people;
