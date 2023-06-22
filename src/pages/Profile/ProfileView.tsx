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
	IconButton,
	Img,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Skeleton,
	SkeletonText,
	Table,
	Tag,
	Tbody,
	Td,
	Text,
	Textarea,
	Tr,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HiCloudArrowUp, HiPencilSquare, HiPlus } from "react-icons/hi2";
import { useUser } from "../../state/userState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { companyAPI } from "$lib/api/company";
import { FormikInput } from "$pages/Auth/components/FormikInput";
import { useFormik } from "formik";
import { AuthGuard } from "../../components/AuthGuard";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import { EditProfileDialog } from "./EditProfile";
import { myConstants } from "$config/theme";

export const ProfileViewPage = () => {
	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					minHeight={"100vh"}
					direction={"column"}
					px={myConstants.pagePadding}
					py="5"
					background={"gray.100"}
				>
					<Flex
						gap={"10"}
						alignItems={["stretch", "stretch", "flex-start"]}
						direction={["column", "column", "row"]}
					>
						<ProfileCard />
						<CompaniesCard />
					</Flex>
					<UserEvents />
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const ProfileCard = () => {
	const user = useUser((state) => state.user);
	const dialog = useDisclosure();

	return (
		<Flex
			flex={1}
			direction={"column"}
			boxShadow={"base"}
			borderRadius={"xl"}
			background="white"
			position={"relative"}
		>
			<EditProfileDialog
				isOpen={dialog.isOpen}
				onClose={dialog.onClose}
			/>
			<Box position={"relative"} mb="10">
				<Img
					borderTopRadius={"xl"}
					width={"full"}
					height={"40"}
					objectFit={"cover"}
					src={
						user?.coverPic ||
						"https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
					}
				></Img>
				<Avatar
					size={"2xl"}
					border={"4px solid white"}
					background={"gray.300"}
					position={"absolute"}
					bottom={"-12"}
					left={"30"}
					src={user?.profilePic || ""}
				/>
			</Box>
			<Flex direction={"column"} p="5">
				<Flex>
					<Flex direction={"column"} flex={"1"}>
						<Heading size={"lg"}>
							{user?.fname + " " + user?.lname}
						</Heading>
						<Text fontSize={"sm"}>{user?.email}</Text>
					</Flex>
					<IconButton
						onClick={dialog.onOpen}
						aria-label="Edit Profile"
						variant={"ghost"}
						colorScheme={"blue"}
						icon={<Icon as={HiPencilSquare} boxSize={"5"} />}
					/>
				</Flex>
				<Text>{user?.bio}</Text>
			</Flex>
		</Flex>
	);
};

const CompaniesCard = () => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	return (
		<Flex
			flex={2}
			background={"white"}
			p="8"
			borderRadius={"xl"}
			flexDirection={"column"}
		>
			<AddCompanyDialog isOpen={isOpen} onClose={onClose} />
			<Flex alignItems={"center"} justifyContent={"space-between"}>
				<Heading fontSize={"2xl"}>Companies</Heading>

				<IconButton
					aria-label="add-company"
					display={["flex", "flex", "none"]}
					icon={<HiPlus />}
					size={"sm"}
					colorScheme="blue"
					onClick={onOpen}
				></IconButton>

				<Button
					display={["none", "none", "flex"]}
					leftIcon={<HiPlus />}
					size={"sm"}
					colorScheme="blue"
					onClick={onOpen}
				>
					Add Company
				</Button>
			</Flex>
			<Flex
				mt="5"
				direction={"column"}
				maxHeight={"400px"}
				overflow={"auto"}
			>
				<Table height={"full"}>
					<CompaniesList />
				</Table>
			</Flex>
		</Flex>
	);
};

