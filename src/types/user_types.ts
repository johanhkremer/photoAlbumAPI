import { User } from "@prisma/client";

export type UserId = Pick<User, "id">;

export type CreateUser = Omit<User, "id">;

export type UpdateUser = Partial<CreateUser>;
