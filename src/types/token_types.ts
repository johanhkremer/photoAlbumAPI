//JWT payload

//Types for JWT-token
//"sub" stands for "subject" and it represents the standard identifier for the subject of the JWT.
export type JwtPayload = {
	sub: number;
	name: string;
	email: string;
};

//Type for refreshed JWT-token
export type JwtRefreshPayload = Pick<JwtPayload, "sub">;
