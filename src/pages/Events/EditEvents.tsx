import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Img,
	Input,
	Modal,
	Table,
	Tbody,
	Td,
	Textarea,
	Th,
	Thead,
	Tr,
	useToast,
} from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { Field, Form, Formik, FormikProps, useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "../../state/userState";
import { HiCalendarDays } from "react-icons/hi2";
import { FormikInput } from "$pages/Auth/components/FormikInput";
import { eventAPI } from "$lib/api/event";
import { AxiosError } from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import { myConstants } from "$config/theme";

export const EditEventPage = () => {
	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					minHeight={"100vh"}
					px={myConstants.pagePadding}
					py="5"
					background={"gray.100"}
					direction={"column"}
				>
					<AddEventForm />
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const initialValues = {
	title: "",
	desc: "",
	eventStartTime: "",
	eventEndTime: "",
	eventDeadline: "",
	economySeats: 0,
	economyPrice: 0,
	vipSeats: 0,
	vipPrice: 0,
	city: "",
	street: "",
	venue: "",
	latitude: 0.0,
	longitude: 0.0,
	images: [],
};

export type IEditEventForm = typeof initialValues;

export const validationSchema = yup.object().shape({
	title: yup.string(),
	desc: yup.string(),
	eventStartTime: yup.date(),
	eventEndTime: yup.date(),
	eventDeadline: yup.date(),
	economySeats: yup.number(),
	economyPrice: yup.number(),
	vipSeats: yup.number(),
	vipPrice: yup.number(),
	city: yup.string(),
	street: yup.string(),
	venue: yup.string(),
	latitude: yup.number(),
	longitude: yup.number(),
	images: yup.array(),
});

const AddEventForm = () => {
	const { eventId } = useParams();
	const user = useUser((state) => state.user);
	const navigate = useNavigate();
	const toast = useToast();

	const mutation = useMutation({
		mutationKey: ["editEvent", eventId],
		mutationFn: async (values: IEditEventForm) =>
			eventAPI.editEvent(user, eventId || "", values),
		onError: (error) => {
			if (error instanceof AxiosError) {
				toast({
					status: "error",
					title: "Error",
					description: error.response?.data.message,
				});
			}
		},
		onSuccess(data, variables, context) {
			toast({
				status: "success",
				title: "Event edited",
			});
			navigate(`/events/${eventId}`);
		},
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit(values) {
			mutation.mutate(values);
		},
	});

	const query = useQuery({
		queryKey: ["eventDetails", eventId],
		queryFn: () => eventAPI.getEventDetails(parseInt(eventId || "")),
		onSuccess(data) {
			let {
				company,
				galleries,
				locations,
				eventStartTime,
				eventEndTime,
				eventDeadline,
				...others
			} = data;

			formik.setFieldValue("eventStartTime", new Date(eventStartTime));

			let key: keyof typeof others;
			for (key in others) {
				if (Object.hasOwn(initialValues, key)) {
					formik.setFieldValue(key, others[key]);
				}
			}

			if (locations) {
				let location = locations[0];
				let key: keyof typeof location;
				for (key in location) {
					if (Object.hasOwn(initialValues, key)) {
						formik.setFieldValue(key, location[key]);
					}
				}
			}
		},
	});

	return (
		<Flex
			p={["4", "6", "10"]}
			borderRadius={"lg"}
			background={"white"}
			boxShadow={"base"}
			direction={"column"}
		>
			<BasicInformation formik={formik} />
			<DateInformation formik={formik} />
			<LocationInformation formik={formik} />
			<SeatInformation formik={formik} />
			{/* <ImageUpload formik={formik} /> */}
			<ButtonGroup mt="20" alignSelf={"flex-end"}>
				<Button
					colorScheme="blue"
					leftIcon={<Icon as={HiCalendarDays} />}
					type="submit"
					isLoading={formik.isSubmitting}
					onClick={(e: any) => formik.handleSubmit(e)}
					loadingText="Editing"
				>
					Edit an Event
				</Button>
				<Button as={Link} to={`/events/${eventId}`}>
					Cancel
				</Button>
			</ButtonGroup>
		</Flex>
	);
};

function BasicInformation({ formik }: { formik: FormikProps<any> }) {
	return (
		<Flex direction={"column"}>
			<Flex mb="5">
				<FormikInput
					formik={formik}
					name="title"
					placeholder="Event Title"
				/>
			</Flex>
			<FormControl mb="5">
				<FormLabel>Event Description</FormLabel>
				<Textarea
					value={formik.values.desc}
					rows={5}
					name="desc"
					variant="filled"
					onChange={formik.handleChange}
				/>
			</FormControl>
		</Flex>
	);
}

function DateInformation({ formik }: { formik: FormikProps<any> }) {
	return (
		<Flex direction={"column"}>
			<Heading fontSize={"xl"} mt="10" mb="5">
				Date & Time Information
			</Heading>
			<Flex gap="5" mb="5" direction={["column", "column", "row"]}>
				<FormikInput
					formik={formik}
					type="datetime-local"
					name="eventStartTime"
					placeholder="Event Start Time"
				/>
				<FormikInput
					formik={formik}
					type="datetime-local"
					name="eventEndTime"
					placeholder="Event End Time"
				/>
				<FormikInput
					formik={formik}
					type="datetime-local"
					name="eventDeadline"
					placeholder="Ticket Deadline Time"
				/>
			</Flex>
		</Flex>
	);
}

function LocationInformation({ formik }: { formik: FormikProps<any> }) {
	return (
		<Flex direction={"column"}>
			<Heading fontSize={"xl"} mt="10" mb="5">
				Location Information
			</Heading>
			<Flex gap={"5"} mb="5" direction={["column", "column", "row"]}>
				<FormikInput
					formik={formik}
					type="text"
					name="city"
					placeholder="City"
				/>
				<FormikInput
					formik={formik}
					type="text"
					name="street"
					placeholder="Street"
				/>
				<FormikInput
					formik={formik}
					type="text"
					name="venue"
					placeholder="Venue"
				/>
			</Flex>
			<Flex gap="5" mb="5">
				<FormikInput
					formik={formik}
					type="number"
					name="latitude"
					placeholder="Latitude"
				/>

				<FormikInput
					formik={formik}
					type="number"
					name="longitude"
					placeholder="Longitude"
				/>
			</Flex>
		</Flex>
	);
}

function SeatInformation({ formik }: { formik: FormikProps<IEditEventForm> }) {
	return (
		<Flex mt="5" direction={"column"}>
			<Heading fontSize={"xl"} mb="5">
				Seat information
			</Heading>
			<Table>
				<Thead>
					<Tr>
						<Th>Seat Type</Th>
						<Th>Seat No</Th>
						<Th>Seat Price</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td>Economy</Td>
						<Td>
							<Input
								name="economySeats"
								placeholder="Economy Seats"
								value={formik.values.economySeats}
								onChange={formik.handleChange}
							/>
						</Td>
						<Td>
							<Input
								name="economyPrice"
								placeholder="Economy Price"
								value={formik.values.economyPrice}
								onChange={formik.handleChange}
							/>
						</Td>
					</Tr>
					<Tr>
						<Td>VIP</Td>
						<Td>
							<Input
								name="vipSeats"
								placeholder="VIP Seats"
								value={formik.values.vipSeats}
								onChange={formik.handleChange}
							/>
						</Td>
						<Td>
							<Input
								name="vipPrice"
								placeholder="VIP Price"
								value={formik.values.vipPrice}
								onChange={formik.handleChange}
							/>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Flex>
	);
}

function ImageUpload({ formik }: { formik: FormikProps<IEditEventForm> }) {
	return (
		<Flex direction={"column"} mt="10">
			<FormControl>
				<FormLabel>Event Photos</FormLabel>
				<Input
					name="images"
					type="file"
					onChange={(event) => {
						if (event.target.files) {
							const files = Array.from(event.target.files);
							formik.setFieldValue("images", files);
						}
					}}
					multiple
				/>
			</FormControl>
			<Flex wrap={"wrap"} gap="5" mt="5">
				{formik.values.images.map((_img) => (
					<Img height={"200px"} src={URL.createObjectURL(_img)} />
				))}
			</Flex>
		</Flex>
	);
}
