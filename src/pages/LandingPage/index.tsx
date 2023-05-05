import {
	Button,
	ButtonGroup,
	Flex,
	FormControl,
	Heading,
	Icon,
	IconButton,
	Img,
	Input,
	InputGroup,
	InputLeftElement,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
	HiArrowRight,
	HiChevronDown,
	HiGlobeAsiaAustralia,
	HiKey,
	HiMagnifyingGlass,
	HiMusicalNote,
	HiRocketLaunch,
	HiSun,
	HiVideoCamera,
} from "react-icons/hi2";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export const LandingPage = () => {
	return (
		<Flex direction={"column"} width={"100%"}>
			<Navbar />
			<PopularSection />
			<CategorySection />
			<ReasonSection />
			<TrustedBySection />
			<Footer />
		</Flex>
	);
};

const Navbar = () => {
	return (
		<Flex
			color="blue.900"
			px="20"
			py="10"
			width={"100%"}
			alignItems={"center"}
			gap="5"
		>
			<Heading fontSize={"2xl"}>OnReserve</Heading>
			<ButtonGroup variant={"ghost"} flex="1" size={"sm"}>
				<Menu size={"sm"}>
					<MenuButton as={Button} rightIcon={<HiChevronDown />}>
						Events
					</MenuButton>
					<MenuList>
						<MenuItem>Concerts</MenuItem>
						<MenuItem>Movies</MenuItem>
						<MenuItem>Trips</MenuItem>
						<MenuItem>Camping</MenuItem>
					</MenuList>
				</Menu>
				<Button rightIcon={<HiChevronDown />}>Create</Button>
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
			<ButtonGroup variant={"solid"} borderRadius={"20px"}>
				<Button variant={"ghost"} borderRadius={"20px"}>
					Login
				</Button>
				<Button colorScheme="blue" borderRadius={"20px"}>
					Sign Up
				</Button>
			</ButtonGroup>
		</Flex>
	);
};

const PopularSection = () => {
	const popular: IPopularListCard[] = [
		{
			title: "Rophnan at Hawasa",
			type: "Concert",
			bgUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
			date: 20,
			month: "jan",
		},
		{
			title: "Rophnan at Hawasa",
			type: "Concert",
			bgUrl: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80",
			date: 20,
			month: "jan",
		},
		{
			title: "Rophnan at Hawasa",
			type: "Concert",
			bgUrl: "https://images.unsplash.com/photo-1583795484071-3c453e3a7c71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80",
			date: 20,
			month: "jan",
		},
		{
			title: "Rophnan at Hawasa",
			type: "Concert",
			bgUrl: "https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=415&q=80",
			date: 20,
			month: "jan",
		},
	];
	return (
		<Flex direction={"column"} px="32" mt="5">
			<Heading fontSize={"2xl"} mb="5" color={"gray.700"}>
				Popular
			</Heading>

			<Flex
				gap={"5"}
				overflow={"auto"}
				pb={"4"}
				scrollSnapType={"x mandatory"}
				sx={{
					"&::-webkit-scrollbar": {
						display: "none",
					},
				}}
			>
				{popular.map((p) => (
					<PopularListCard {...p} key={p.title} />
				))}
			</Flex>
		</Flex>
	);
};

interface IPopularListCard {
	title: string;
	type: string;
	bgUrl: string;
	date: number;
	month: string;
}

const PopularListCard = ({
	title,
	type,
	bgUrl,
	date,
	month,
}: IPopularListCard) => {
	return (
		<Flex
			scrollSnapAlign={"start"}
			direction={"column"}
			position={"relative"}
			minWidth={"300px"}
			height={"200px"}
			p={"6"}
			background={`linear-gradient(180deg, transparent, #000), url(${bgUrl})`}
			backgroundSize={"cover"}
			borderRadius={"2xl"}
			justifyContent={"flex-end"}
			boxShadow={"lg"}
		>
			<Flex color={"white"} direction={"column"}>
				<Text>{type}</Text>
				<Heading fontSize={"lg"}>{title}</Heading>
			</Flex>
			<Flex
				direction={"column"}
				position={"absolute"}
				background="whiteAlpha.800"
				borderRadius={"lg"}
				top="5"
				right="5"
				padding={"2"}
				fontWeight={"bold"}
				alignItems={"center"}
			>
				<Text textTransform={"uppercase"} fontSize={"sm"}>
					{month}
				</Text>
				<Text fontSize={"md"}>{date}</Text>
			</Flex>
		</Flex>
	);
};

const CategorySection = () => {
	return (
		<Flex direction={"column"} px="32" my="20">
			<Heading fontSize={"2xl"} mb="5" color={"gray.700"}>
				Category
			</Heading>
			<SimpleGrid columns={[2, 2, 3]} gap={"5"}>
				<CategoryCard
					icon={<HiVideoCamera size="30px" />}
					name="Movies"
					amount={10}
				/>
				<CategoryCard
					icon={<HiMusicalNote size="30px" />}
					name="Concert"
					amount={20}
				/>
				<CategoryCard
					icon={<HiGlobeAsiaAustralia size="30px" />}
					name="Trips"
					amount={10}
				/>
				<CategoryCard
					icon={<HiVideoCamera size="30px" />}
					name="Movies"
					amount={10}
				/>
				<CategoryCard
					icon={<HiMusicalNote size="30px" />}
					name="Concert"
					amount={20}
				/>
				<CategoryCard
					icon={<HiGlobeAsiaAustralia size="30px" />}
					name="Trips"
					amount={10}
				/>
			</SimpleGrid>
		</Flex>
	);
};

interface ICategoryCard {
	icon: ReactNode;
	name: string;
	amount: number;
}

