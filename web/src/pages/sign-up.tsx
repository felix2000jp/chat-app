import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { signUpFormSchema } from "~/schemas/user.schemas";
import { type SignUpArgs, type SignUpData, type SignUpForm } from "~/types/user.types";
import { httpClient } from "~/utils/http-client";
import { type ProblemDetails } from "~/utils/problem-details";

export const SignUp = () => {
	const navigate = useNavigate();
	const toast = useToast({ isClosable: true, status: "error", position: "top" });

	const {
		register,
		handleSubmit,
		formState: { errors: errors }
	} = useForm<SignUpForm>({ resolver: zodResolver(signUpFormSchema) });

	const signUp = useMutation<SignUpData, ProblemDetails, SignUpArgs>(
		"sign-up",
		async (vars) => {
			const reply = await httpClient.post<SignUpData>("User/sign-up", vars.body);
			return reply.data;
		},
		{
			onSuccess: () => {
				toast({ status: "success", title: "You were successfully signed up" });
				navigate("/");
			},
			onError: (error) => {
				toast({ title: error.title });
			}
		}
	);

	return (
		<Flex
			minHeight={"100vh"}
			background={"purple.50"}
			alignItems={"center"}
			justifyContent={"center"}
		>
			<Stack spacing={10}>
				<Heading>Sign up a new account</Heading>
				<Box
					background={"white"}
					rounded={"lg"}
					boxShadow={"lg"}
					padding={6}
				>
					<form
						action={"submit"}
						onSubmit={handleSubmit((form) => signUp.mutate({ body: form }))}
					>
						<Stack spacing={6}>
							<FormControl isInvalid={!!errors.name}>
								<FormLabel htmlFor={"name"}>Name</FormLabel>
								<Input
									type={"text"}
									placeholder={"John Doe"}
									{...register("name")}
								/>
								<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={!!errors.password}>
								<FormLabel htmlFor={"password"}>Password</FormLabel>
								<Input
									type={"password"}
									placeholder={"********"}
									{...register("password")}
								/>
								<FormErrorMessage>{errors.password?.message}</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={!!errors.confirmPassword}>
								<FormLabel htmlFor={"confirmPassword"}>Confirm your password</FormLabel>
								<Input
									type={"password"}
									placeholder={"********"}
									{...register("confirmPassword")}
								/>
								<FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
							</FormControl>
							<Button
								type={"submit"}
								colorScheme={"purple"}
								variant={"solid"}
								isLoading={signUp.isLoading}
							>
								Sign up
							</Button>
							<Button
								type={"button"}
								colorScheme={"purple"}
								variant={"outline"}
								as={ReactLink}
								to={"/sign-in"}
							>
								Sign in
							</Button>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Flex>
	);
};
