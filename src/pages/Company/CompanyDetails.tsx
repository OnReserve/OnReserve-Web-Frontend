import {
	Alert,
	AlertDescription,
	AlertIcon,
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
	Spinner,
	Text,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HiPencilSquare, HiPlus, HiTrash } from "react-icons/hi2";
import { useUser } from "../../state/userState";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	EventResponse,
	ICompanyAdminResponse,
	ICompanyDetailsResponse,
	companyAPI,
} from "$lib/api/company";
import { Field, Form, Formik } from "formik";
import { AxiosError } from "axios";
import { formatDateForUserEvent } from "$config/dayjs.config";
import { myConstants } from "$config/theme";
import { EditCompanyDialog } from "./EditCompany";

export const CompanyDetailsPage = () => {
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
					<PageContent />
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const PageContent = () => {
	const { id } = useParams();
	const user = useUser((state) => state.user);

	const query = useQuery({
		queryKey: ["companyDetails", id],
		queryFn: () => companyAPI.getCompanyDetails(user, parseInt(id || "0")),
	});

	if (query.isLoading) {
		return <Spinner alignSelf={"center"} justifySelf={"center"} />;
	}

	return (
		<Flex gap={"10"} direction={"column"}>
			{query.data && <CompanyProfileCard data={query.data} />}
			{query.data && <AdminsList data={query.data?.users} />}
			{query.data && <EventsList events={query.data?.events} />}
		</Flex>
	);
};

interface IAdminsList {
	data: { user: ICompanyAdminResponse }[];
}

const AdminsList = ({ data }: IAdminsList) => {
	const { isOpen, onClose, onOpen } = useDisclosure();
	return (
		<Flex
			direction={"column"}
			background={"white"}
			p="8"
			boxShadow={"base"}
			borderRadius={"xl"}
		>
			<AddAdminDialog isOpen={isOpen} onClose={onClose} />
			<Flex justifyContent={"space-between"} alignItems={"center"}>
				<Heading fontSize={"3xl"}>Admins</Heading>
				<Button onClick={onOpen} leftIcon={<HiPlus />}>
					Add Admin
				</Button>
			</Flex>
			<Flex mt="5" flexWrap={"wrap"} gap={"5"}>
				{data.map((_current, _index) => (
					<UserAdminCard user={_current.user} />
				))}
			</Flex>
		</Flex>
	);
};

interface IUserAdminCard {
	user: ICompanyAdminResponse;
}

const UserAdminCard = ({ user }: IUserAdminCard) => {
	return (
		<Flex
			w={"400px"}
			direction={"row"}
			boxShadow={"xs"}
			borderRadius={"lg"}
			alignItems={"center"}
			px="4"
		>
			<Avatar src={user.profile.profilePic || ""} />
			<Flex direction={"column"} p="4">
				<Heading fontSize={"lg"} mb="1">
					{user?.fname + " " + user?.lname}
				</Heading>
				<Text fontSize={"sm"} fontWeight={"bold"}>
					{user?.email}
				</Text>
			</Flex>
		</Flex>
	);
};

interface IDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

const AddAdminDialog = ({ isOpen, onClose }: IDialogProps) => {
	const user = useUser((state) => state.user);
	const toast = useToast();
	const { id } = useParams();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["addCompanyAdmin"],
		mutationFn: (email: string) =>
			companyAPI.addCompanyAdmin(user, id ? parseInt(id) : 0, email),
		onSuccess: () => {
			queryClient.invalidateQueries(["companyDetails"]);
			toast({
				status: "success",
				title: "Successfully Added",
			});
			onClose();
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast({
					status: "error",
					title: "Error",
					description: error.response?.data.message,
				});
			}
		},
	});
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay></ModalOverlay>
			<ModalContent>
				<ModalHeader>Add Admin</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Formik
						initialValues={{ email: "" }}
						onSubmit={async (values) =>
							await mutation.mutate(values.email)
						}
					>
						{(formik) => (
							<Flex as={Form} direction="column">
								<FormControl>
									<FormLabel>
										Enter Users Email Address
									</FormLabel>
									<Field
										as={Input}
										type="email"
										name="email"
										variant={"filled"}
									/>
								</FormControl>
								<ButtonGroup
									mt="10"
									mb="2"
									alignSelf={"flex-end"}
								>
									<Button
										type="submit"
										colorScheme="blue"
										isLoading={formik.isSubmitting}
									>
										Add
									</Button>
									<Button onClick={onClose}>Cancel</Button>
								</ButtonGroup>
							</Flex>
						)}
					</Formik>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

