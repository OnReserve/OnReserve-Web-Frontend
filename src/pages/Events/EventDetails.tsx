import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Button,
	ButtonGroup,
	Flex,
	HStack,
	Heading,
	Icon,
	Img,
	Skeleton,
	SkeletonText,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	Textarea,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import {
	HiArrowDownOnSquare,
	HiArrowTopRightOnSquare,
	HiCheckBadge,
	HiOutlineStar,
	HiPencil,
	HiStar,
	HiTrash,
} from "react-icons/hi2";
import { Footer } from "../../components/Footer";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { useUser } from "../../state/userState";
import { useEffect, useRef, useState } from "react";
import { Gallery } from "$lib/api/event";
import { IReviewRequest, reviewAPI } from "$lib/api/review";
import { myConstants } from "$config/theme";

export const EventsDetailsPage = () => {
	const { eventId } = useParams();
	const user = useUser((state) => state.user);
	const query = useQuery({
		queryKey: ["eventDetails", eventId],
		queryFn: () => eventAPI.getEventDetails(parseInt(eventId || "0")),
	});
	const deleteDialog = useDisclosure();

	return (
		<Flex direction="column">
			<Navbar />
			<Flex
				px={myConstants.pagePadding}
				py="10"
				w="100%"
				gap={"10"}
				minH={"100vh"}
				direction={"column"}
			>
				{query.isLoading && (
					<>
						<Flex direction={"column"} flex="1">
							<Skeleton height={"300px"} borderRadius={"lg"} />
						</Flex>
						<Flex flex="2" direction={"column"}>
							<Skeleton height={"10"} mb="3" />
							<Flex justifyContent={"space-between"}>
								<SkeletonText noOfLines={1} w={"100px"} />
								<Flex
									direction={"column"}
									alignItems={"flex-end"}
									color="blue.900"
									fontWeight={"bold"}
									mb="2"
								>
									<SkeletonText
										noOfLines={1}
										w={"100px"}
										mb="2"
									/>
									<SkeletonText noOfLines={1} w={"100px"} />
								</Flex>
							</Flex>
							<SkeletonText noOfLines={5} my="4" />
							<Flex as={"section"} direction={"column"} my="8">
								<Skeleton height={"6"} w="200px" mb="3" />
								<HStack wrap={"wrap"} gap={"4"}>
									<Skeleton
										height={"32"}
										borderRadius={"lg"}
										width={"200px"}
									/>
									<Skeleton
										height={"32"}
										borderRadius={"lg"}
										width={"200px"}
									/>
									<Skeleton
										height={"32"}
										borderRadius={"lg"}
										width={"200px"}
									/>
								</HStack>
							</Flex>
							<Flex mt="10" direction={"column"}>
								<Skeleton height={"6"} w="200px" mb="3" />
								<Skeleton height={"32"} borderRadius={"lg"} />
							</Flex>
						</Flex>
					</>
				)}
				{query.data && (
					<>
						{query.data.galleries &&
							query.data.galleries.length > 0 && (
								<ImageGallery gallery={query.data.galleries} />
							)}
						<Flex direction={["column", "column", "row"]}>
							<Flex flex="2" direction={"column"}>
								<Flex>
									<Heading mb="4" flex={1}>
										{query.data.title}
									</Heading>
									{user?.id == query.data.userId && (
										<ButtonGroup>
											<Button
												leftIcon={
													<Icon as={HiPencil}></Icon>
												}
												variant={"solid"}
												colorScheme="blue"
												as={Link}
												to={`/event/edit/${query.data.id}`}
											>
												<Text
													display={[
														"none",
														"none",
														"inline-block",
													]}
												>
													Edit
												</Text>
											</Button>
											<Button
												leftIcon={<Icon as={HiTrash} />}
												colorScheme="red"
												variant={"ghost"}
												onClick={deleteDialog.onOpen}
											>
												<Text
													display={[
														"none",
														"none",
														"inline-block",
													]}
												>
													Delete
												</Text>
											</Button>
											<DeleteDialog
												eventId={eventId || "0"}
												isOpen={deleteDialog.isOpen}
												onClose={deleteDialog.onClose}
											/>
										</ButtonGroup>
									)}
								</Flex>
								<Flex justifyContent={"space-between"}>
									<Text color="blue.500" fontWeight={"bold"}>
										{query.data.company?.name}{" "}
										<Icon fontSize={"xl"}>
											<HiCheckBadge />
										</Icon>
									</Text>
									<Flex
										direction={"column"}
										alignItems={"flex-end"}
										color="blue.900"
										fontWeight={"bold"}
									>
										<Text>
											{formatDateForUserEvent(
												query.data.eventStartTime
											)}
										</Text>
										<Text>
											{dayjs(
												query.data.eventStartTime
											).format("hh:mm A")}
										</Text>
									</Flex>
								</Flex>
								<Text my="4">{query.data.desc}</Text>
								<Flex
									as={"section"}
									direction={"column"}
									my="8"
								>
									<Heading size={"lg"} mb="5">
										Packages
									</Heading>
									<HStack wrap={"wrap"} gap={"4"}>
										<Stat
											border={"1px"}
											borderColor={"gray.200"}
											borderRadius={"lg"}
											p="3"
										>
											<StatLabel>Economy</StatLabel>
											<StatNumber>
												{query.data.economyPrice} ETB
											</StatNumber>
											<StatHelpText>
												{query.data.economySeats} Seats
												Available
											</StatHelpText>
										</Stat>
										{query.data.vipSeats && (
											<Stat
												border={"1px"}
												borderColor={"gray.200"}
												borderRadius={"lg"}
												p="3"
											>
												<StatLabel>VIP</StatLabel>
												<StatNumber>
													{query.data.vipPrice} ETB
												</StatNumber>
												<StatHelpText>
													{query.data.vipSeats} Seats
													Available
												</StatHelpText>
											</Stat>
										)}
									</HStack>
								</Flex>
								<Flex mt="10" direction={"column"}>
									<Heading size={"lg"} mb="3">
										Location
									</Heading>
									{query.data.locations &&
										query.data.locations[0] && (
											<Flex
												wrap={"wrap"}
												direction={"column"}
												gap={"3"}
											>
												<Stat
													border={"1px"}
													borderColor={"gray.200"}
													p="3"
												>
													<StatLabel>City</StatLabel>
													<StatNumber>
														{
															query.data
																.locations[0]
																.city
														}
													</StatNumber>
												</Stat>
												<Stat
													border={"1px"}
													borderColor={"gray.200"}
													p="3"
												>
													<StatLabel>
														Street
													</StatLabel>
													<StatNumber>
														{
															query.data
																.locations[0]
																.street
														}
													</StatNumber>
												</Stat>
												<Stat
													border={"1px"}
													borderColor={"gray.200"}
													p="3"
												>
													<StatLabel>Venue</StatLabel>
													<StatNumber>
														{
															query.data
																.locations[0]
																.venue
														}
													</StatNumber>
												</Stat>
											</Flex>
										)}
								</Flex>
								<Button
									as={NavLink}
									to={
										dayjs(
											query.data.eventDeadline
										).isBefore()
											? "#"
											: `/reserve/${query.data.id}`
									}
									my="20"
									background={"blue.900"}
									colorScheme="blue"
									size={"lg"}
								>
									{dayjs(query.data.eventDeadline).isBefore()
										? "Event Deadline passed"
										: "Reserve"}
								</Button>
							</Flex>
							<EventReviews />
						</Flex>
					</>
				)}
			</Flex>
			<Footer />
		</Flex>
	);
};

