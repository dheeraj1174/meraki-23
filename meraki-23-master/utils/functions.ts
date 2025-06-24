// function to get a random element from an array
export const getRandomElement = <T>(arr: T[]): T => {
	const randomIndex = Math.floor(Math.random() * arr.length);
	return arr[randomIndex];
};

// function to open a link in a new tab
export const openLink = (link: string) => window.open(link, "_blank");

// function to copy text to clipboard
export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
};

// function to get a random number between min and max
export const random = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

// function to shuffle an array in place
export const shuffle = (array: any[]) => {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

// function to implement a sleep function
export const sleep = (seconds: number) =>
	new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// function for finding max and min of two numbers
export const max = (a: number, b: number) => (a > b ? a : b);
export const min = (a: number, b: number) => (a < b ? a : b);

// debounce function for delaying function calls
export const debounce = (func: any, wait: number) => {
	let timeout: any;
	return (e: any) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func(e);
		}, wait);
	};
};

// function to get a random ID
export const randomId = () => Math.floor(Math.random() * 1000000000);

// function to covert text to slug
export const slugify = (text: string) =>
	text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text

// function to declare while dealing wih modular css
export const stylesConfig =
	(styles: any, prefix: string = "") =>
	(...args: any[]) => {
		const classes: any[] = [];
		args.forEach((arg) => {
			if (typeof arg === "string")
				classes.push(styles[`${prefix}${arg}`]);
			else if (typeof arg === "object")
				Object.keys(arg).forEach((key) => {
					if (arg[key]) classes.push(styles[`${prefix}${key}`]);
				});
		});
		return classes.join(" ");
	};

// function to omit keys from an object
export const omitKeys = (obj: any, keys: string[]) => {
	const newObj: any = {};
	Object.keys(obj).forEach((key) => {
		if (!keys.includes(key)) {
			newObj[key] = obj[key];
		}
	});
	return newObj;
};

// function to round off a number to given decimal places
export const roundOff = (num: number, decimalPlaces: number) =>
	Math.round(num * 10 ** decimalPlaces) / 10 ** decimalPlaces;

// function to switch date time between UTC and Locale
export const switchDateFormat = (
	date: string,
	from: "utc" | "locale",
	to: "utc" | "locale"
) => {
	if (from === "utc" && to === "locale") {
		let utcSeconds = new Date(date).getTime() / 1000;
		let isoLocal = new Date(
			utcSeconds * 1000 - new Date().getTimezoneOffset() * 60000
		)
			.toISOString()
			.slice(0, -1);
		return isoLocal;
	} else if (from === "locale" && to === "utc") {
		return new Date(date).toISOString();
	} else {
		return date;
	}
};
