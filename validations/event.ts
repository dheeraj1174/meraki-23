import regex from "@/constants/regex";
import { IEvent } from "@/types/event";

interface ParsedEvent extends Omit<Omit<IEvent, "_id">, "teamSize"> {
	teamSize: string;
}

const getErrorArray = (errors: Partial<ParsedEvent>) =>
	Object.entries(errors).map(([field, message]) => ({
		field,
		message,
	}));

export const createEventValidator = async (values: ParsedEvent) => {
	const errors: Partial<ParsedEvent> = {};

	if (!values.name) {
		errors.name = "Event Title is required";
	}

	if (!values.description) {
		errors.description = "Event description is required";
	}

	if (!values.date) {
		errors.date = "Please enter event starting date";
	}

	if (!values.image) {
		errors.image = "Please provide link to a poster image";
	} else if (!regex.avatar.test(values.image)) {
		errors.image = "Please provide a valid image URL";
	}

	if (!values.teamSize) {
		errors.teamSize =
			"Please enter maximum number of members in a team (1 for solo participation)";
	} else if (isNaN(Number(values.teamSize))) {
		errors.teamSize = "Please enter a valid number";
	} else if (Number(values.teamSize) < 1) {
		errors.teamSize = "Team size cannot be less than 1";
	}

	return Object.keys(errors).length === 0
		? Promise.resolve()
		: Promise.reject(getErrorArray(errors));
};
