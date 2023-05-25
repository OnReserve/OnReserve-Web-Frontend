import { Flex, Box, Text } from "@chakra-ui/react";

export const SeparatorWithLabel = ({ label }: { label: string }) => {
	return (
		<Flex width={"100%"} alignItems={"center"} gap="2">
			<Box
				display={"block"}
				flex={"1"}
				height={"1px"}
				background={"gray.400"}
			></Box>
			<Text color={"gray.800"}>{label}</Text>
			<Box
				display={"block"}
				flex={"1"}
				height={"1px"}
				background={"gray.400"}
			></Box>
		</Flex>
	);
};
