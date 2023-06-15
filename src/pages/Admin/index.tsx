import {
	Button,
	Flex,
	Heading,
	Spinner,
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { HiHomeModern, HiTicket, HiUserGroup } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../state/userState";
import { adminAPI } from "$lib/api/admin";

export const AdminPage = () => {
	return (
		<Flex
			flex={"4"}
			direction={"column"}
			background={"white"}
			boxShadow={"md"}
			borderRadius={"md"}
			p="10"
			ml="10"
		>
			<Heading fontSize={"2xl"} mb="10">
				Stats
			</Heading>
			<StatsBar />
		</Flex>
	);
};

const StatsBar = () => {
	const user = useUser((state) => state.user);

	const statQuery = useQuery({
		queryKey: ["loadStats"],
		queryFn: () => adminAPI.loadStats(user),
	});

	if (statQuery.isLoading) {
		return (
			<Flex justifyContent={"center"} alignItems={"center"}>
				<Spinner />
			</Flex>
		);
	}

	return (
		<StatGroup>
			<Stat variant={"solid"}>
				<StatLabel>Total Users</StatLabel>
				<StatNumber>{statQuery.data?.users}</StatNumber>
			</Stat>
			<Stat variant={"solid"}>
				<StatLabel>Total Companies</StatLabel>
				<StatNumber>{statQuery.data?.companies}</StatNumber>
			</Stat>
			<Stat variant={"solid"}>
				<StatLabel>Total Events</StatLabel>
				<StatNumber>{statQuery.data?.events}</StatNumber>
			</Stat>
			<Stat variant={"solid"}>
				<StatLabel>Total Bookings</StatLabel>
				<StatNumber>{statQuery.data?.bookings}</StatNumber>
			</Stat>
			<Stat variant={"solid"} colorScheme="blue" size={"md"}>
				<StatLabel>Total Admins</StatLabel>
				<StatNumber>{statQuery.data?.admins}</StatNumber>
			</Stat>
		</StatGroup>
	);
};
