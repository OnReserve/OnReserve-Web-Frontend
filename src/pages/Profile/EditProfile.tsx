import { formatDateForUserEvent } from "$config/dayjs.config";
import { companyAPI } from "$lib/api/company";
import { eventAPI, IEventUserResponse } from "$lib/api/event";
import { FormikInput } from "$pages/Auth/components/FormikInput";
import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	Heading,
	Icon,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalProps,
	Skeleton,
	Textarea,
	useQuery,
	useToast,
	Text,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { HiCloudArrowUp, HiPlus } from "react-icons/hi2";
import { useUser } from "../../state/userState";
import { profileAPI } from "$lib/api/profile";

export const EditProfileDialog = ({
	isOpen,
	onClose,
}: Omit<ModalProps, "children">) => {
	const user = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
	const toast = useToast();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["addCompany"],
		mutationFn: (values: typeof editProfileInitialValues) =>
			profileAPI.editProfile(user, values),
	});
	const formik = useFormik({
		initialValues: {
			...editProfileInitialValues,
			fname: user?.fname || "",
			lname: user?.lname || "",
			bio: user?.bio || "",
		},
		onSubmit: (values) => {
			mutation.mutateAsync(values, {
				onError: (error) => {
					if (error instanceof AxiosError) {
						toast({
							title: "Error Happened",
							description: error.response?.data.message,
							status: "error",
						});
					}
				},
				onSuccess: (data, variables, context) => {
					setUser(data);
					toast({
						title: "Profile Edited",
						status: "success",
					});
					onClose();
				},
			});
		},
	});
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Profile</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Flex
						as={"form"}
						onSubmit={(e: any) => formik.handleSubmit(e)}
						direction={"column"}
					>
						<Box position={"relative"} mb="70px">
							<Box
								as="label"
								position={"relative"}
								sx={{ "&:hover .uploadLabel": { opacity: 1 } }}
							>
								<Flex
									transition={"all 200ms ease-out"}
									className="uploadLabel"
									direction={"column"}
									alignItems={"center"}
									justifyContent={"center"}
									color={"white"}
									opacity={formik.values.coverPic ? 0 : 1}
									background={"blackAlpha.600"}
									position={"absolute"}
									left={0}
									right={0}
									top={0}
									bottom={0}
									zIndex={9}
								>
									<Icon as={HiCloudArrowUp} boxSize={"10"} />
									<Text fontSize={"sm"} fontWeight={"bold"}>
										Upload Cover
									</Text>
								</Flex>
								<Img
									borderRadius={"md"}
									width={"100%"}
									objectFit={"cover"}
									height={"150px"}
									src={
										formik.values.coverPic
											? URL.createObjectURL(
													formik.values.coverPic
											  )
											: user?.coverPic
											? user.coverPic
											: "https://api.dicebear.com/6.x/shapes/svg?seed=empty"
									}
								/>
								<Input
									type="file"
									name="coverPic"
									onChange={(event) => {
										if (event.target.files) {
											formik.setFieldValue(
												"coverPic",
												event.target.files[0]
											);
										}
									}}
									hidden
									accept="images/*"
								/>
							</Box>
							<Box
								zIndex={10}
								left={"5"}
								bottom="-50px"
								as="label"
								position={"absolute"}
								alignSelf={"flex-start"}
								sx={{
									"&:hover .uploadLabel": {
										opacity: 1,
									},
								}}
							>
								<Flex
									transition={"all 200ms ease-out"}
									className="uploadLabel"
									direction={"column"}
									alignItems={"center"}
									justifyContent={"center"}
									color={"white"}
									opacity={0}
									background={"blackAlpha.600"}
									borderRadius={"full"}
									position={"absolute"}
									left={0}
									right={0}
									top={0}
									bottom={0}
									zIndex={9}
								>
									<Icon as={HiCloudArrowUp} boxSize={"10"} />
									<Text fontSize={"sm"} fontWeight={"bold"}>
										Upload Profile
									</Text>
								</Flex>
								<Avatar
									border={"4px solid white"}
									size={"2xl"}
									background="purple.600"
									src={
										formik.values.profilePic
											? URL.createObjectURL(
													formik.values.profilePic
											  )
											: user?.profilePic || ""
									}
								/>
								<Input
									type="file"
									name="profilePic"
									onChange={(event) => {
										if (event.target.files) {
											formik.setFieldValue(
												"profilePic",
												event.target.files[0]
											);
										}
									}}
									hidden
									accept="images/*"
								/>
							</Box>
						</Box>
						<Flex mb="5" gap="4">
							<FormikInput
								formik={formik}
								name="fname"
								placeholder="First Name"
							/>
							<FormikInput
								formik={formik}
								name="lname"
								placeholder="Last Name"
							/>
						</Flex>
						{/* <Flex mb="5">
							<FormikInput
								formik={formik}
								name="phoneNumber"
								type="tel"
								placeholder="Phone Number"
							/>
						</Flex> */}
						<FormControl mb="5">
							<FormLabel>Bio</FormLabel>
							<Textarea
								name="bio"
								value={formik.values.bio}
								onChange={formik.handleChange}
								variant={"filled"}
								size={"md"}
								maxLength={255}
							/>
						</FormControl>
					</Flex>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							colorScheme="blue"
							onClick={(e: any) => formik.handleSubmit(e)}
							isLoading={mutation.isLoading}
						>
							Update Profile
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const editProfileInitialValues = {
	fname: "",
	lname: "",
	phoneNumber: "",
	bio: "",
	coverPic: undefined,
	profilePic: undefined,
};
