import { type AxiosError } from "axios";
import { z } from "zod";

const problemDetailsSchema = z.object({
	type: z.string().url("error type should be an url"),
	status: z.number().min(400, "error code cannot be less than 400").max(599, "error code cannot be more than 599"),
	title: z.string().nonempty("error title is required")
});

export const handleError = (error: unknown) => {
	const axiosError = error as AxiosError;
	const parsed = problemDetailsSchema.safeParse(axiosError.response?.data);

	if (parsed.success) throw parsed.data;
	throw { statusCode: 500, title: "A surprising error occurred" };
};

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