const EventsList = ({ events }: { events: EventResponse[] }) => {
	const { id } = useParams();
	return (
		<Flex
			direction={"column"}
			background={"white"}
			p="8"
			boxShadow={"base"}
			borderRadius={"xl"}
		>
			<Flex justifyContent={"space-between"} alignItems={"center"}>
				<Heading fontSize={"2xl"} fontWeight={"bold"}>
					Events
				</Heading>
				<Button
					as={Link}
					to={"/event/add?cid=" + id}
					leftIcon={<HiPlus />}
				>
					New Event
				</Button>
			</Flex>
			<Grid
				gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))"
				mt="5"
				gap={"10"}
			>
				{events.map((event) => (
					<EventCard event={event} />
				))}
			</Grid>
		</Flex>
	);
};

const CompanyProfileCard = ({ data }: { data: ICompanyDetailsResponse }) => {
	const deleteDialog = useDisclosure();
	const editDialog = useDisclosure();
	return (
		<Flex
			flex={1}
			direction={"column"}
			boxShadow={"base"}
			borderRadius={"xl"}
			background="white"
			position={"relative"}
		>
			<DeleteCompanyDialog
				onClose={deleteDialog.onClose}
				isOpen={deleteDialog.isOpen}
			/>
			<EditCompanyDialog {...editDialog} company={data} />
			<Box position={"relative"} mb="10">
				<Img
					borderTopRadius={"xl"}
					width={"full"}
					height={"40"}
					objectFit={"cover"}
					src={data.coverPic}
				></Img>
				<Avatar
					name={data.name}
					size={"2xl"}
					border={"4px solid white"}
					background={"gray.300"}
					position={"absolute"}
					bottom={"-12"}
					left={"30"}
					src={data.profPic || ""}
				/>
			</Box>
			<Flex direction={"column"} p="5">
				<Flex>
					<Flex direction={"column"} flex={"1"}>
						<Heading size={"lg"}>{data.name}</Heading>
						<Text fontSize={"sm"}>{}</Text>
					</Flex>
					<ButtonGroup>
						<IconButton
							aria-label="Edit Profile"
							variant={"ghost"}
							colorScheme={"blue"}
							icon={<Icon as={HiPencilSquare} boxSize={"5"} />}
							onClick={editDialog.onOpen}
						/>
						<IconButton
							aria-label="Delete Company"
							variant={"ghost"}
							colorScheme={"red"}
							icon={<Icon as={HiTrash} boxSize={"5"} />}
							onClick={deleteDialog.onOpen}
						/>
					</ButtonGroup>
				</Flex>
				<Text>{data.bio}</Text>
			</Flex>
		</Flex>
	);
};

const DeleteCompanyDialog = ({ onClose, isOpen }: IDialogProps) => {
	const { id } = useParams();
	const user = useUser((state) => state.user);
	const mutation = useMutation({
		mutationKey: ["deleteCompany", id],
		mutationFn: () => companyAPI.deleteCompany(user, id ? parseInt(id) : 0),
	});

	const toast = useToast();
	const navigate = useNavigate();

	const handleDelete = async () => {
		mutation.mutate(undefined, {
			onError: (error) => {
				if (error instanceof AxiosError) {
					toast({
						status: "error",
						title: "Error",
						description: error.response?.data.message,
					});
					onClose();
				}
			},
			onSuccess: () => {
				toast({
					status: "success",
					title: "Successfully Deleted",
				});
				onClose();
				navigate("/profile");
			},
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Are you sure to delete the company?</ModalHeader>
				<ModalBody>
					<Alert status="warning">
						<AlertIcon />
						<AlertDescription>
							All events posted by this company will be deleted
							also.
						</AlertDescription>
					</Alert>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							onClick={handleDelete}
							leftIcon={<HiTrash />}
							colorScheme="red"
							isLoading={mutation.isLoading}
						>
							Delete
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

function EventCard({ event }: { event: EventResponse }) {
	return (
		<Flex
			as={Link}
			to={`/events/${event.id}`}
			direction={"column"}
			boxShadow={"xs"}
			borderRadius={"lg"}
		>
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
					Created on {formatDateForUserEvent(event.createdAt)}
				</Text>
				<Text fontSize={"sm"}></Text>
			</Flex>
		</Flex>
	);
}
