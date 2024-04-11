import { Photo } from "@prisma/client";

export type PhotoId = Pick<Photo, "id">;

export type CreatePhoto = Omit<Photo, "id">;

export type UpdatePhoto = Partial<CreatePhoto>;
