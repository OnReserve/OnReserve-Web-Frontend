import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
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
	useDisclosure,
} from "@chakra-ui/react";
import { Navbar } from "../../components/Navbar";
import { HiCheckBadge, HiPencil, HiTrash } from "react-icons/hi2";
import { Footer } from "../../components/Footer";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IEventUserResponse, eventAPI } from "$lib/api/event";
import { formatDateForUserEvent } from "$config/dayjs.config";
import dayjs from "dayjs";
import { useUser } from "../../state/userState";
import { useRef, useState } from "react";
import { Gallery } from "$lib/api/event";

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
				px="20"
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
						<Flex>
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
												Edit
											</Button>
											<Button
												leftIcon={<Icon as={HiTrash} />}
												colorScheme="red"
												variant={"ghost"}
												onClick={deleteDialog.onOpen}
											>
												Delete
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
											<img
												src={`http://maps.googleapis.com/maps/api/staticmap?center=${query.data.locations[0].longitude},${query.data.locations[0].latitude}&zoom=11&size=200x200&sensor=false`}
											></img>
										)}
								</Flex>
								<Button
									as={NavLink}
									to={`/reserve/${query.data.id}`}
									my="20"
									background={"blue.900"}
									colorScheme="blue"
								>
									Reserve
								</Button>
							</Flex>
							<Flex flex={"1"}></Flex>
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
			<Flex gap={"5"} my="5" direction={"row"} wrap={"wrap"}>
				{gallery.map((_img) => (
					<Img
						key={_img.id}
						onClick={() => setSelected(_img.eventPhoto)}
						borderRadius={"md"}
						src={_img.eventPhoto}
						height={"100px"}
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
		<Flex direction={"column"}>
			<Heading fontSize={"2xl"}>Reviews</Heading>
		</Flex>
	);
};
