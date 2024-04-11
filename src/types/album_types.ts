import { Album } from "@prisma/client";

export type AlbumId = Pick<Album, "id">;

export type CreateAlbum = Omit<Album, "id">;

export type UpdateAlbum = Partial<CreateAlbum>;
