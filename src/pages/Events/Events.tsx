import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Badge,
	Button,
	Divider,
	Flex,
	HStack,
	Heading,
	Icon,
	Img,
	Skeleton,
	Tag,
	Text,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import {
	HiCalendar,
	HiCheckBadge,
	HiClock,
	HiOutlineClock,
} from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { Footer } from "../../components/Footer";

export const EventsPage = () => {
	return (
		<Flex direction={"column"} width={"100%"} minHeight={"100vh"}>
			<Navbar />
			<Flex
				px="20"
				py="10"
				background={"gray.200"}
				flex={"1"}
				gap={"10"}
				alignItems={"flex-start"}
			>
				<FilterSection />
				<Flex direction="column" flex={"2"}>
					<ResultSection />
				</Flex>
			</Flex>
			<Footer />
		</Flex>
	);
};

const FilterSection = () => {
	return (
		<Flex
			direction={"column"}
			flex={"1"}
			background={"white"}
			borderRadius={"lg"}
		>
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
							<Button>Apply Filter</Button>
						</Flex>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
			<Flex direction={"column"}></Flex>
		</Flex>
	);
};

const ResultSection = () => {
	return (
		<Flex
			direction={"column"}
			background={"white"}
			borderRadius={"lg"}
			gap={"1"}
		>
			<EventCard />
			<Divider />
			<EventCard />
			<Divider />
			<EventCard />
			<Divider />
			<EventCard />
			<Divider />
			<EventCard />
			<Divider />
			<EventCard />
			<Divider />
			<EventLoading />
		</Flex>
	);
};

const EventLoading = () => {
	return <Skeleton width={"100%"} h="200px" borderRadius={"md"}></Skeleton>;
};

const EventCard = () => {
	return (
		<Flex
			as={NavLink}
			to="/events/123"
			m="4"
			p="5"
			borderRadius={"md"}
			cursor={"pointer"}
			transition={"all 300ms ease-out"}
			_hover={{
				background: "blackAlpha.100",
			}}
		>
			<Img
				mr={"5"}
				width={"40"}
				height={"40"}
				objectFit={"fill"}
				src={`https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80`}
				borderRadius={"md"}
			></Img>
			<Flex
				flex={"1"}
				direction={"column"}
				justifyContent={"space-between"}
				p="2"
			>
				<Flex direction={"column"} gap={"2"}>
					<Heading fontSize={"xl"}>
						Rophnan's My Generation Concert
					</Heading>
					<HStack>
						<Text>Addis Concert Organizers </Text>
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
							<HiCalendar /> Jan 20, 2023
						</Text>
						<Text
							textTransform={"uppercase"}
							color={"gray.700"}
							fontSize={"sm"}
						>
							<HiOutlineClock />
							03:00 AM
						</Text>
					</Flex>
				</Flex>
				<Flex justifyContent={"space-between"}>
					<HStack>
						<Tag variant={"subtle"} colorScheme="blue">
							Normal
						</Tag>
						<Tag variant={"outline"} colorScheme="blue">
							VIP
						</Tag>
						<Tag variant={"solid"} colorScheme="blue">
							VVIP
						</Tag>
					</HStack>
					<Text>
						Starting from <b>800ETB</b>
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
