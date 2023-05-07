import { type z } from "zod";
import { type signInFormSchema, type signUpFormSchema } from "~/schemas/user.schemas";

export type SignUpForm = z.infer<typeof signUpFormSchema>;
export type SignUpArgs = { body: SignUpForm };
export type SignUpData = {
	id: string;
	name: string;
};

export type SignInForm = z.infer<typeof signInFormSchema>;
export type SignInArgs = { body: SignInForm };
export type SignInData = {
	id: string;
	name: string;
};

export type SelectMeBody = void;
export type SelectMeArgs = void;
export type SelectMeData = {
	id: string;
	name: string;
};
