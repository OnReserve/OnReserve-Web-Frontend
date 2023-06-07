import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	Heading,
	Icon,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import {
	HiArrowRightOnRectangle,
	HiChevronDown,
	HiMagnifyingGlass,
	HiUserCircle,
} from "react-icons/hi2";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../state/userState";

export const Navbar = () => {
	const user = useUser((state) => state.user);
	const logout = useUser((state) => state.logout);
	const navigate = useNavigate();

	return (
		<Flex
			color="blue.900"
			px="20"
			py="10"
			width={"100%"}
			alignItems={"center"}
			gap="5"
		>
			<Heading fontSize={"2xl"} as={NavLink} to={"/"}>
				OnReserve
			</Heading>
			<ButtonGroup variant={"ghost"} flex="1" size={"sm"}>
				<Button as={NavLink} to={"/events"}>
					Events
				</Button>
				<Menu size={"sm"}>
					<MenuButton as={Button} rightIcon={<HiChevronDown />}>
						Create
					</MenuButton>
					<MenuList>
						<MenuItem>Concerts</MenuItem>
						<MenuItem>Movies</MenuItem>
						<MenuItem>Trips</MenuItem>
						<MenuItem>Camping</MenuItem>
					</MenuList>
				</Menu>
				<Button>Ticket</Button>
				<Button>My Events</Button>
			</ButtonGroup>
			<Flex>
				<FormControl>
					<InputGroup>
						<InputLeftElement>
							<HiMagnifyingGlass />
						</InputLeftElement>
						<Input
							borderRadius={"20px"}
							variant={"outline"}
							placeholder="Search"
						></Input>
					</InputGroup>
				</FormControl>
			</Flex>
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
	);
};
