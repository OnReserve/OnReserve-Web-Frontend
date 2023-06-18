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
import {
	HiCalendar,
	HiCheckBadge,
	HiMapPin,
	HiOutlineClock,
	HiOutlineMapPin,
} from "react-icons/hi2";
import { NavLink, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCategories } from "$lib/hooks/useCategories";
import { useFilter } from "../../state/filterState";

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
	const categories = useCategories();
	const filter = useFilter((state) => state.filter);
	const setFilter = useFilter((state) => state.setFilterItem);
	const setFinalFilter = useFilter((state) => state.setFinalFilter);
	const clear = useFilter((state) => state.clear);
	const queryClient = useQueryClient();

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
										value={filter.category}
										onChange={(event) =>
											setFilter(
												"category",
												parseInt(event.target.value)
											)
										}
										size={"sm"}
									>
										{categories.data &&
											categories.data.map((_category) => (
												<option
													key={_category.id}
													value={_category.id}
												>
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
										value={filter.from}
										onChange={(event) =>
											setFilter(
												"from",
												event.target.value
											)
										}
										type="date"
										size={"sm"}
									/>
								</FormControl>
								<FormControl>
									<FormLabel>Until</FormLabel>
									<Input
										value={filter.until}
										onChange={(event) =>
											setFilter(
												"until",
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
									<FormLabel>City</FormLabel>
									<Input
										value={filter.city}
										onChange={(event) =>
											setFilter(
												"city",
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
									<FormLabel>Venue</FormLabel>
									<Input
										value={filter.venue}
										onChange={(event) =>
											setFilter(
												"venue",
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
										defaultValue={[
											filter.minPrice || 0,
											filter.maxPrice || 500,
										]}
										value={[
											filter.minPrice || 0,
											filter.maxPrice || 500,
										]}
										onChange={(val) => {
											const [min, max] = val;
											setFilter("minPrice", min);
											setFilter("maxPrice", max);
										}}
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
											value={filter.minPrice}
											onChange={(event) =>
												setFilter(
													"minPrice",
													event.target.valueAsNumber
												)
											}
										/>
										<Input
											placeholder="max"
											type="number"
											size="sm"
											variant={"filled"}
											value={filter.maxPrice}
											onChange={(event) =>
												setFilter(
													"maxPrice",
													event.target.valueAsNumber
												)
											}
										/>
									</Flex>
								</FormControl>
							</Flex>
							<Button
								mt="10"
								colorScheme="blue"
								size={"sm"}
								onClick={() => setFinalFilter()}
							>
								Apply Filter
							</Button>
							<Button
								mt="3"
								variant={"ghost"}
								colorScheme="blue"
								size={"sm"}
								onClick={clear}
							>
								Clear
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
	const [params] = useSearchParams();
	const keyword = params.get("keyword") || undefined;
	const finalFilter = useFilter((state) => state.finalFilter);

	const events = useQuery({
		queryKey: ["events", keyword, finalFilter],
		queryFn: () =>
			eventAPI.getEvents({
				type:
					keyword || Object.keys(finalFilter).length > 0
						? "filter"
						: "upcoming",
				filter: { ...finalFilter, keyword },
			}),
	});

	if (events.isLoading) {
		return (
			<Flex direction={"column"} borderRadius={"lg"} gap={"3"}>
				{[...Array(6)].map((_v, _i) => (
					<EventLoading key={_i} />
				))}
			</Flex>
		);
	}

	if (events.error) {
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
		<Flex direction={"column"} borderRadius={"lg"} gap={"3"}>
			{keyword && (
				<Text fontSize={"md"} mb="5" fontWeight={"normal"}>
					Results for <b>{keyword}</b>
				</Text>
			)}
			{events.data &&
				events.data.map((event: IEventUserResponse) => (
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
			borderRadius={"lg"}
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
				width={"250px"}
				h={"200px"}
				objectFit={"cover"}
				src={event.galleries[0].eventPhoto}
				borderLeftRadius={"lg"}
			></Img>
			<Flex
				flex={"1"}
				direction={"column"}
				justifyContent={"space-between"}
				p="5"
			>
				<Flex direction={"column"} gap={"2"}>
					<Heading fontSize={"xl"}>{event.title}</Heading>
					<HStack color={"gray.600"} fontWeight={"bold"}>
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
						{event.locations && (
							<Text
								textTransform={"uppercase"}
								color={"gray.700"}
								fontSize={"sm"}
							>
								<HiOutlineMapPin />
								{event?.locations[0].venue}
							</Text>
						)}
					</Flex>
				</Flex>
				<Flex justifyContent={"space-between"} mt="3">
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
