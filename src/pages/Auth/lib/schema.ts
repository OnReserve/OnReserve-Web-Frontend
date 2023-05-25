import * as yup from "yup";
export const loginSchema = yup.object().shape({
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password ")
		.min(6, "Password must be min. of 6 chars."),
});

export const loginInitialValues = {
	email: "",
	password: "",
};

export const signUpInitialValues = {
	fname: "",
	lname: "",
	email: "",
	password: "",
	confirmPassword: "",
};

export const signUpSchema = yup.object().shape({
	fname: yup.string().required("Please enter your first name"),
	lname: yup.string().required("Please enter your last name"),
	email: yup
		.string()
		.required("Please enter your email")
		.email("Please enter a valid email"),
	password: yup
		.string()
		.required("Please enter your password")
		.min(6, "Password must be min. of 6 chars"),
	confirmPassword: yup
		.string()
		.required("Please confirm your password")
		.oneOf(
			[yup.ref("password")],
			"Your confirmation doesn't match your password"
		),
});
