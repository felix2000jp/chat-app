import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type Args = {
	roomName: string;
	onLeave: () => void;
};

export const Topbar = (args: Args) => {
	const navigate = useNavigate();

	return (
		<Flex
			height={"10vh"}
			alignItems="center"
			justifyContent={"space-between"}
			padding={2}
		>
			<Heading
				as="h1"
				color="purple.500"
				flexGrow={1}
			>
				{args.roomName}
			</Heading>
			<Button
				type="button"
				colorScheme="red"
				variant="solid"
				onClick={() => {
					args.onLeave();
					navigate("/");
				}}
			>
				Leave Room
			</Button>
		</Flex>
	);
};
