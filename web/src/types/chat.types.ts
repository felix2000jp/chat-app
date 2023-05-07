import { type z } from "zod";
import { type insertMessageFormSchema } from "~/schemas/chat.schemas";

export type InsertMessageForm = z.infer<typeof insertMessageFormSchema>;
export type InsertMessageArgs = { body: InsertMessageForm; roomName: string };
export type InsertMessageData = {
	id: string;
	content: string;
	user: {
		id: string;
		name: string;
	};
	room: {
		id: string;
		name: string;
	};
};
