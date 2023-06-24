import {
	Flex,
	Heading,
	Icon,
	Img,
	SimpleGrid,
	Skeleton,
	Text,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import {
	HiKey,
	HiRectangleStack,
	HiRocketLaunch,
	HiSun,
} from "react-icons/hi2";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { eventAPI } from "$lib/api/event";
import dayjs from "dayjs";
import { NavLink, useNavigate } from "react-router-dom";
import { useCategories } from "$lib/hooks/useCategories";
import { useFilter } from "../../state/filterState";
import { myConstants } from "$config/theme";

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

const PopularSection = () => {
	return (
		<Flex direction={"column"} px={myConstants.pagePadding} mt="5">
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
				<PopularList />
			</Flex>
		</Flex>
	);
};

const PopularList = () => {
	const popular = useQuery({
		queryKey: ["popularEvents"],
		queryFn: () => eventAPI.getEvents({ type: "popular" }),
	});

	if (popular.isLoading) {
		return (
			<>
				{[...Array(5)].map((_v, _i) => (
					<Skeleton
						key={_i}
						scrollSnapAlign={"start"}
						position={"relative"}
						minWidth={"300px"}
						height={"200px"}
						p={"6"}
						backgroundSize={"cover"}
						borderRadius={"2xl"}
						justifyContent={"flex-end"}
					></Skeleton>
				))}
			</>
		);
	}

	return (
		<>
			{popular.data &&
				popular.data.map((_event) => (
					<PopularListCard
						key={_event.id}
						id={_event.id}
						bgUrl={_event.galleries[0].eventPhoto}
						title={_event.title}
						type={_event.company?.name || ""}
						date={dayjs(_event.eventStartTime).date()}
						month={dayjs(_event.eventStartTime).format("MMM")}
					/>
				))}
		</>
	);
};

interface IPopularListCard {
	id: number;
	title: string;
	type: string;
	bgUrl: string;
	date: number;
	month: string;
}

const PopularListCard = ({
	id,
	title,
	type,
	bgUrl,
	date,
	month,
}: IPopularListCard) => {
	return (
		<Flex
			as={NavLink}
			to={`/events/${id}`}
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
	const categories = useCategories();
	return (
		<Flex
			direction={"column"}
			px={myConstants.pagePadding}
			my={["10", "20"]}
		>
			<Heading fontSize={"2xl"} mb="5" color={"gray.700"}>
				Category
			</Heading>
			<SimpleGrid columns={[2, 2, 3]} gap={["2", "4", "5"]}>
				{categories.isLoading &&
					[...Array(6)].map((_v, _i) => (
						<Skeleton h={"32"} borderRadius={"md"} />
					))}
				{categories.data &&
					categories.data.map((_category) => (
						<CategoryCard
							key={_category.id}
							id={_category.id}
							icon={<Icon as={HiRectangleStack} boxSize={"5"} />}
							name={_category.name}
							amount={_category._count.events}
						/>
					))}
			</SimpleGrid>
		</Flex>
	);
};

interface ICategoryCard {
	id: number;
	icon: ReactNode;
	name: string;
	amount: number;
}

const CategoryCard = ({ id, icon, name, amount }: ICategoryCard) => {
	const setFilter = useFilter((state) => state.setFilterItem);
	const setFinalFilter = useFilter((state) => state.setFinalFilter);
	const navigate = useNavigate();

	const handleClick = () => {
		setFilter("category", id);
		setFinalFilter();
		navigate("/events");
	};

	return (
		<Flex
			onClick={handleClick}
			_hover={{ background: "blue.900", boxShadow: "lg" }}
			cursor="pointer"
			background={"blue.800"}
			transition="all 300ms ease-out"
			p={["3", "4", "6"]}
			borderRadius={"lg"}
			gap={["3", "4", "6"]}
		>
			<Flex
				background={"white"}
				p={["3", "3", "5"]}
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
				<Heading fontSize={["lg", "xl"]} mb="2">
					{name}
				</Heading>
				<Text fontSize={["sm", "md"]}>{amount} Available</Text>
			</Flex>
		</Flex>
	);
};

const ReasonSection = () => {
	return (
		<Flex my={["10", "20"]} px={myConstants.pagePadding} gap={"10"}>
			<Flex flex="1" direction={"column"}>
				<Heading fontSize={["4xl", "5xl"]} mb="16">
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
				display={["none", "none", "block"]}
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
		<Flex direction={"column"} px={myConstants.pagePadding} my="20">
			<Heading mb="10">Trusted By Leading Companies</Heading>
			<SimpleGrid columns={[1, 1, 2]} gap={"10"} position={"relative"}>
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
			</SimpleGrid>
		</Flex>
	);
};
