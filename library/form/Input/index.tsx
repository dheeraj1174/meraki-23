import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { InputProps, InputDropdownOption, TextareaProps } from "./types";
import styles from "./styles.module.scss";
import { stylesConfig } from "@/utils/functions";

const classes = stylesConfig(styles, "input");

const Input: React.FC<InputProps> = ({
	label,
	variant = "line",
	icon,
	iconDirection = "right",
	styles,
	dropdown,
	prefix,
	style,
	className,
	error,
	errorMessage,
	...props
}) => {
	const prefixRef = useRef<any>(null);
	const inputRef = useRef<any>(null);
	const [optionsToRender, setOptionsToRender] = useState<
		InputDropdownOption[]
	>(dropdown?.options || []);
	const [paddingLeft, setPaddingLeft] = useState("");

	useEffect(() => {
		setPaddingLeft(
			prefix
				? prefixRef.current?.clientWidth + 8 + "px"
				: icon && iconDirection === "left"
				? "30px"
				: variant === "box"
				? "10px"
				: "4px"
		);
	}, [icon, iconDirection, variant, prefix]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				dropdown?.enabled &&
				optionsToRender?.length > 0 &&
				inputRef.current === document.activeElement
			) {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					const nextIndex =
						optionsToRender?.findIndex(
							(option) => option.value === inputRef.current?.value
						) + 1;
					if (nextIndex < optionsToRender?.length) {
						inputRef.current.value =
							optionsToRender[nextIndex].value;
					}
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
					const nextIndex =
						optionsToRender?.findIndex(
							(option) => option.value === inputRef.current?.value
						) - 1;
					if (nextIndex >= 0) {
						inputRef.current.value =
							optionsToRender[nextIndex].value;
					}
				} else if (e.key === "Enter") {
					e.preventDefault();
					const selectedOption = optionsToRender?.find(
						(option) => option.value === inputRef.current?.value
					);
					if (selectedOption) {
						dropdown.onSelect(selectedOption);
						inputRef.current.blur();
					}
				} else if (e.key === "Escape") {
					e.preventDefault();
					inputRef.current.blur();
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [dropdown, optionsToRender]);

	return (
		<div
			className={
				classes("", {
					"--box": variant === "box",
					"--line": variant === "line",
				}) + ` ${className}`
			}
			style={styles?.box}
		>
			{label ? (
				<label className={classes("__label")} style={styles?.label}>
					{label}
				</label>
			) : null}
			{prefix ? (
				<div
					style={styles?.prefix}
					className={classes("__prefix")}
					ref={prefixRef}
				>
					{prefix}
				</div>
			) : null}
			{!prefix && icon && iconDirection === "left" ? (
				<div
					className={classes("__icon", "__icon--left")}
					style={{
						top:
							inputRef.current?.offsetTop +
							inputRef.current?.clientHeight / 2 +
							"px",
					}}
				>
					{icon}
				</div>
			) : null}
			<input
				className={classes("__input")}
				ref={inputRef}
				style={{
					paddingLeft: paddingLeft,
					...styles?.input,
					...style,
				}}
				onInvalid={(e) => {
					e.currentTarget.setCustomValidity(errorMessage + "");
				}}
				onInput={(e) => {
					e.currentTarget.setCustomValidity("");
				}}
				title={error ? errorMessage : props.title ?? ""}
				{...props}
				onChange={(e) => {
					if (dropdown?.enabled) {
						const search = e.target.value;
						const options = dropdown.options.filter((option) =>
							option.label
								.toLowerCase()
								.includes(search.toLowerCase())
						);
						setOptionsToRender(options);
						if (dropdown.onSearch) dropdown.onSearch(search);
						else if (props.onChange) props.onChange(e);
					} else {
						props?.onChange?.(e);
					}
				}}
			/>
			{!dropdown?.enabled && icon && iconDirection === "right" ? (
				<div
					className={classes("__icon", "__icon--right")}
					style={{
						top:
							inputRef.current?.offsetTop +
							inputRef.current?.clientHeight / 2 +
							"px",
					}}
				>
					{icon}
				</div>
			) : null}
			{dropdown?.enabled ? (
				<div
					className={classes("__icon", "__icon--right")}
					style={{
						top:
							inputRef.current?.offsetTop +
							inputRef.current?.clientHeight / 2 +
							"px",
					}}
					onClick={() => {
						inputRef.current.focus();
					}}
				>
					<IoIosArrowDown />
				</div>
			) : null}
			{dropdown?.enabled ? (
				<div className={classes("__dropdown")} style={styles?.dropdown}>
					{optionsToRender?.map((option, index) => (
						<div
							key={index}
							className={classes("__dropdown__option")}
							onClick={() => {
								dropdown?.onSelect(option);
								inputRef.current.blur();
							}}
							style={styles?.dropdownOption}
						>
							{option.label}
						</div>
					))}
				</div>
			) : null}
		</div>
	);
};

const Textarea: React.FC<TextareaProps> = ({
	label,
	variant = "line",
	styles,
	error,
	errorMessage,
	...props
}) => {
	return (
		<div
			className={
				classes("", {
					"--box": variant === "box",
					"--line": variant === "line",
				}) + ` ${props.className}`
			}
			style={styles?.box}
		>
			{label ? (
				<label className={classes("__label")} style={styles?.label}>
					{label}
				</label>
			) : null}
			<textarea
				className={classes("__input")}
				style={styles?.input}
				onInvalid={(e) => {
					e.currentTarget.setCustomValidity(errorMessage + "");
				}}
				onInput={(e) => {
					e.currentTarget.setCustomValidity("");
				}}
				title={error ? errorMessage : props.title ?? ""}
				{...props}
			/>
		</div>
	);
};

export { Textarea };

export default Input;
