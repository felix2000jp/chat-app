import { type z } from "zod";
import { type insertRoomFormSchema, type selectRoomFormSchema } from "~/schemas/room.schemas";

export type InsertRoomForm = z.infer<typeof insertRoomFormSchema>;
export type InsertRoomArgs = { body: InsertRoomForm };
export type InsertRoomData = {
	id: string;
	name: string;
};

export type SelectRoomForm = z.infer<typeof selectRoomFormSchema>;
export type SelectRoomArgs = { name: string };
export type SelectRoomData = {
	id: string;
	name: string;
};
