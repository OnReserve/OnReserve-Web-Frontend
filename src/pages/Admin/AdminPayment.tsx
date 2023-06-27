import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	Flex,
	Heading,
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
import { Dispatch, SetStateAction, useRef, useState } from "react";

export const AdminRequestPage = () => {
	const confirmDialog = useDisclosure();
	const [requestId, setRequestId] = useState(0);

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
			<ConfirmDialog
				id={requestId}
				isOpen={confirmDialog.isOpen}
				onClose={confirmDialog.onClose}
			/>
			<Heading fontSize={"2xl"} mb="10">
				Payment Requests
			</Heading>
			<Flex direction={"column"}>
				<Table>
					<Thead>
						<Tr>
							<Th>ID</Th>
							<Th>Amount</Th>
							<Th>Account No.</Th>
							<Th>Account Name</Th>
							<Th>Actions</Th>
						</Tr>
					</Thead>
					<RequestList
						onOpen={confirmDialog.onOpen}
						setID={setRequestId}
					/>
				</Table>
			</Flex>
		</Flex>
	);
};

const RequestList = ({
	setID,
	onOpen,
}: {
	setID: Dispatch<SetStateAction<number>>;
	onOpen: () => void;
}) => {
	const user = useUser((state) => state.user);
	const query = useQuery({
		queryKey: ["loadRequests"],
		queryFn: () => adminAPI.getPaymentRequests(user),
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
				query.data.map((_request, _index) => (
					<Tr>
						<Td>{_request.id}</Td>
						<Td>{_request.amount}</Td>
						<Td>{_request.cbe_account}</Td>
						<Td textTransform={"uppercase"}>
							{_request.cbe_fullname}
						</Td>
						<Td>
							<Button
								colorScheme="green"
								variant={"ghost"}
								size="sm"
								onClick={() => {
									setID(_request.id);
									onOpen();
								}}
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
		mutationKey: ["approveRequest"],
		mutationFn: (id: number) => adminAPI.approveRequest(user, id),
		onSuccess() {
			queryClient.invalidateQueries(["loadRequests"]);
			toast({
				status: "success",
				title: "Request Completed",
			});
			props.onClose();
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
