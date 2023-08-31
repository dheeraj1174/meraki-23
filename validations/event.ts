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

	if (!values.registrationsStart) {
		errors.registrationsStart = "Please provide a valid date";
	} else if (isNaN(Date.parse(values.registrationsStart))) {
		errors.registrationsStart = "Please provide a valid date";
	}

	if (!values.registrationsEnd) {
		errors.registrationsEnd = "Please provide a valid date";
	} else if (isNaN(Date.parse(values.registrationsEnd))) {
		errors.registrationsEnd = "Please provide a valid date";
	}

	if (!values.eventStart) {
		errors.eventStart = "Please provide a valid date";
	} else if (isNaN(Date.parse(values.eventStart))) {
		errors.eventStart = "Please provide a valid date";
	}

	if (!values.eventEnd) {
		errors.eventEnd = "Please provide a valid date";
	} else if (isNaN(Date.parse(values.eventEnd))) {
		errors.eventEnd = "Please provide a valid date";
	}

	if (
		values.registrationsStart &&
		values.registrationsEnd &&
		Date.parse(values.registrationsStart) >=
			Date.parse(values.registrationsEnd)
	) {
		errors.registrationsStart =
			"Registrations start date must be before registrations end date";
		errors.registrationsEnd =
			"Registrations end date must be after registrations start date";
	}

	if (
		values.eventStart &&
		values.eventEnd &&
		Date.parse(values.eventStart) >= Date.parse(values.eventEnd)
	) {
		errors.eventStart = "Event start date must be before event end date";
		errors.eventEnd = "Event end date must be after event start date";
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
