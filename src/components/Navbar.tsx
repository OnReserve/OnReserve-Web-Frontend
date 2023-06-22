import {
	Button,
	ButtonGroup,
	Divider,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Popover,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Text,
	UseDisclosureReturn,
	useDisclosure,
} from "@chakra-ui/react";
import {
	HiArrowRightCircle,
	HiArrowRightOnRectangle,
	HiBars3BottomRight,
	HiChevronDown,
	HiMagnifyingGlass,
	HiUserCircle,
} from "react-icons/hi2";
import {
	Link,
	NavLink,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { useUser } from "../state/userState";
import { FormEvent, useState } from "react";
import { myConstants } from "$config/theme";

export const Navbar = () => {
	const mobileMenu = useDisclosure();
	const user = useUser((state) => state.user);
	const logout = useUser((state) => state.logout);
	const navigate = useNavigate();
	const location = useLocation();
	const Links = [
		{
			label: "Home",
			path: "/",
		},
		{
			label: "Events",
			path: "/events",
		},
		{
			label: "Create",
			path: "/event/add",
		},
		{
			label: "My Tickets",
			path: "/profile/bookings",
		},
		{
			label: "Admin",
			path: "/admin",
			condition: !user || user.role !== "SUPERADMIN",
		},
	];

	return (
		<Flex
			background={"white"}
			color="blue.900"
			px={myConstants.pagePadding}
			py={["5", "10"]}
			width={"100%"}
			alignItems={"center"}
			gap="5"
		>
			<Heading fontSize={["xl", "2xl"]} as={NavLink} to={"/"}>
				OnReserve
			</Heading>
			<Flex
				flex={1}
				justifyContent={"flex-end"}
				gap={"2"}
				display={["flex", "flex", "none"]}
			>
				<Popover>
					<PopoverTrigger>
						<IconButton aria-label="search">
							<Icon as={HiMagnifyingGlass} />
						</IconButton>
					</PopoverTrigger>
					<PopoverContent>
						<PopoverBody>
							<SearchBar />
						</PopoverBody>
					</PopoverContent>
				</Popover>
				<IconButton
					aria-label="Menu"
					onClick={mobileMenu.onOpen}
					colorScheme="blue"
				>
					<Icon as={HiBars3BottomRight} />
				</IconButton>
			</Flex>
			<MobMenu mobileMenu={mobileMenu} linksList={Links} />
			<ButtonGroup
				display={["none", "none", "flex"]}
				variant={"ghost"}
				flex="1"
				size={"sm"}
			>
				{Links.map(
					(_link, _index) =>
						!_link.condition && (
							<Button
								as={NavLink}
								to={_link.path}
								justifyContent={"flex-start"}
								key={_index}
								colorScheme={
									location.pathname === _link.path
										? "blue"
										: "gray"
								}
								variant={"ghost"}
							>
								{_link.label}
							</Button>
						)
				)}
			</ButtonGroup>
			<Flex display={["none", "none", "flex"]} gap={"4"}>
				<SearchBar />
				{user ? (
					<ButtonGroup variant={"outline"}>
						<Button
							as={Link}
							to={"/profile"}
							leftIcon={<Icon as={HiUserCircle} />}
						>
							Profile
						</Button>
						<IconButton
							onClick={() => {
								logout();
								navigate("/");
							}}
							aria-label="Log-out"
							icon={<Icon as={HiArrowRightOnRectangle} />}
						/>
					</ButtonGroup>
				) : (
					<ButtonGroup variant={"solid"} borderRadius={"20px"}>
						<Button
							as={NavLink}
							to={"/auth/login"}
							variant={"ghost"}
							borderRadius={"20px"}
						>
							Login
						</Button>
						<Button
							as={NavLink}
							to={"/auth/sign-up"}
							colorScheme="blue"
							borderRadius={"20px"}
						>
							Sign Up
						</Button>
					</ButtonGroup>
				)}
			</Flex>
		</Flex>
	);
};

const SearchBar = () => {
	const [params, setParams] = useSearchParams();
	const [search, setSearch] = useState(params.get("keyword") || "");
	const navigate = useNavigate();

	const handleSearch = (event: FormEvent) => {
		event.preventDefault();
		navigate("/events");
		setParams(new URLSearchParams([["keyword", search]]));
	};

	return (
		<Flex as={"form"} onSubmit={handleSearch}>
			<FormControl>
				<InputGroup>
					<InputRightElement>
						<IconButton
							aria-label="search"
							type="submit"
							variant={"ghost"}
							borderRadius={"100%"}
						>
							<HiMagnifyingGlass />
						</IconButton>
					</InputRightElement>
					<Input
						borderRadius={"20px"}
						variant={"outline"}
						placeholder="Search Event"
						type="search"
						name="keyword"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					></Input>
				</InputGroup>
			</FormControl>
		</Flex>
	);
};

function MobMenu({
	mobileMenu,
	linksList,
}: {
	mobileMenu: UseDisclosureReturn;
	linksList: any[];
}) {
	const user = useUser((state) => state.user);
	const logout = useUser((state) => state.logout);
	const navigate = useNavigate();

	return (
		<Drawer isOpen={mobileMenu.isOpen} onClose={mobileMenu.onClose}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>OnReserve</DrawerHeader>
				<DrawerBody>
					<Flex direction={"column"} gap={"3"} flex={1} mb="4">
						{linksList.map(
							(_link, _index) =>
								!_link.condition && (
									<Button
										as={NavLink}
										to={_link.path}
										justifyContent={"flex-start"}
										key={_index}
										colorScheme={
											location.pathname === _link.path
												? "blue"
												: "gray"
										}
										variant={"ghost"}
									>
										{_link.label}
									</Button>
								)
						)}
						<Divider />
						{user ? (
							<>
								<Button
									as={Link}
									to={"/profile"}
									leftIcon={<Icon as={HiUserCircle} />}
									variant={"outline"}
									colorScheme="blue"
									justifyContent={"flex-start"}
								>
									Profile
								</Button>
								<Button
									variant={"outline"}
									justifyContent={"flex-start"}
									leftIcon={
										<Icon as={HiArrowRightOnRectangle} />
									}
									onClick={() => {
										logout();
										navigate("/");
									}}
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Button
									as={NavLink}
									to="/auth/login"
									justifyContent={"flex-start"}
									colorScheme="blue"
									leftIcon={<HiArrowRightOnRectangle />}
								>
									Login
								</Button>
								<Button
									justifyContent={"flex-start"}
									as={NavLink}
									to="/auth/sign-up"
								>
									Sign Up
								</Button>
							</>
						)}
					</Flex>
				</DrawerBody>
				<DrawerFooter>
					<Text fontSize={"sm"} color={"gray.700"}>
						OnReserve &copy; {new Date().getFullYear()}
					</Text>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
