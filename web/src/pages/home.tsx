import { Button, HStack } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

export const Home = () => {
	return (
		<>
			<HStack
				minHeight={"100vh"}
				background={"purple.50"}
				justifyContent={"center"}
				spacing={10}
			>
				<Button
					type={"button"}
					colorScheme={"purple"}
					variant={"solid"}
					as={ReactLink}
					to={"enter-room"}
				>
					Enter room
				</Button>
				<Button
					type={"button"}
					colorScheme={"purple"}
					variant={"outline"}
					as={ReactLink}
					to={"create-room"}
				>
					Create room
				</Button>
			</HStack>
		</>
	);
};
