import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormErrorIcon,
	FormErrorMessage,
	FormLabel,
	Heading,
	Icon,
	Img,
	Input,
	InputGroup,
	InputRightElement,
	Select,
	Spinner,
	Table,
	Tag,
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
import { Field, Form, Formik, FormikProps } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "../../state/userState";
import { companyAPI } from "$lib/api/company";
import {
	HiCalendarDays,
	HiExclamationTriangle,
	HiPlus,
	HiXMark,
} from "react-icons/hi2";
import { FormikInput } from "$pages/Auth/components/FormikInput";
import { eventAPI } from "$lib/api/event";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { categoryAPI } from "$lib/api/categories";
import { useCategories } from "$lib/hooks/useCategories";
import { myConstants } from "$config/theme";

interface IAddEventPage {
	isEdit?: boolean;
}

export const AddEventPage = ({ isEdit }: IAddEventPage) => {
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
					<AddEventForm isEdit={isEdit} />
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const initialValues = {
	companyId: "-1",
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
	categories: [] as number[],
};

export type IAddEventForm = typeof initialValues;

export const validationSchema = yup.object().shape({
	companyId: yup
		.number()
		.required("Please Select Company")
		.min(0, "Please Select Company"),
	title: yup.string().required("Please Enter Event's Title"),
	desc: yup.string().required("Please Enter a description for your event"),
	eventStartTime: yup.date().required("Please Enter Start Time"),
	eventEndTime: yup.date().required("Please enter End Time"),
	eventDeadline: yup.date().required("Enter a deadline for ticket selling"),
	economySeats: yup.number().required("Enter no. of seats"),
	economyPrice: yup.number(),
	vipSeats: yup.number().required("Enter no. of seats"),
	vipPrice: yup.number(),
	city: yup.string().required("Enter the city of an event"),
	street: yup.string(),
	venue: yup.string(),
	latitude: yup.number(),
	longitude: yup.number(),
	images: yup.array(),
});

const CompanySelect = () => {
	const user = useUser((state) => state.user);
	const companies = useQuery({
		queryKey: ["userCompany", user?.id],
		queryFn: () => companyAPI.getUserCompanies(user),
	});

	return (
		<FormControl
			mb="5"
			isDisabled={companies.isLoading || companies.isError}
			isInvalid={companies.isError}
		>
			<FormLabel>Company</FormLabel>
			<InputGroup>
				<Field variant={"filled"} name="companyId" as={Select}>
					<option value={-1} disabled>
						Select Company
					</option>
					{companies.data &&
						companies.data.map(({ company }) => (
							<option value={company.id} key={company.id}>
								{company.name}
							</option>
						))}
				</Field>
				<InputRightElement>
					{companies.isLoading && <Spinner />}
					{companies.isError && <Icon as={HiExclamationTriangle} />}
				</InputRightElement>
			</InputGroup>
			{companies.isError && (
				<FormErrorMessage>
					<FormErrorIcon />
					Error Loading Companies, check your connection and refresh
					the page
				</FormErrorMessage>
			)}
		</FormControl>
	);
};

const AddEventForm = ({ isEdit }: { isEdit?: boolean }) => {
	const user = useUser((state) => state.user);
	const navigate = useNavigate();
	const toast = useToast();
	const mutation = useMutation({
		mutationKey: ["addEvent"],
		mutationFn: async (values: IAddEventForm) =>
			eventAPI.addEvent(user, values),
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
				title: "Event Added",
			});
			navigate(`/company/${variables.companyId}`);
		},
	});

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={(values) => {
				console.log(values);
				mutation.mutate(values);
			}}
		>
			{(formik) => (
				<Flex
					as={Form}
					p={["4", "10"]}
					borderRadius={"lg"}
					background={"white"}
					boxShadow={"base"}
					direction={"column"}
				>
					<BasicInformation formik={formik} />
					<DateInformation formik={formik} />
					<LocationInformation formik={formik} />
					<SeatInformation />
					<ImageUpload formik={formik} />
					<ButtonGroup mt="20" alignSelf={"flex-end"}>
						<Button
							colorScheme="blue"
							leftIcon={<Icon as={HiCalendarDays} />}
							type="submit"
							isLoading={formik.isSubmitting}
							loadingText="Creating"
						>
							Create an Event
						</Button>
						<Button>Cancel</Button>
					</ButtonGroup>
				</Flex>
			)}
		</Formik>
	);
};

function BasicInformation({ formik }: { formik: FormikProps<any> }) {
	return (
		<Flex direction={"column"}>
			<CompanySelect />
			<Flex mb="5">
				<FormikInput
					formik={formik}
					name="title"
					placeholder="Event Title"
				/>
			</Flex>
			<FormControl mb="5">
				<FormLabel>Event Description</FormLabel>
				<Field as={Textarea} rows="5" name="desc" variant="filled" />
			</FormControl>
			<CategoryInput formik={formik} />
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

function SeatInformation() {
	return (
		<Flex mt="5" direction={"column"} overflowX={"auto"}>
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
							<Field
								as={Input}
								type="number"
								name="economySeats"
								placeholder="Economy Seats"
							/>
						</Td>
						<Td>
							<Field
								as={Input}
								type="number"
								name="economyPrice"
								placeholder="Economy Price"
							/>
						</Td>
					</Tr>
					<Tr>
						<Td>VIP</Td>
						<Td>
							<Field
								as={Input}
								type="number"
								name="vipSeats"
								placeholder="VIP Seats"
							/>
						</Td>
						<Td>
							<Field
								as={Input}
								type="number"
								name="vipPrice"
								placeholder="VIP Price"
							/>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Flex>
	);
}

function ImageUpload({ formik }: { formik: FormikProps<IAddEventForm> }) {
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

const CategoryInput = ({ formik }: { formik: FormikProps<IAddEventForm> }) => {
	const user = useUser((state) => state.user);
	const category = useCategories();
	return (
		<Flex my="10">
			<FormControl isDisabled={category.isLoading}>
				<FormLabel mb="3">Event Category</FormLabel>
				<Flex flexWrap={"wrap"} gap={"3"}>
					{category.data &&
						category.data.map((_category, _index) => (
							<Button
								leftIcon={
									formik.values.categories.includes(
										_category.id
									) ? undefined : (
										<HiPlus />
									)
								}
								rightIcon={
									formik.values.categories.includes(
										_category.id
									) ? (
										<HiXMark />
									) : undefined
								}
								textTransform={"capitalize"}
								cursor={"pointer"}
								variant={
									formik.values.categories.includes(
										_category.id
									)
										? "solid"
										: "outline"
								}
								colorScheme="blue"
								borderRadius={"20px"}
								key={_index}
								fontWeight={"bold"}
								onClick={() => {
									if (
										formik.values.categories.includes(
											_category.id
										)
									) {
										const newArray =
											formik.values.categories.filter(
												(c) => c != _category.id
											);
										formik.setFieldValue(
											"categories",
											newArray
										);
									} else {
										const newArray =
											formik.values.categories;
										formik.setFieldValue("categories", [
											...newArray,
											_category.id,
										]);
									}
								}}
							>
								{_category.name}
							</Button>
						))}
				</Flex>
			</FormControl>
		</Flex>
	);
};
