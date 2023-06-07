import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Button,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	Heading,
	Icon,
	Img,
	Input,
	Skeleton,
	Tag,
	Text,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { HiCalendar, HiCheckBadge, HiOutlineClock } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";

export const EventsPage = () => {
	return (
		<Flex direction={"column"} width={"100%"} minHeight={"100vh"}>
			<Navbar />
			<Flex
				px="20"
				py="10"
				background={"gray.100"}
				flex={"1"}
				gap={"10"}
				alignItems={"flex-start"}
				minH={"100vh"}
			>
				<FilterSection />
				<Flex direction="column" flex={"3"}>
					<ResultSection />
				</Flex>
			</Flex>
			<Footer />
		</Flex>
	);
};

const FilterSection = () => {
	return (
		<Flex direction={"column"} flex={"1"} borderRadius={"lg"}>
			<Accordion allowToggle>
				<AccordionItem>
					<AccordionButton>
						<Heading size={"sm"} flex="1">
							Filters
						</Heading>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<Flex direction={"column"}>
							<FormControl>
								<FormLabel>Date & Time</FormLabel>
								<Flex>
									<Input type="date" />
									<Input type="date" />
								</Flex>
							</FormControl>
							<Button colorScheme="blue" size={"sm"}>
								Apply Filter
							</Button>
						</Flex>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Flex direction={"column"}></Flex>
		</Flex>
	);
};

const ResultSection = () => {
	const upcomingEvents = useQuery({
		queryKey: ["upcomingEvents"],
		queryFn: () => eventAPI.getUpcomingEvents(),
	});

	if (upcomingEvents.isLoading) {
		return (
			<Flex direction={"column"} borderRadius={"lg"} gap={"3"}>
				{[...Array(6)].map((_v, _i) => (
					<EventLoading />
				))}
			</Flex>
		);
	}

	if (upcomingEvents.error) {
		return (
			<Alert flexDirection={"column"} status="error">
				<AlertIcon boxSize={"10"} mb="4" />
				<AlertTitle>Error Loading events</AlertTitle>
				<AlertDescription>
					Check your connection and Refresh the page
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Flex direction={"column"} borderRadius={"lg"} gap={"1"}>
			{upcomingEvents.data &&
				upcomingEvents.data.map((event) => (
					<EventCard event={event} key={event.id} />
				))}
		</Flex>
	);
};

const EventLoading = () => {
	return <Skeleton width={"100%"} h="200px" borderRadius={"md"}></Skeleton>;
};

const EventCard = ({ event }: { event: IEventUserResponse }) => {
	return (
		<Flex
			as={NavLink}
			to={`/events/${event.id}`}
			my="1"
			p="5"
			borderRadius={"md"}
			background={"white"}
			cursor={"pointer"}
			transition={"all 300ms ease-out"}
			boxShadow={"base"}
			_hover={{
				boxShadow: "md",
			}}
		>
			<Img
				mr={"5"}
				width={"40"}
				height={"40"}
				objectFit={"fill"}
				src={event.galleries[0].eventPhoto}
				borderRadius={"md"}
			></Img>
			<Flex
				flex={"1"}
				direction={"column"}
				justifyContent={"space-between"}
				p="2"
			>
				<Flex direction={"column"} gap={"2"}>
					<Heading fontSize={"xl"}>{event.title}</Heading>
					<HStack>
						<Text>{event.company?.name}</Text>
						<Text color="blue.500">
							<HiCheckBadge />
						</Text>
					</HStack>
					<Flex gap={"10"} mt="2">
						<Text
							color={"gray.700"}
							textTransform={"uppercase"}
							fontSize={"sm"}
						>
							<HiCalendar />{" "}
							{formatDateForUserEvent(event.eventStartTime)}
						</Text>
						<Text
							textTransform={"uppercase"}
							color={"gray.700"}
							fontSize={"sm"}
						>
							<HiOutlineClock />
							{dayjs(event.eventStartTime).format("hh:mm A")}
						</Text>
					</Flex>
				</Flex>
				<Flex justifyContent={"space-between"}>
					<HStack>
						<Tag variant={"subtle"} colorScheme="blue">
							Economy
						</Tag>
						<Tag variant={"outline"} colorScheme="blue">
							VIP
						</Tag>
					</HStack>
					<Text>
						Starting from <b>{event.economyPrice}ETB</b>
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
