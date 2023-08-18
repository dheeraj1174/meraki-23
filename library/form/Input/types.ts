import React from "react";

export interface InputDropdownOption {
	id: any;
	value: string;
	label: string;
}

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
	label?: string | any;
	styles?: {
		box?: React.CSSProperties;
		label?: React.CSSProperties;
		input?: React.CSSProperties;
		dropdown?: React.CSSProperties;
		dropdownOption?: React.CSSProperties;
		prefix?: React.CSSProperties;
	};
	variant?: "box" | "line";
	prefix?: any;
	icon?: any;
	iconDirection?: "left" | "right";
	dropdown?: {
		enabled: boolean;
		options: InputDropdownOption[];
		onSelect: (_: InputDropdownOption) => void;
		onSearch?: (_: string) => void;
	};
}

export interface TextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
	label?: string | any;
	styles?: {
		box?: React.CSSProperties;
		label?: React.CSSProperties;
		input?: React.CSSProperties;
	};
	variant?: "box" | "line";
}
