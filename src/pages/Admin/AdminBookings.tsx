import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	Heading,
	Icon,
	Input,
	InputGroup,
	InputLeftElement,
	ModalProps,
	SkeletonText,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../state/userState";
import { adminAPI } from "$lib/api/admin";
import { useRef, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

export const AdminBookingPage = () => {
	const [token, setToken] = useState("");
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
			<Flex justifyContent={"space-between"} mb="5">
				<Heading fontSize={"2xl"}>Booked Tickets</Heading>
				<InputGroup justifySelf={"flex-end"} width={"300px"}>
					<InputLeftElement>
						<Icon as={HiMagnifyingGlass} />
					</InputLeftElement>
					<Input
						placeholder="Search By Token"
						name="token"
						value={token}
						onChange={(e) => setToken(e.target.value)}
					/>
				</InputGroup>
			</Flex>
			<Flex direction={"column"}>
				<Table>
					<Thead>
						<Tr>
							<Th>ID</Th>
							<Th>Token</Th>
							<Th>Price</Th>
							<Th>Actions</Th>
						</Tr>
					</Thead>
					<BookingsList filterToken={token} />
				</Table>
			</Flex>
		</Flex>
	);
};

const BookingsList = ({ filterToken }: { filterToken: string }) => {
	const confirmDialog = useDisclosure();
	const user = useUser((state) => state.user);
	const queryClient = useQueryClient();
	const toast = useToast();
	const query = useQuery({
		queryKey: ["loadBookings"],
		queryFn: () => adminAPI.loadBookings(user),
	});

	if (query.isLoading) {
		return (
			<Tbody>
				{[...Array(3)].map((_v, _i) => (
					<Tr key={_i}>
						<Td>
							<SkeletonText noOfLines={1} />
						</Td>
						<Td>
							<SkeletonText noOfLines={1} />
						</Td>
						<Td>
							<SkeletonText noOfLines={1} />
						</Td>
						<Td>
							<SkeletonText noOfLines={1} />
						</Td>
					</Tr>
				))}
			</Tbody>
		);
	}

	return (
		<Tbody>
			{query.data &&
				query.data
					.filter((_val) => _val.bookingToken.startsWith(filterToken))
					.map((_booking, _index) => (
						<Tr>
							<Td>{_booking.id}</Td>
							<Td>{_booking.bookingToken}</Td>
							<Td>{_booking.price}</Td>
							<Td>
								<ConfirmDialog
									id={_booking.id}
									isOpen={confirmDialog.isOpen}
									onClose={confirmDialog.onClose}
								/>
								<Button
									colorScheme="green"
									variant={"ghost"}
									size="sm"
									onClick={confirmDialog.onOpen}
								>
									Approve
								</Button>
							</Td>
						</Tr>
					))}
		</Tbody>
	);
};

const ConfirmDialog = ({
	id,
	...props
}: Omit<ModalProps, "children" | "id"> & { id: number }) => {
	const btnRef = useRef(null);
	const toast = useToast();
	const user = useUser((state) => state.user);
	const queryClient = useQueryClient();

	const approveMutation = useMutation({
		mutationKey: ["approveBooking"],
		mutationFn: (id: number) => adminAPI.approveTicket(user, id),
		onSuccess() {
			queryClient.invalidateQueries(["loadBookings"]);
			toast({
				status: "success",
				title: "Ticket Approved",
			});
		},
	});

	return (
		<AlertDialog {...props} leastDestructiveRef={btnRef}>
			<AlertDialogOverlay></AlertDialogOverlay>
			<AlertDialogContent>
				<AlertDialogHeader>Are You Sure?</AlertDialogHeader>
				<AlertDialogFooter>
					<ButtonGroup>
						<Button
							colorScheme="green"
							onClick={() => approveMutation.mutate(id)}
							ref={btnRef}
						>
							Approve
						</Button>
						<Button onClick={props.onClose}>Cancel</Button>
					</ButtonGroup>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