const CompaniesList = () => {
	const user = useUser((state) => state.user);
	const query = useQuery({
		queryKey: ["userCompany", user?.id],
		queryFn: () => companyAPI.getUserCompanies(user),
	});

	if (query.isLoading) {
		return (
			<Tbody>
				{[...Array(3)].map((_v, _i) => (
					<Tr key={_i}>
						<Td>
							<SkeletonText noOfLines={1} width={"100%"} />
						</Td>
						<Td>
							<SkeletonText noOfLines={1} width={"100%"} />
						</Td>
						<Td>
							<SkeletonText noOfLines={1} width={"100%"} />
						</Td>
					</Tr>
				))}
			</Tbody>
		);
	}

	return (
		<Tbody>
			{query.data &&
				query.data.map((current) => (
					<Tr key={current.company.id}>
						{/* <Td>
							<Avatar src={current.company.profPic} size={"sm"} />
						</Td> */}
						<Td textAlign={"start"}>
							<Text
								as={Link}
								color={"blue.800"}
								to={`/company/${current.company.id}`}
							>
								{current.company.name}
							</Text>
						</Td>
						<Td>
							<Tag fontWeight={"bold"}>
								{current.company._count.users} Admins
							</Tag>
						</Td>
						<Td>
							<Tag fontWeight={"bold"}>
								{current.company._count.events} Events
							</Tag>
						</Td>

						<Td alignItems={"flex-end"} textAlign={"end"}>
							<IconButton
								as={Link}
								to={"/company/edit/" + current.company.id}
								icon={<Icon as={HiPencilSquare} />}
								aria-label="Edit Company"
							/>
						</Td>
					</Tr>
				))}
		</Tbody>
	);
};

interface IAddCompanyModal {
	isOpen: boolean;
	onClose: () => void;
}

const AddCompanyDialog = ({ isOpen, onClose }: IAddCompanyModal) => {
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationKey: ["addCompany"],
		mutationFn: (values: typeof addCompanyInitialValues) =>
			companyAPI.addCompany(user, values),
	});
	const formik = useFormik({
		initialValues: addCompanyInitialValues,
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
						title: "Successfully Added",
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
				<ModalHeader>Add Company</ModalHeader>
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
									name={formik.values.name}
									background="purple.600"
									src={
										formik.values.profilePic
											? URL.createObjectURL(
													formik.values.profilePic
											  )
											: ""
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
							Create Company
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const addCompanyInitialValues = {
	name: "",
	bio: "",
	coverPic: undefined,
	profilePic: undefined,
};

function UserEvents({}) {
	const user = useUser((state) => state.user);
	const userEvents = useQuery({
		queryKey: ["userEvents", user?.id],
		queryFn: () => eventAPI.getUserEvents(user),
	});

	return (
		<Flex
			direction={"column"}
			background={"white"}
			mt="10"
			p="10"
			borderRadius={"xl"}
		>
			<Flex justifyContent={"space-between"} alignItems={"center"}>
				<Heading fontSize={"2xl"}>My Events</Heading>
				<Button leftIcon={<HiPlus />} as={Link} to="/event/add">
					New Event
				</Button>
			</Flex>
			<Grid
				gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
				mt="10"
				gap={"5"}
			>
				{userEvents.isLoading &&
					[...Array(3)].map((_v, _i) => (
						<Skeleton
							height="200px"
							width={"250px"}
							borderRadius={"lg"}
						/>
					))}
				{userEvents.data &&
					userEvents.data.map((event) => <EventCard event={event} />)}
			</Grid>
		</Flex>
	);
}

function EventCard({ event }: { event: IEventUserResponse }) {
	return (
		<Flex direction={"column"} borderRadius={"lg"} boxShadow={"base"}>
			<Img
				borderTopRadius={"lg"}
				width={"100%"}
				height={"200px"}
				objectFit={"cover"}
				src={event.galleries[0].eventPhoto}
			></Img>
			<Flex direction={"column"} p="4">
				<Heading fontSize={"lg"} mb="3">
					{event.title}
				</Heading>
				<Text fontSize={"sm"} fontWeight={"bold"}>
					{formatDateForUserEvent(event.createdAt)}
				</Text>
				<Text fontSize={"sm"}>{event.company?.name}</Text>
			</Flex>
		</Flex>
	);
}
