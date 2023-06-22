import {
	Alert,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Flex,
	HStack,
	Heading,
	SimpleGrid,
	Skeleton,
	Spinner,
	Tag,
	Text,
} from "@chakra-ui/react";
import { AuthGuard } from "../../components/AuthGuard";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useUser } from "../../state/userState";
import { useQuery } from "@tanstack/react-query";
import { bookingAPI } from "$lib/api/booking";
import dayjs from "dayjs";
import { getFromNow } from "$config/dayjs.config";
import { NavLink } from "react-router-dom";

export const BookingPage = () => {
	return (
		<AuthGuard>
			<Flex direction={"column"}>
				<Navbar />
				<Flex
					direction={"column"}
					minH={"100vh"}
					background={"gray.100"}
					px={["5", "10", "20"]}
					py="5"
				>
					<Heading fontSize={"2xl"}>Your Bookings</Heading>
					<SimpleGrid columns={[1, 2, 3]} gap={"3"} mt="5">
						<ListOfBookings />
					</SimpleGrid>
				</Flex>
				<Footer />
			</Flex>
		</AuthGuard>
	);
};

const ListOfBookings = () => {
	const user = useUser((state) => state.user);
	const query = useQuery({
		queryKey: ["loadUserBookings"],
		queryFn: () => bookingAPI.getBookings(user),
	});

	if (query.isLoading) {
		return (
			<>
				{[...Array(6)].map((_v, _i) => (
					<Skeleton height={"140px"} borderRadius={"md"} />
				))}
			</>
		);
	}

	if (query.data?.length == 0) {
		return (
			<Alert status="info">
				<AlertIcon></AlertIcon>
				<AlertTitle>You don't have any tickets yet</AlertTitle>
			</Alert>
		);
	}

	return (
		<>
			{query.data &&
				query.data.map((_ticket, _index) => (
					<Flex
						as={NavLink}
						to={`/profile/booking/${_ticket.id}`}
						direction={"column"}
						p="5"
						background={"white"}
						borderRadius={"md"}
						boxShadow={"sm"}
						transition={"all 200ms ease-out"}
						_hover={{
							boxShadow: "md",
						}}
					>
						<Heading fontSize={"lg"} mb="1">
							{_ticket?.event?.title}
						</Heading>
						<Text fontSize={"sm"} color={"gray.500"}>
							{getFromNow(_ticket?.createdAt)}
							<Badge
								ml="4"
								colorScheme={
									_ticket.completed
										? "blue"
										: _ticket.approved
										? "green"
										: "gray"
								}
							>
								{_ticket.completed
									? "Completed"
									: _ticket.approved
									? "Approved"
									: "Waiting for Payment"}
							</Badge>
						</Text>
						<Flex mt="4" gap={"2"}>
							<Tag variant={"subtle"} colorScheme="blue">
								{_ticket.economyCount} Economy
							</Tag>
							<Tag variant={"subtle"}>{_ticket.vipCount} VIP</Tag>
							<Box flex={1}></Box>
							<Text
								justifySelf={"flex-end"}
								fontWeight={"bold"}
								color={"gray.800"}
							>
								{_ticket.economyCount *
									_ticket.event?.economyPrice +
									_ticket.vipCount * _ticket?.event?.vipPrice}
								ETB
							</Text>
						</Flex>
					</Flex>
				))}
		</>
	);
};
