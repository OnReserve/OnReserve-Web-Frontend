import {
	Container,
	Flex,
	Heading,
	Img,
	Text,
	Box,
	Icon,
	Table,
	Tbody,
	Tr,
	Td,
	Badge,
	Button,
} from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
import { bookingAPI } from "$lib/api/booking";
import { useUser } from "../../state/userState";
import dayjs from "dayjs";
import { formatDateForUserEvent } from "$config/dayjs.config";
import { HiArrowTopRightOnSquare, HiPrinter } from "react-icons/hi2";
import { Ref, forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export const BookingDetails = () => {
	const user = useUser((state) => state.user);
	const { id } = useParams();
	const query = useQuery({
		queryKey: ["loadBookingDetail", id],
		queryFn: () => bookingAPI.getBookingDetails(user, parseInt(id || "0")),
	});
	const printRef = useRef(null);

	const handlePrint = useReactToPrint({
		content: () => printRef.current,
	});

	return (
		<AuthGuard>
			<Flex direction={"column"} background={"gray.100"}>
				<Navbar />
				<Container minH={"100vh"} py="3">
					{query.data && (
						<>
							<Ticket data={query.data} ref={printRef} />
							<Button
								colorScheme="blue"
								mt="10"
								leftIcon={<HiPrinter />}
								onClick={handlePrint}
							>
								Print Ticket
							</Button>
						</>
					)}
				</Container>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const Ticket = forwardRef(({ data }: { data: any }, ref: Ref<any>) => {
	return (
		<Flex direction={"column"} ref={ref}>
			<Flex
				justifyContent={"center"}
				background={"white"}
				p="5"
				boxShadow={"md"}
				borderRadius={"md"}
				mb="4"
			>
				<Img src={data.qrcode} />
			</Flex>
			<Flex
				background={"white"}
				p="5"
				boxShadow={"sm"}
				borderRadius={"md"}
				direction={"column"}
			>
				<Flex direction={"column"} mb="4">
					<Text
						fontSize={"sm"}
						fontWeight={"bold"}
						color={"gray.500"}
					>
						Event Name
					</Text>
					<Heading
						fontSize={"lg"}
						as={NavLink}
						to={`/events/${data.event.id}`}
					>
						{data.event.title}{" "}
						<Icon as={HiArrowTopRightOnSquare}></Icon>
					</Heading>
				</Flex>
				<Flex direction={"column"} mb="4">
					<Text
						fontSize={"sm"}
						fontWeight={"bold"}
						color={"gray.500"}
					>
						Event Start Time
					</Text>
					<Heading fontSize={"md"}>
						<Box mb="1">
							{formatDateForUserEvent(data.event.eventStartTime)}
						</Box>
						<Box color={"gray.700"}>
							{dayjs(data.event.eventStartTime).format("HH:mm A")}
						</Box>
					</Heading>
				</Flex>
				<Flex direction={"column"} mb="4">
					<Text
						fontSize={"sm"}
						fontWeight={"bold"}
						color={"gray.500"}
					>
						Booked At
					</Text>
					<Heading fontSize={"md"}>
						<Box mb="1">
							{formatDateForUserEvent(data.createdAt)}
						</Box>
					</Heading>
				</Flex>
			</Flex>

			<Flex
				background={"white"}
				p="5"
				boxShadow={"sm"}
				borderRadius={"md"}
				direction={"column"}
				mt="5"
			>
				<Heading fontSize={"md"}>Details</Heading>
				<Table>
					<Tbody>
						<Tr>
							<Td>Economy Count</Td>
							<Td>{data.economyCount}</Td>
						</Tr>
						<Tr>
							<Td>Vip Count</Td>
							<Td>{data.vipCount}</Td>
						</Tr>
						<Tr>
							<Td>Total Price</Td>
							<Td>
								{data.economyCount * data.event.economyPrice +
									data.vipCount * data.event.vipPrice}
							</Td>
						</Tr>
						<Tr>
							<Td>Status</Td>
							<Td>
								<Badge>
									{data.Completed
										? "Used"
										: data.approved
										? "Approved"
										: "Wating for Payment"}
								</Badge>
							</Td>
						</Tr>
					</Tbody>
				</Table>
			</Flex>
		</Flex>
	);
});
