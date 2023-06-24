import { v4 } from "public-ip";

export const truncateWord = (word: string, length = 20): string => {
	const newWord = word?.split(" ").splice(0, length).join(" ");
	return newWord;
};

export const getIP = async (): Promise<string | null> => {
	try {
		const ip = await v4();

		return ip;
	} catch (error) {
		console.log(error);
		return null;
	}
};
