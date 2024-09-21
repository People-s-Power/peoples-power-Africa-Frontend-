export const TOKEN_NAME = "__ed_KEY"
export const SERVER_URL = "https://api.experthubllc.com"
// export const SERVER_URL = "http://localhost:8005"
// export const SERVER_URL = "https://3k3900wh-8005.uks1.devtunnels.ms"
// export const SERVER_URL = "https://rnyak-105-113-20-156.a.free.pinggy.link"
export const HTTP_URI = `${SERVER_URL}/api/v5`
export const BASEURL = process.env.BASE_URL || "http://www.peoplespower.me/"

export const WS_URI = SERVER_URL
export enum CampaignMessage {
	Endorsed = "endorsed",
	Deleted = "deleted",
	Created = "created",
	Updated = "updated",
	liked = "liked",
	shared = "shared",
	unliked = "unliked",
	All = "all-campaign-notice",
}

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""

export enum IEnvironments {
	GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID",
	FX_ACCESS_KEY = "FX_ACCESS_KEY",
	PAYSTACK_PK = "PAYSTACK_PK",
}

export const states = [
	{
		value: "FC",
		label: "Abuja",
	},
	{
		value: "AB",
		label: "Abia",
	},
	{
		value: "AD",
		label: "Adamawa",
	},
	{
		value: "AK",
		label: "Akwa Ibom",
	},
	{
		value: "AN",
		label: "Anambra",
	},
	{
		value: "BA",
		label: "Bauchi",
	},
	{
		value: "BY",
		label: "Bayelsa",
	},
	{
		value: "BE",
		label: "Benue",
	},
	{
		value: "BO",
		label: "Borno",
	},
	{
		value: "CR",
		label: "Cross River",
	},
	{
		value: "DE",
		label: "Delta",
	},
	{
		value: "EB",
		label: "Ebonyi",
	},
	{
		value: "ED",
		label: "Edo",
	},
	{
		value: "EK",
		label: "Ekiti",
	},
	{
		value: "EN",
		label: "Enugu",
	},
	{
		value: "GO",
		label: "Gombe",
	},
	{
		value: "IM",
		label: "Imo",
	},
	{
		value: "JI",
		label: "Jigawa",
	},
	{
		value: "KD",
		label: "Kaduna",
	},
	{
		value: "KN",
		label: "Kano",
	},
	{
		value: "KT",
		label: "Katsina",
	},
	{
		value: "KE",
		label: "Kebbi",
	},
	{
		value: "KO",
		label: "Kogi",
	},
	{
		value: "KW",
		label: "Kwara",
	},
	{
		value: "LA",
		label: "Lagos",
	},
	{
		value: "NA",
		label: "Nassarawa",
	},
	{
		value: "NI",
		label: "Niger",
	},
	{
		value: "OG",
		label: "Ogun",
	},
	{
		value: "ON",
		label: "Ondo",
	},
	{
		value: "OS",
		label: "Osun",
	},
	{
		value: "OY",
		label: "Oyo",
	},
	{
		value: "PL",
		label: "Plateau",
	},
	{
		value: "RI",
		label: "Rivers",
	},
	{
		value: "SO",
		label: "Sokoto",
	},
	{
		value: "TA",
		label: "Taraba",
	},
	{
		value: "YO",
		label: "Yobe",
	},
	{
		value: "ZA",
		label: "Zamfara",
	},
]
