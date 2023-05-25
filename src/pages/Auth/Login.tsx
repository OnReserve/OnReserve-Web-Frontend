import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { SeparatorWithLabel } from "./components/Separator";
import { loginSchema } from "./lib/schema";
import { FormikInput } from "./components/FormikInput";

export const Login = () => {
	return (
		<Flex
			width={"100%"}
			minHeight={"100vh"}
			direction={["column", "column", "row"]}
			overflow={["auto", "hidden"]}
		>
			<Flex
				display={["none", "flex"]}
				flex={["none", "1"]}
				background={
					"linear-gradient(180deg, #000, transparent), url(https://unsplash.com/photos/NYrVisodQ2M/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHx8fDE2ODMzNzExODU&force=true&w=1920)"
				}
				backgroundSize={"cover"}
				direction={"column"}
				padding={["0", "10", "20"]}
				color={"white"}
			>
				<Heading mb={["0", null, "10"]} as={NavLink} to="/">
					OnReserve
				</Heading>
				<Text lineHeight={"7"} display={["none", null, "block"]}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Nulla reprehenderit corrupti doloribus rem odit vel quis eum
					quia accusantium vero eveniet esse sequi natus vitae
					consectetur, qui quae mollitia veniam!
				</Text>
			</Flex>
			<Flex
				background={"gray.200"}
				flex={2}
				justifyContent={"center"}
				alignItems={"center"}
				overflow={"auto"}
			>
				<Flex
					background={"white"}
					direction={"column"}
					p={["5", "20"]}
					width={["100%", "75%"]}
					borderRadius={"lg"}
					boxShadow={"lg"}
				>
					<Heading mb="10" textAlign={"center"}>
						Welcome to OnReserve
					</Heading>
					<LoginForm />
					<Flex
						alignItems={"center"}
						justifyContent={"center"}
						mt="5"
					>
						<Link as={NavLink} to="/auth/sign-up">
							Don't have an Account?
						</Link>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};

const LoginForm = () => {
	const formik = useFormik({
		validationSchema: loginSchema,
		initialValues: {
			email: "",
			password: "",
		},
		onSubmit: (values) => {
			console.log(values);
		},
	});

	return (
		<Flex
			as={"form"}
			onSubmit={(e: any) => formik.handleSubmit(e)}
			direction={"column"}
			gap={"5"}
		>
			<FormikInput
				name="email"
				type="email"
				placeholder="Email or Phone Number"
				formik={formik}
				autocomplete="email"
			/>
			<FormikInput
				name="password"
				type="password"
				placeholder="Password"
				formik={formik}
				autocomplete="current-password"
			/>

			<Link
				as={NavLink}
				href="/auth/forget-password"
				color={"gray.700"}
				alignSelf={"flex-end"}
			>
				Forget Password?
			</Link>
			<Button
				colorScheme="blue"
				type="submit"
				mt="5"
				onClick={(e: any) => formik.handleSubmit(e)}
				isLoading={formik.isSubmitting}
			>
				Sign In
			</Button>
		</Flex>
	);
};
