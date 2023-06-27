import {
	Button,
	Flex,
	Heading,
	Icon,
	IconButton,
	Img,
	Select,
	Spinner,
	Stat,
	StatLabel,
	StatNumber,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { HiCheckBadge, HiPlus, HiTrash, HiXCircle } from "react-icons/hi2";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { useReservation } from "../../state/reservationState";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { useUser } from "../../state/userState";
import { myConstants } from "$config/theme";
import { AuthGuard } from "../../components/AuthGuard";

export const ReservationPage = () => {
	const { eventId } = useParams();
	const user = useUser((state) => state.user);
	const clear = useReservation((state) => state.clear);
	const [total, setTotal] = useState(0);
	const packages = useReservation((state) => state.packages);
	let query = useQuery({
		queryKey: ["eventDetails", eventId],
		queryFn: () => eventAPI.getEventDetails(parseInt(eventId || "0")),
	});

	const bookingMutation = useMutation({
		mutationKey: ["AddBooking"],
		mutationFn: (data: {
			eventId: number;
			economyCount: number;
			vipCount: number;
		}) => eventAPI.addBooking(user, data),
	});

	const prices = {
		NORMAL: query.data?.economyPrice || 0,
		VIP: query.data?.vipPrice || 0,
	};

	useMemo(() => {
		let sum = 0;
		packages.forEach((_type) => {
			sum += prices[_type];
		});
		setTotal(sum);
	}, [packages]);

	useEffect(() => {
		clear();
	}, [eventId]);

	const handlePayment = () => {
		bookingMutation.mutate(
			{
				eventId: parseInt(eventId || "0"),
				economyCount: packages.filter(
					(_package) => _package === "NORMAL"
				).length,
				vipCount: packages.filter((_package) => _package === "VIP")
					.length,
			},
			{
				onSuccess: (data) => {
					window.location.assign(
						`https://yenepay.com/checkout/Home/Process/?ItemName=Booking-Ticket-For-Event-${data.bookingToken}&ItemId=${data.bookingToken}&UnitPrice=${total}&Quantity=1&Process=Express&ExpiresAfter=&DeliveryFee=&HandlingFee=&Tax1=&Tax2=&Discount=&SuccessUrl=&IPNUrl=&MerchantId=25581`
					);
				},
			}
		);
	};

	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					px={myConstants.pagePadding}
					direction={["column-reverse", "column-reverse", "row"]}
					py="10"
					gap={"10"}
				>
					{query.isLoading ? (
						<Spinner />
					) : (
						query.data && (
							<>
								<Flex direction={"column"} flex="1">
									<Img
										borderRadius={"lg"}
										src={`${query.data?.galleries[0].eventPhoto}`}
										width={"100%"}
									/>
									<Heading mt="6" mb="2" size={"md"}>
										{query.data?.title}
									</Heading>
									<Text
										color="blue.500"
										fontWeight={"bold"}
										mb="6"
									>
										{query.data?.company?.name}
										<Icon fontSize={"xl"}>
											<HiCheckBadge />
										</Icon>
									</Text>

									<Flex direction={"column"} my="4" gap={"4"}>
										<Stat>
											<StatLabel>
												Event Location
											</StatLabel>
											<StatNumber>
												{query.data?.locations &&
													`${query.data?.locations[0]?.venue}`}
												,{" "}
												{query.data?.locations &&
													`${query.data?.locations[0]?.city}`}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Event Date</StatLabel>
											<StatNumber>
												{formatDateForUserEvent(
													query.data.eventStartTime
												)}
											</StatNumber>
										</Stat>
										<Stat>
											<StatLabel>Event Time</StatLabel>
											<StatNumber>
												{dayjs(
													query.data.eventStartTime
												).format("hh:mm A")}
											</StatNumber>
										</Stat>
									</Flex>
								</Flex>
								<Flex flex="2" direction={"column"}>
									<Flex
										as={"section"}
										direction={"column"}
										mb="8"
									>
										<Heading size={"lg"} mb="5">
											Your Packages
										</Heading>
										<PackagesList event={query.data} />
										<Button
											my="20"
											background={"blue.900"}
											colorScheme="blue"
											onClick={() => handlePayment()}
											isLoading={
												bookingMutation.isLoading
											}
										>
											Continue to Payment
										</Button>
									</Flex>
								</Flex>
							</>
						)
					)}
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const PackagesList = ({ event }: { event: IEventUserResponse }) => {
	const [total, setTotal] = useState(0);
	const packages = useReservation((state) => state.packages);
	const addPackage = useReservation((state) => state.addPackage);
	const changePackage = useReservation((state) => state.changePackage);
	const deletePackage = useReservation((state) => state.removePackage);
	const clear = useReservation((state) => state.clear);
	const prices = {
		NORMAL: event.economyPrice,
		VIP: event.vipPrice,
	};

	useMemo(() => {
		let sum = 0;
		packages.forEach((_type) => {
			sum += prices[_type];
		});
		setTotal(sum);
	}, [packages]);

	return (
		<Flex direction={"column"} flex="1">
			<Table mb="10">
				<Thead>
					<Tr>
						<Th>No</Th>
						<Th>Package Type</Th>
						<Th>Price</Th>
						<Th>Delete</Th>
					</Tr>
				</Thead>
				<Tbody>
					{packages.map((_package, _index) => {
						return (
							<Tr key={_index}>
								<Td>{_index + 1}</Td>
								<Td>
									<Select
										value={_package}
										onChange={(e) =>
											changePackage(
												_index,
												e.target.value as any
											)
										}
									>
										<option value="" disabled>
											Select Package type
										</option>
										{event.economySeats && (
											<option value={"NORMAL"}>
												Normal
											</option>
										)}
										{event.vipSeats && (
											<option value={"VIP"}>VIP</option>
										)}
									</Select>
								</Td>
								<Td>{prices[_package]}</Td>
								<Td>
									<IconButton
										icon={<HiTrash />}
										aria-label="delete"
										onClick={() => deletePackage(_index)}
									></IconButton>
								</Td>
							</Tr>
						);
					})}
					{packages.length > 0 && (
						<Tr>
							<Td>Total</Td>
							<Td></Td>
							<Td fontWeight={"bold"}>{total} ETB</Td>
							<Td>
								<Button
									onClick={() => clear()}
									aria-label="Clear"
									size={"sm"}
									leftIcon={<HiXCircle />}
								>
									Clear
								</Button>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
			<Button
				leftIcon={<HiPlus />}
				size={"sm"}
				onClick={() => addPackage("NORMAL")}
			>
				Add Package
			</Button>
		</Flex>
	);
};
