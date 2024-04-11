import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	// Here be all your seeds 🌱

	const hashedPassword1 = bcrypt.hashSync("abc123", 10);
	const hashedPassword2 = bcrypt.hashSync("password123", 10);
	const hashedPassword3 = bcrypt.hashSync("shield123", 10);
	const hashedPassword4 = bcrypt.hashSync("mjolnir123", 10);

	//User 1
	const user1 = await prisma.user.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			email: "spiderma@marvel.com",
			password: hashedPassword1,
			first_name: "Peter",
			last_name: "Parker",
		},
	});

	//User 2
	const user2 = await prisma.user.upsert({
		where: { id: 2 },
		update: {},
		create: {
			id: 2,
			email: "ironman@starkindustries.com",
			password: hashedPassword2,
			first_name: "Tony",
			last_name: "Stark",
		},
	});

	//User 3
	const user3 = await prisma.user.upsert({
		where: { id: 3 },
		update: {},
		create: {
			id: 3,
			email: "captain@avengers.com",
			password: hashedPassword3,
			first_name: "Steve",
			last_name: "Rogers",
		},
	});

	//User 4
	const user4 = await prisma.user.upsert({
		where: { id: 4 },
		update: {},
		create: {
			id: 4,
			email: "thor@asgard.com",
			password: hashedPassword4,
			first_name: "Thor",
			last_name: "Odinson",
		},
	});

	//Album
	const memeology = await prisma.album.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			title: "Memeology",
			userId: 1,
		},
	});

	//Album för User 2
	const user2Album = await prisma.album.upsert({
		where: { id: 2 },
		update: {},
		create: {
			id: 2,
			title: "Ironman's Memes",
			userId: 2,
		},
	});

	//Foto för Album för User 2
	const user2Photo1 = await prisma.photo.upsert({
		where: { id: 2 },
		update: {},
		create: {
			title: "Ironman meme #1",
			userId: 2,
			url: "https://example.com/ironman-meme-1.jpg",
			comment: "",
		},
	});

	//Photo
	const memeology1 = await prisma.photo.upsert({
		where: { id: 1 },
		update: {},
		create: {
			title: "memeology #1",
			userId: 1,
			url: "https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Flkgt2zi03rg71.jpg",
			comment: "",
		},
	});

	//Foto för Album för User 2
	const user2Photo2 = await prisma.photo.upsert({
		where: { id: 3 },
		update: {},
		create: {
			title: "Ironman meme #2",
			userId: 2,
			url: "https://example.com/ironman-meme-2.jpg",
			comment: "",
		},
	});

	//Album för User 3
	const user3Album = await prisma.album.upsert({
		where: { id: 3 },
		update: {},
		create: {
			id: 3,
			title: "Captain's Memes",
			userId: 3,
		},
	});

	//Foto för Album för User 3
	const user3Photo1 = await prisma.photo.upsert({
		where: { id: 4 },
		update: {},
		create: {
			title: "Captain meme #1",
			userId: 3,
			url: "https://example.com/captain-meme-1.jpg",
			comment: "",
		},
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
