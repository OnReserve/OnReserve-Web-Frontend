import { ICompany, companyAPI } from "$lib/api/company";
import { FormikInput } from "$pages/Auth/components/FormikInput";
import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
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
	Textarea,
	useToast,
	Text,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import { HiBuildingOffice, HiCloudArrowUp } from "react-icons/hi2";
import { useUser } from "../../state/userState";
import { useEffect } from "react";

export const EditCompanyDialog = ({
	company,
	...props
}: Omit<ModalProps, "children"> & { company: ICompany }) => {
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["editCompany", company.id],
		mutationFn: (values: typeof editCompanyValues) =>
			companyAPI.editCompany(user, company.id, values),
	});

	const formik = useFormik({
		initialValues: {
			name: company.name,
			bio: company.bio,
			coverPic: undefined as any,
			profilePic: undefined as any,
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
				onSuccess: () => {
					queryClient.invalidateQueries(["userCompany"]);
					toast({
						title: "Event Edited",
						status: "success",
					});
					props.onClose();
				},
			});
		},
	});

	useEffect(() => {
		formik.setFieldValue("name", company.name);
		formik.setFieldValue("bio", company.bio);
	}, [company]);

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Edit Company</ModalHeader>
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
											: company.coverPic ||
											  "https://api.dicebear.com/6.x/shapes/svg?seed=empty"
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
									name={formik.values.name}
									icon={<HiBuildingOffice />}
									background="purple.600"
									src={
										formik.values.profilePic
											? URL.createObjectURL(
													formik.values.profilePic
											  )
											: company.profPic || ""
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
						<Box mb="5">
							<FormikInput
								formik={formik}
								name="name"
								placeholder="Company Name"
							/>
						</Box>
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
							Save
						</Button>
						<Button onClick={props.onClose}>Cancel</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const editCompanyValues = {
	name: "",
	bio: "",
	coverPic: undefined,
	profilePic: undefined,
};
