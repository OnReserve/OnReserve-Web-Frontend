import { adminAPI } from "$lib/api/admin";
import { ICategoryResponse, categoryAPI } from "$lib/api/categories";
import {
	Alert,
	AlertDescription,
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	AlertIcon,
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
import { Axios, AxiosError } from "axios";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useUser } from "../../state/userState";
import { HiPlus } from "react-icons/hi2";

export const AdminCategories = () => {
	const [currentCategory, setCurrentCategory] = useState(
		{} as ICategoryResponse
	);

	const addDialog = useDisclosure();
	const editDialog = useDisclosure();
	const deleteDialog = useDisclosure();

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
			<EditCategoryDialog
				currentCategory={currentCategory}
				onClose={editDialog.onClose}
				isOpen={editDialog.isOpen}
			/>
			<ConfirmDialog
				id={currentCategory.id}
				onClose={deleteDialog.onClose}
				isOpen={deleteDialog.isOpen}
			/>
			<AddCategoryDialog
				onClose={addDialog.onClose}
				isOpen={addDialog.isOpen}
			/>
			<Flex justifyContent={"space-between"} mb="5">
				<Heading fontSize={"2xl"}>Categories</Heading>
				<Button
					size="sm"
					leftIcon={<HiPlus />}
					onClick={addDialog.onOpen}
				>
					Add Category
				</Button>
			</Flex>

			<Table>
				<Thead>
					<Tr>
						<Th>Category Name</Th>
						<Th>Events Count</Th>
						<Th>Created on</Th>
						<Th>Actions</Th>
					</Tr>
				</Thead>
				<AdminCategoriesTable
					setCurrentCategory={setCurrentCategory}
					onDelete={deleteDialog.onOpen}
					onEdit={editDialog.onOpen}
				/>
			</Table>
		</Flex>
	);
};

interface IAdminCategoryTable {
	setCurrentCategory: Dispatch<SetStateAction<ICategoryResponse>>;
	onEdit: () => void;
	onDelete: () => void;
}

const AdminCategoriesTable = ({
	setCurrentCategory,
	onEdit,
	onDelete,
}: IAdminCategoryTable) => {
	const query = useQuery({
		queryKey: ["loadCategories"],
		queryFn: () => categoryAPI.getCategories(),
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
				query.data.map((_category) => (
					<Tr>
						<Td>{_category.name}</Td>
						<Td>{_category._count.events}</Td>
						<Td>
							{dayjs(_category.createdAt).format("DD/MM/YYYY")}
						</Td>
						<Td>
							<ButtonGroup size={"sm"}>
								<Button
									onClick={() => {
										setCurrentCategory(_category);
										onEdit();
									}}
								>
									Edit
								</Button>
								<Button
									variant={"ghost"}
									colorScheme="red"
									onClick={() => {
										setCurrentCategory(_category);
										onDelete();
									}}
								>
									Delete
								</Button>
							</ButtonGroup>
						</Td>
					</Tr>
				))}
		</Tbody>
	);
};

const AddCategoryDialog = (props: Omit<ModalProps, "children">) => {
	const [category, setCategory] = useState("");
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();
	const addMutation = useMutation({
		mutationKey: ["AddCategory"],
		mutationFn: (category: string) =>
			categoryAPI.addCategory(user, category),
		onSuccess: (data, variables, context) => {
			toast({
				status: "success",
				title: "Category Added",
				position: "bottom-right",
			});
			queryClient.invalidateQueries(["loadCategories"]);
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
					Add Category
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody>
					<FormControl>
						<FormLabel>Category</FormLabel>
						<Input
							name="category"
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							colorScheme="blue"
							onClick={() => addMutation.mutate(category)}
							isLoading={addMutation.isLoading}
						>
							Add Category
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

const EditCategoryDialog = ({
	currentCategory,
	...props
}: Omit<ModalProps, "children"> & { currentCategory: ICategoryResponse }) => {
	const [category, setCategory] = useState(currentCategory.name);
	const user = useUser((state) => state.user);
	const toast = useToast();
	const queryClient = useQueryClient();

	const addMutation = useMutation({
		mutationKey: ["editCategory", currentCategory.id],
		mutationFn: (category: string) =>
			categoryAPI.updateCategory(user, currentCategory.id, category),
		onSuccess: (data, variables, context) => {
			toast({
				status: "success",
				title: "Category Updated",
				position: "bottom-right",
			});
			queryClient.invalidateQueries(["loadCategories"]);
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
					Edit Category
					<ModalCloseButton />
				</ModalHeader>
				<ModalBody>
					<FormControl>
						<FormLabel>Category</FormLabel>
						<Input
							name="category"
							type="text"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<ButtonGroup>
						<Button
							colorScheme="blue"
							onClick={() => addMutation.mutate(category)}
							isLoading={addMutation.isLoading}
						>
							Update
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

const ConfirmDialog = ({
	id,
	...props
}: Omit<ModalProps, "children" | "id"> & { id: number }) => {
	const btnRef = useRef(null);
	const toast = useToast();
	const user = useUser((state) => state.user);
	const queryClient = useQueryClient();

	const approveMutation = useMutation({
		mutationKey: ["deleteCategory", id],
		mutationFn: (id: number) => categoryAPI.deleteCategory(user, id),
		onSuccess() {
			queryClient.invalidateQueries(["loadCategories"]);
			toast({
				status: "success",
				title: "Category Deleted",
			});
			props.onClose();
		},
		onError(error) {
			if (error instanceof AxiosError) {
				toast({
					status: "error",
					title: error.response?.data.message,
				});
			}
			props.onClose();
		},
	});

	return (
		<AlertDialog {...props} leastDestructiveRef={btnRef}>
			<AlertDialogOverlay></AlertDialogOverlay>
			<AlertDialogContent>
				<AlertDialogHeader>Are You Sure?</AlertDialogHeader>
				<AlertDialogBody>
					<Alert status="warning">
						<AlertIcon></AlertIcon>
						<AlertDescription>
							Deleting a category also deletes events created
							under it.
						</AlertDescription>
					</Alert>
				</AlertDialogBody>
				<AlertDialogFooter>
					<ButtonGroup>
						<Button
							colorScheme="red"
							onClick={() => approveMutation.mutate(id)}
						>
							Delete
						</Button>
						<Button ref={btnRef} onClick={props.onClose}>
							Cancel
						</Button>
					</ButtonGroup>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
