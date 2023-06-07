import { Button, Flex, Heading, Link, Text, useToast } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signUpInitialValues, signUpSchema } from "./lib/schema";
import { FormikInput } from "./components/FormikInput";
import { userAPI } from "$lib/api/auth";
import { useUser } from "../../state/userState";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

export const SignUp = () => {
	const user = useUser((state) => state.user);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/profile");
		}
	}, [user]);

	return (
		<Flex width={"100%"} minHeight={"100vh"} overflow={"hidden"}>
			<Flex
				flex="1"
				background={
					"linear-gradient(180deg, #000, transparent), url(https://unsplash.com/photos/NYrVisodQ2M/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8Y29uY2VydHxlbnwwfHx8fDE2ODMzNzExODU&force=true&w=1920)"
				}
				backgroundSize={"cover"}
				direction={"column"}
				padding={["5", "10", "20"]}
				color={"white"}
			>
				<Heading mb="10" as={NavLink} to="/">
					OnReserve
				</Heading>
				<Text lineHeight={"7"}>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Nulla reprehenderit corrupti doloribus rem odit vel quis eum
					quia accusantium vero eveniet esse sequi natus vitae
					consectetur, qui quae mollitia veniam!
				</Text>
			</Flex>
			<Flex
				flex="2"
				justifyContent={"center"}
				background={"gray.200"}
				overflow={"auto"}
				p="10"
			>
				<RegisterForm />
			</Flex>
		</Flex>
	);
};

const RegisterForm = () => {
	const setUser = useUser((state) => state.setUser);
	const toast = useToast();

	const formik = useFormik({
		initialValues: signUpInitialValues,
		validationSchema: signUpSchema,
		onSubmit: async (val) => {
			try {
				const user = await userAPI.signUp(val);
				const { message, ...info } = user;
				toast({
					title: "Success",
					description: message,
					status: "success",
				});
				setUser(info);
			} catch (error) {
				if (error instanceof AxiosError) {
					toast({
						status: "error",
						title: "Error",
						description: error.response?.data.message,
					});
				}
			}
		},
	});

	return (
		<Flex
			as="form"
			onSubmit={(e: any) => formik.handleSubmit(e)}
			background={"white"}
			borderRadius={"lg"}
			boxShadow={"md"}
			p="10"
			direction={"column"}
			width={"75%"}
		>
			<Heading mb="10" textAlign={"center"}>
				Create an Account
			</Heading>
			<Flex direction={"column"} gap={"5"}>
				<Flex direction={["column", "row"]} gap="5">
					<FormikInput
						formik={formik}
						name="fname"
						placeholder="First Name"
						autocomplete="first-name"
					/>
					<FormikInput
						formik={formik}
						name="lname"
						placeholder="Last Name"
						autocomplete="last-name"
					/>
				</Flex>
				<FormikInput
					formik={formik}
					name="email"
					placeholder="Email"
					autocomplete="email"
				/>
				<Flex direction={["column", "row"]} gap="5">
					<FormikInput
						formik={formik}
						name="password"
						type="password"
						placeholder="Password"
						autocomplete="new-password"
					/>
					<FormikInput
						formik={formik}
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						autocomplete="confirm-password"
					/>
				</Flex>
				<Button
					colorScheme="blue"
					type="submit"
					mt="10"
					onClick={(e: any) => formik.handleSubmit(e)}
					isLoading={formik.isSubmitting}
				>
					Create Account
				</Button>
			</Flex>
			<Flex alignItems={"center"} justifyContent={"center"} mt="5">
				<Link as={NavLink} to="/auth/login">
					Already Have an account
				</Link>
			</Flex>
		</Flex>
	);
};