const ImageGallery = ({ gallery }: { gallery: Gallery[] }) => {
	const [selected, setSelected] = useState("");
	return (
		<Flex direction={"column"} flex="1">
			<Img
				borderRadius={"lg"}
				src={selected ? selected : gallery[0].eventPhoto}
				width={"100%"}
				maxHeight={"300px"}
				objectFit={"cover"}
			/>
			<Flex
				gap={"5"}
				my="5"
				direction={"row"}
				wrap={"wrap"}
				overflow={"auto"}
				width={"100%"}
			>
				{gallery.map((_img) => (
					<Img
						key={_img.id}
						onClick={() => setSelected(_img.eventPhoto)}
						borderRadius={"md"}
						src={_img.eventPhoto}
						height={["70px", "100px"]}
						objectFit={"cover"}
					/>
				))}
			</Flex>
		</Flex>
	);
};

interface DialogProps {
	eventId: string;
	isOpen: boolean;
	onClose: () => void;
}
const DeleteDialog = ({ eventId, isOpen, onClose }: DialogProps) => {
	const btnProp = useRef(null);
	const user = useUser((state) => state.user);
	const navigate = useNavigate();
	const mutation = useMutation({
		mutationKey: ["deleteEvent", eventId],
		mutationFn: () => eventAPI.deleteEvent(user, parseInt(eventId)),
		onSuccess: () => {
			navigate(-1);
		},
	});
	return (
		<AlertDialog
			leastDestructiveRef={btnProp}
			onClose={onClose}
			isOpen={isOpen}
		>
			<AlertDialogOverlay />
			<AlertDialogContent>
				<AlertDialogHeader>Delete Event</AlertDialogHeader>
				<AlertDialogBody>
					Are you sure delete this event?
				</AlertDialogBody>
				<AlertDialogFooter>
					<ButtonGroup>
						<Button
							colorScheme="red"
							ref={btnProp}
							isLoading={mutation.isLoading}
							onClick={() => mutation.mutate()}
						>
							Delete
						</Button>
						<Button onClick={onClose}>Close</Button>
					</ButtonGroup>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const EventReviews = () => {
	return (
		<Flex direction={"column"} ml={[0, 0, "10"]} flex="1">
			<Heading fontSize={"2xl"} mb="5">
				Reviews
			</Heading>
			<Flex mb="10" direction={"column"}>
				<AddReview />
			</Flex>
			<ReviewsList />
		</Flex>
	);
};

const AddReview = () => {
	const [rating, setRating] = useState(0);
	const [finalRating, setFinalRating] = useState(0);
	const [comment, setComment] = useState("");
	const { eventId } = useParams();
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ["addReview"],
		mutationFn: (data: IReviewRequest) =>
			reviewAPI.addReview(user, parseInt(eventId || "0"), data),
		onSuccess: () => {
			toast({
				status: "success",
				title: "Review Added",
				description: "Thank you for you contribution",
				position: "bottom-right",
			});
			queryClient.invalidateQueries(["loadReviews"]);
			setComment("");
		},
		onError: (error) => {
			toast({
				status: "error",
				title: "We have failed to post your Review",
				description: "Please, try again",
				position: "bottom-right",
			});
		},
	});
	return (
		<Flex
			direction={"column"}
			alignItems={"center"}
			border={"1px solid #eee"}
			borderRadius={"md"}
			padding={"5"}
		>
			<Text mb="3" color={"gray.800"} fontWeight={"bold"}>
				Rate this event
			</Text>

			<HStack onMouseLeave={() => setRating(finalRating)}>
				{[...Array(5)].map((_v, _i) => (
					<Icon
						onClick={() => setFinalRating(_i + 1)}
						onMouseOver={() => setRating(_i + 1)}
						as={
							rating >= _i + 1 || finalRating >= _i + 1
								? HiStar
								: HiOutlineStar
						}
						color={
							finalRating >= _i + 1 ? "orange.400" : "gray.400"
						}
						boxSize={"8"}
					/>
				))}
			</HStack>

			<Textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				mt="7"
				size={"sm"}
				placeholder="Give your Review"
				rows={5}
			></Textarea>

			<Button
				colorScheme="blue"
				mt="10"
				alignSelf={"stretch"}
				size="sm"
				isLoading={mutation.isLoading}
				onClick={() =>
					mutation.mutate({ comment, rating: finalRating })
				}
			>
				Post a Review
			</Button>
		</Flex>
	);
};

