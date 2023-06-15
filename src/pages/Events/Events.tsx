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
	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	RangeSliderTrack,
	Select,
	Skeleton,
	Tag,
	Text,
	useRangeSlider,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { HiCalendar, HiCheckBadge, HiOutlineClock } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { useState } from "react";
import { useCategories } from "$lib/hooks/useCategories";
import { useFilter } from "../../state/filterState";

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
	const [priceRange, setPriceRange] = useState([100, 500]);
	const categories = useCategories();
	const filter = useFilter((state) => state.filter);
	const setFilter = useFilter((state) => state.setFilterItem);

	return (
		<Flex
			direction={"column"}
			flex={"1"}
			borderRadius={"lg"}
			background={"white"}
		>
			<Accordion allowToggle>
				<AccordionItem>
					<AccordionButton border={"none"}>
						<Heading size={"sm"} flex="1">
							Filters
						</Heading>
						<AccordionIcon />
					</AccordionButton>
					<AccordionPanel>
						<Flex direction={"column"}>
							<Flex gap={"5"} mb="3">
								<FormControl isDisabled={categories.isLoading}>
									<FormLabel>Event Type</FormLabel>
									<Select
										value={filter.categoryId}
										onChange={(event) =>
											setFilter(
												"categoryId",
												parseInt(event.target.value)
											)
										}
										size={"sm"}
									>
										{categories.data &&
											categories.data.map((_category) => (
												<option value={_category.id}>
													{_category.name}
												</option>
											))}
									</Select>
								</FormControl>
							</Flex>
							<Flex gap={"5"} mb="3">
								<FormControl>
									<FormLabel>From</FormLabel>
									<Input
										value={filter.eventStartDate}
										onChange={(event) =>
											setFilter(
												"eventStartDate",
												event.target.value
											)
										}
										type="date"
										size={"sm"}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>To</FormLabel>
									<Input
										value={filter.eventEndDate}
										onChange={(event) =>
											setFilter(
												"eventEndDate",
												event.target.value
											)
										}
										type="date"
										size={"sm"}
									/>
								</FormControl>
							</Flex>
							<Flex gap={"5"} mb="3">
								<FormControl>
									<FormLabel>Location</FormLabel>
									<Input
										value={filter.location}
										onChange={(event) =>
											setFilter(
												"location",
												event.target.value
											)
										}
										type="text"
										size={"sm"}
										variant={"filled"}
									/>
								</FormControl>
							</Flex>
							<Flex gap={"5"} mb="3">
								<FormControl>
									<FormLabel>Price</FormLabel>
									<RangeSlider
										min={100}
										max={1000}
										step={50}
										defaultValue={priceRange}
										value={priceRange}
										onChange={(val) => setPriceRange(val)}
									>
										<RangeSliderTrack>
											<RangeSliderFilledTrack />
										</RangeSliderTrack>
										<RangeSliderThumb index={0} />
										<RangeSliderThumb index={1} />
									</RangeSlider>
									<Flex
										justifyContent={"space-between"}
										gap={"5"}
									>
										<Input
											placeholder="min"
											type="number"
											size="sm"
											variant={"filled"}
											value={priceRange[0]}
											onChange={(event) =>
												setPriceRange((val) => [
													parseInt(
														event.target?.value
													),
													val[1],
												])
											}
										/>
										<Input
											placeholder="max"
											type="number"
											size="sm"
											variant={"filled"}
											value={priceRange[1]}
											onChange={(event) =>
												setPriceRange((val) => [
													val[0],
													parseInt(
														event.target?.value
													),
												])
											}
										/>
									</Flex>
								</FormControl>
							</Flex>
							<Button mt="10" colorScheme="blue" size={"sm"}>
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
				objectFit={"cover"}
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
						{event.economySeats && (
							<Tag variant={"subtle"} colorScheme="blue">
								Economy
							</Tag>
						)}
						{event.vipSeats && (
							<Tag variant={"outline"} colorScheme="blue">
								VIP
							</Tag>
						)}
					</HStack>
					<Text>
						Starting from <b>{event.economyPrice}ETB</b>
					</Text>
				</Flex>
			</Flex>
		</Flex>
	);
};
