import { FormikContextType } from "formik";
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from "@chakra-ui/react";

interface IFormikInput {
	placeholder: string;
	name: string;
	type?: string;
	autocomplete?: string;
	formik: FormikContextType<any>;
}
export const FormikInput = ({
	name,
	placeholder,
	type,
	formik,
	autocomplete,
}: IFormikInput) => {
	return (
		<FormControl isInvalid={formik.touched[name] && !!formik.errors[name]}>
			<FormLabel>{placeholder}</FormLabel>
			<Input
				name={name}
				variant={"filled"}
				type={type || "text"}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				value={formik.values[name]}
				autoComplete={autocomplete}
			/>
			<FormErrorMessage>
				{formik.touched[name] && !!formik.errors[name]
					? formik.errors[name]?.toString()
					: ""}
			</FormErrorMessage>
		</FormControl>
	);
};
