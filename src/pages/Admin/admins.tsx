import { adminAPI } from "$lib/api/admin";
import {
	Avatar,
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
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
import { HiPlus } from "react-icons/hi2";
import { useUser } from "../../state/userState";
import { useState } from "react";
import { date } from "yup";
import { Axios, AxiosError } from "axios";

export const AdminsList = () => {
	const addAdminDialog = useDisclosure();
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
			<Flex
				justifyContent={"space-between"}
				alignItems={"center"}
				mb="10"
			>
				<Heading fontSize={"2xl"}>Super Admins</Heading>
				<Button
					leftIcon={<HiPlus />}
					colorScheme="blue"
					size={"sm"}
					onClick={addAdminDialog.onOpen}
				>
					Add Super Admin
				</Button>
				<AddAdminDialog
					isOpen={addAdminDialog.isOpen}
					onClose={addAdminDialog.onClose}
				/>
			</Flex>
			<Flex direction={"column"}>
				<Table>
					<Thead>
						<Tr>
							<Th>PP</Th>
							<Th>Full name</Th>
							<Th>Email</Th>
							<Th>Actions</Th>
						</Tr>
					</Thead>
					<AdminsTable />
				</Table>
			</Flex>
		</Flex>
	);
};

const AdminsTable = () => {
	const user = useUser((state) => state.user);
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ["loadSuperAdmins"],
		queryFn: () => adminAPI.loadAdmins(user),
	});

	const removeAdminMutation = useMutation({
		mutationKey: ["removeAdmin"],
		mutationFn: (id: number) => adminAPI.deleteAdmin(user, id),
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries(["loadSuperAdmins"]);
		},
		onError(error, variables, context) {
			if (error instanceof AxiosError) {
				console.log(error);
			}
		},
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
				query.data.map((_admin) => (
					<Tr>
						<Td>
							<Avatar
								size={"md"}
								src={_admin.profilePic}
								name={`${_admin.fname} ${_admin.lname}`}
							/>
						</Td>
						<Td>{`${_admin.fname} ${_admin.lname}`}</Td>
						<Td>{_admin.email}</Td>
						<Td>
							{_admin.id !== user?.id && (
								<Button
									size={"sm"}
									colorScheme="red"
									variant={"ghost"}
									onClick={() =>
										removeAdminMutation.mutate(_admin.id)
									}
									isDisabled={removeAdminMutation.isLoading}
								>
									Remove
								</Button>
							)}
						</Td>
					</Tr>
				))}
		</Tbody>
	);
};

const AddAdminDialog = (props: Omit<ModalProps, "children">) => {
	const [email, setEmail] = useState("");
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();
	const addMutation = useMutation({
		mutationKey: ["AddSuperAdmin"],
		mutationFn: (email: string) => adminAPI.addAdmin(user, email),
		onSuccess: (data, variables, context) => {
			toast({
				status: "success",
				title: "Super admin Added",
			});
			queryClient.invalidateQueries(["loadSuperAdmins"]);
			props.onClose();
		},
		onError(error, variables, context) {
			if (error instanceof AxiosError) {
				toast({
					status: "error",
					title: "Error",
					description: error.response?.data.message,
				});
			}
		},
	});

	return (
		<Modal {...props}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Add Super Admin
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody>
					<FormControl>
						<FormLabel>Email</FormLabel>
						<Input
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							colorScheme="blue"
							onClick={() => addMutation.mutate(email)}
							isLoading={addMutation.isLoading}
						>
							Add Admin
						</Button>
						<Button
							onClick={props.onClose}
							disabled={addMutation.isLoading}
						>
							Cancel
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
