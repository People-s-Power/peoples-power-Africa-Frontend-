import { atom } from "recoil";
import { IUser } from "types/Applicant.types";

export const UserAtom = atom({
	key: "User-Atom",
	default: null as unknown as Partial<IUser>,
});

// export const UsersAtom = atom({
// 	key: "UsersAtom",
// 	default: [],
// });

export const UserCampaignAtom = atom({
	key: "UserCamp",
	default: [],
});
