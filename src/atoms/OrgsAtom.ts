import { atom } from "recoil"
import { IOrg, IUser } from "types/Applicant.types"

export const orgDataState = atom({
	key: "OrgData",
	default: null as unknown as Partial<IUser>,
})

export const OrgsState = atom({
	key: "OrgsState",
	default: null as unknown as Partial<IOrg[]>,
})