const ReviewsList = () => {
	const { eventId } = useParams();
	const reviewQuery = useQuery({
		queryKey: ["loadReviews"],
		queryFn: () => reviewAPI.getReviews(parseInt(eventId || "0")),
	});

	if (reviewQuery.isLoading) {
		return (
			<Flex direction={"column"} gap="2">
				{[...Array(4)].map((_v, _i) => (
					<Skeleton key={_i} height={"100"} borderRadius={"md"} />
				))}
			</Flex>
		);
	}

	return (
		<Flex direction={"column"}>
			{reviewQuery.data &&
				reviewQuery.data.reviews.map((review) => (
					<Flex
						key={review.id}
						direction={"column"}
						p="4"
						border={"1px solid #eee"}
						mb="4"
					>
						<Flex alignItems={"center"}>
							<Avatar
								mr="4"
								name={`${review.user.fname} ${review.user.lname}`}
								src={review.user.profile.profilePic}
							/>
							<Flex direction={"column"}>
								<Heading
									fontSize={"md"}
									mb={"1"}
								>{`${review.user.fname} ${review.user.lname}`}</Heading>
								<Flex>
									{[...Array(5)].map((_v, _i) => (
										<Icon
											as={
												review.stars >= _i + 1
													? HiStar
													: HiOutlineStar
											}
											color={"orange.400"}
										/>
									))}
								</Flex>
							</Flex>
						</Flex>
						<Flex mt="3">
							<Text>{review.comment}</Text>
						</Flex>
					</Flex>
				))}
		</Flex>
	);
};
