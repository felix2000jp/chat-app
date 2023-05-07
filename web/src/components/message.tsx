import { Box, Divider, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type Args = {
	align: "start" | "end";
	writer: string | undefined;
	content: string;
};

export const Message = (args: Args) => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		elementRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	return (
		<Box
			ref={elementRef}
			background={"white"}
			rounded={"lg"}
			boxShadow={"lg"}
			padding={6}
			margin={6}
			maxWidth={"60%"}
			minWidth={{ base: "45%", sm: "40%", md: "35%", lg: "30%" }}
			alignSelf={args.align}
		>
			<Stack spacing={4}>
				<Text>{args.content}</Text>
				{args.writer && (
					<>
						<Divider />
						<Heading
							size={"xs"}
							textAlign={args.align}
						>
							{args.writer}
						</Heading>
					</>
				)}
			</Stack>
		</Box>
	);
};