const CategoryCard = ({ icon, name, amount }: ICategoryCard) => {
	return (
		<Flex
			_hover={{ background: "blue.900", boxShadow: "lg" }}
			cursor="pointer"
			background={"blue.800"}
			transition="all 300ms ease-out"
			p="6"
			borderRadius={"lg"}
			gap="6"
		>
			<Flex
				background={"white"}
				p="5"
				alignItems={"center"}
				justifyContent={"center"}
				borderRadius={"md"}
				color="blue.800"
			>
				{icon}
			</Flex>
			<Flex
				direction={"column"}
				color="white"
				flex="1"
				justifyContent={"center"}
			>
				<Heading fontSize={"xl"} mb="2">
					{name}
				</Heading>
				<Text>{amount} Available</Text>
			</Flex>
		</Flex>
	);
};

const ReasonSection = () => {
	return (
		<Flex my="20" px="32" gap={"10"}>
			<Flex flex="1" direction={"column"}>
				<Heading fontSize={"5xl"} mb="16">
					Why you reserve on OnReserve?
				</Heading>
				<ReasonCard
					icon={<HiSun size="40px" />}
					title="Proof of Quality"
				/>
				<ReasonCard
					icon={<HiKey size="40px" />}
					title="Safe and Secure"
				/>
				<ReasonCard
					icon={<HiRocketLaunch size="40px" />}
					title="Fast & Decent"
				/>
			</Flex>
			<Img
				flex={"1"}
				src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=481&q=80"
				objectFit={"cover"}
				width={"100%"}
				height={"100%"}
			></Img>
		</Flex>
	);
};

interface IReasonCard {
	title: string;
	desc?: string;
	icon: ReactNode;
}

const ReasonCard = ({ title, desc, icon }: IReasonCard) => {
	return (
		<Flex mb="10">
			<Flex mr="8">{icon}</Flex>
			<Flex flex={1} direction={"column"}>
				<Heading mb="3" fontSize={"3xl"}>
					{title}
				</Heading>
				<Text>
					{desc ||
						`Lorem ipsum dolor, sit amet consectetur adipisicing elit.
					Recusandae dolorum optio molestias, rerum necessitatibus
					aspernatur eum et quae nobis eos voluptatem veritatis
					tenetur. Minima sint incidunt error, repellendus harum
					possimus?`}
				</Text>
			</Flex>
		</Flex>
	);
};

const TrustedBySection = () => {
	return (
		<Flex direction={"column"} px="32" my="20">
			<Heading mb="10">Trusted By Leading Companies</Heading>
			<SimpleGrid columns={[1, 2, 2]} gap={"10"} position={"relative"}>
				<Flex
					background={"blue.400"}
					direction={"column"}
					p="10"
					borderRadius={"lg"}
				>
					<Heading mb="5" fontSize={"3xl"}>
						Ethiopian Airlines
					</Heading>
					<Text>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Officiis sunt odio dignissimos voluptatem eveniet
						quia odit placeat, eum consectetur nisi voluptas,
						sapiente veritatis voluptatum tempore obcaecati fuga
						eligendi culpa? Facilis.
					</Text>
				</Flex>
				<Flex
					background={"green.400"}
					direction={"column"}
					p="10"
					borderRadius={"lg"}
				>
					<Heading mb="5" fontSize={"3xl"}>
						Visit Ethiopia
					</Heading>
					<Text>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Officiis sunt odio dignissimos voluptatem eveniet
						quia odit placeat, eum consectetur nisi voluptas,
						sapiente veritatis voluptatum tempore obcaecati fuga
						eligendi culpa? Facilis.
					</Text>
				</Flex>
				<IconButton
					aria-label="See All"
					icon={<HiArrowRight />}
					position={"absolute"}
					top="50%"
					transform={"translate(0, -50%)"}
					right={"-20px"}
					boxShadow="lg"
					colorScheme="gray"
					borderRadius={"100%"}
					size={"lg"}
				/>
			</SimpleGrid>
		</Flex>
	);
};

const Footer = () => {
	return (
		<Flex direction={"column"} background={"gray.200"}>
			<SimpleGrid
				columns={[1, 1, 3]}
				px="32"
				py="20"
				justifyItems={"center"}
			>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						OnReserve
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Pricing</Link>
						<Link>Updates</Link>
						<Link>Beta</Link>
						<Link>Newsletter</Link>
					</VStack>
				</Flex>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						Events
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Movies</Link>
						<Link>Concert</Link>
						<Link>Trip</Link>
						<Link>Climb</Link>
					</VStack>
				</Flex>
				<Flex direction={"column"}>
					<Heading mb="5" fontSize={"2xl"}>
						About
					</Heading>
					<VStack alignItems={"flex-start"}>
						<Link>Company</Link>
						<Link>Careers</Link>
						<Link>Legal</Link>
						<Link>Help</Link>
					</VStack>
				</Flex>
			</SimpleGrid>
			<Flex direction={"column"} background={"gray.200"}>
				<Flex
					p="3"
					pt="5"
					justifyContent={"center"}
					textAlign={"center"}
				>
					&copy; {new Date().getFullYear()} OnReserve. All rights
					reserved.
				</Flex>
				<Flex
					justifyContent={"center"}
					textAlign={"center"}
					gap={"5"}
					p="3"
				>
					<Link>
						<Icon boxSize={"8"}>
							<FaFacebook />
						</Icon>
					</Link>
					<Link>
						<Icon boxSize={"8"}>
							<FaTwitter />
						</Icon>
					</Link>
					<Link>
						<Icon boxSize={"8"}>
							<FaInstagram />
						</Icon>
					</Link>
				</Flex>
			</Flex>
		</Flex>
	);
};
