const sponsors: {
	name: string;
	logo: string;
	link: string;
}[] = Array(6)
	.fill([
		{
			name: "Google",
			logo: "https://gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg",
			link: "https://google.com",
		},
		{
			name: "Microsoft",
			logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
			link: "https://microsoft.com",
		},
	])
	.flat();

export default sponsors;
