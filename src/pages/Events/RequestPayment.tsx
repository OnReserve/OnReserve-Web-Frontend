import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	Flex,
	Heading,
	Icon,
	Img,
	Spinner,
	Stat,
	StatLabel,
	StatNumber,
	Text,
	useToast,
} from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { HiCheckBadge } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EventPaymentInfo, IEventUserResponse, eventAPI } from "$lib/api/event";
import { myConstants } from "$config/theme";
import { useUser } from "../../state/userState";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormikInput } from "$pages/Auth/components/FormikInput";

export const RequestPayment = () => {
	const { eventId } = useParams();

	let query = useQuery({
		queryKey: ["eventDetails", eventId],
		queryFn: () => eventAPI.getEventDetails(parseInt(eventId || "0")),
	});

	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				{query.data && (
					<>
						<Flex
							px={myConstants.pagePadding}
							minHeight={"100vh"}
							gap={"10"}
						>
							<EventInfo data={query.data} />

							<Flex flex="2" direction={"column"}>
								<Flex
									as={"section"}
									direction={"column"}
									mb="8"
								>
									<DataDashboard />
								</Flex>
							</Flex>
						</Flex>
					</>
				)}
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

function EventInfo({ data }: { data: IEventUserResponse }) {
	return (
		<Flex direction={"column"} flex="1">
			<Img
				borderRadius={"lg"}
				src={`${data.galleries[0].eventPhoto}`}
				width={"100%"}
			/>
			<Heading mt="6" mb="2" size={"md"}>
				{data.title}
			</Heading>
			<Text color="blue.500" fontWeight={"bold"} mb="6">
				{data?.company?.name}
				<Icon fontSize={"xl"}>
					<HiCheckBadge />
				</Icon>
			</Text>

			<Flex direction={"column"} my="4" gap={"4"}>
				<Stat>
					<StatLabel>Event Location</StatLabel>
					<StatNumber>
						{data?.locations && `${data?.locations[0]?.venue}`},{" "}
						{data?.locations && `${data?.locations[0]?.city}`}
					</StatNumber>
				</Stat>
				<Stat>
					<StatLabel>Event Date</StatLabel>
					<StatNumber>
						{formatDateForUserEvent(data.eventStartTime)}
					</StatNumber>
				</Stat>
				<Stat>
					<StatLabel>Event Time</StatLabel>
					<StatNumber>
						{dayjs(data.eventStartTime).format("hh:mm A")}
					</StatNumber>
				</Stat>
			</Flex>
		</Flex>
	);
}

function EventStat({ stat }: { stat: EventPaymentInfo }) {
	return (
		<Flex gap={"10"}>
			<Stat
				background={"green.500"}
				color={"white"}
				p="5"
				borderRadius={"md"}
				boxShadow={"lg"}
			>
				<StatLabel>Total Revenue</StatLabel>
				<StatNumber>{stat.totalRevenue} ETB</StatNumber>
			</Stat>
			<Stat p="5" borderRadius={"md"} boxShadow={"lg"}>
				<StatLabel>Economy Tickets</StatLabel>
				<StatNumber>{stat.economyCount}</StatNumber>
			</Stat>
			<Stat p="5" borderRadius={"md"} boxShadow={"lg"}>
				<StatLabel>Vip Tickets</StatLabel>
				<StatNumber>{stat.vipCount}</StatNumber>
			</Stat>
		</Flex>
	);
}

let initialValues = {
	cbeAccountNo: "",
	cbeFullName: "",
};

const DataDashboard = () => {
	const user = useUser((state) => state.user);
	const { eventId } = useParams();
	const toast = useToast();
	const navigate = useNavigate();

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: yup.object().shape({
			cbeAccountNo: yup
				.string()
				.required("Please enter your bank Account")
				.min(13, "Please Enter Valid CBE Account")
				.test(
					"check start with 100",
					"Enter Valid CBE Account",
					function () {
						let acc: string = this.parent["cbeAccountNo"];
						return acc.startsWith("1000");
					}
				),
			cbeFullName: yup.string().required("Enter your full name"),
		}),
		onSubmit(values) {
			requestPaymentMutation.mutate(values);
		},
	});

	const requestPaymentMutation = useMutation({
		mutationKey: ["requestPayment", eventId],
		mutationFn: (values: typeof initialValues) =>
			eventAPI.requestPayment(user, parseInt(eventId || "0"), values),
		onSuccess: () => {
			toast({
				title: "Payment Requested",
				description: "Admins will complete your request soon.",
				status: "success",
			});
			navigate(`/events/${eventId}`);
		},
		onError: (error) => {
			let msg;
			if (error instanceof AxiosError) {
				msg = error.response?.data.message;
			}
			toast({
				title: "Payment Requested Failed",
				description: msg || "Please Try again!",
				status: "error",
			});
			navigate(`/events/${eventId}`);
		},
	});

	const summary = useQuery({
		queryKey: ["paymentDetails"],
		queryFn: () =>
			eventAPI.getEventPaymentInfo(user, parseInt(eventId || "0")),
	});

	if (summary.isLoading) {
		return (
			<Flex
				justifyContent={"center"}
				alignItems={"center"}
				height={"200"}
			>
				<Spinner />
			</Flex>
		);
	}

	if (summary.data && summary.data.requested) {
		return (
			<>
				<EventStat stat={summary.data.stat} />
				<Alert
					mt="10"
					status={summary.data.data.paid ? "success" : "warning"}
				>
					<AlertIcon />
					<AlertTitle>{summary.data.message}</AlertTitle>
					<AlertDescription>
						{!summary.data.data.paid &&
							"Please wait patently until the admins approves your request"}
					</AlertDescription>
				</Alert>
			</>
		);
	}
	return (
		<>
			{summary.data && summary.data.requested === undefined && (
				<>
					<EventStat stat={summary.data} />
					<Alert mt="10" status="warning">
						<AlertIcon />
						<AlertDescription>
							-2% for the service, the total money you will
							receive will be{" "}
							<b>
								{summary.data.totalRevenue -
									0.2 * summary.data.totalRevenue}
							</b>{" "}
							Birr.
						</AlertDescription>
					</Alert>
					<Flex as="form" direction={"column"} mt="20">
						<Heading fontSize={"xl"} mb="5">
							Payment Information
						</Heading>
						<Flex gap={"10"}>
							<FormikInput
								formik={formik}
								name="cbeAccountNo"
								placeholder="CBE Account No"
							/>
							<FormikInput
								formik={formik}
								name="cbeFullName"
								placeholder="CBE Account Full Name"
							/>
						</Flex>
					</Flex>
					<Button
						my="20"
						background={"blue.900"}
						colorScheme="blue"
						isLoading={requestPaymentMutation.isLoading}
						onClick={(e: any) => formik.handleSubmit(e)}
					>
						Request Payment
					</Button>
				</>
			)}
		</>
	);
};
