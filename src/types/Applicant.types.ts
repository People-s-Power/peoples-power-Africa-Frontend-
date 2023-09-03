import { Document } from "mongoose"
export enum StaffRoleEnum {
	Admin = "Admin",
	Rep = "Rep",
	LegalWorld = "LegalWorld",
	Lawyer = "Lawyer",
	Draft = "Draft",
	Suppervisor = "Supervisor",
	Campaigner = "Campaigner",
	User = "User",
}

export enum AccountTypeEnum {
	Campaigner = "Campaigner",
	Staff = "Staff",
	Applicant = "Applicant",
	Contact = "Contact",
}

export interface ViewerType {
	id: number
	country: string
}

export interface IUser extends Document {
	name: string
	accountType: AccountTypeEnum
	image: string
	firstName: string
	lastName: string
	otherName: string
	email: string
	password: string
	phone: string
	emailToken: string
	emailVerified: boolean
	isActive: boolean
	role: StaffRoleEnum | string
	address: string
	admin: IUser
	userId: IUser
	applicants: IApplicant[]
	reportCount: number
	applicantCount: number
	bankName: string
	accountNumber: string
	accountName: string
	country: string
	state: string
	city: string
	followersCount: string
	followingCount: string
	description: string
	followers: string[]
	following: string[]
	orgOperating: string[]
	author: string
	interests: string[]
}

export interface IOrg extends Document {
	author: string
	name: string
	linkedIn: string
	facebook: string
	image: string
	email: string
	password: string
	phone: string
	instagram: string
	twitter: string
	following: string[]
	followers: string[]
	followersCount: number
	followingCount: number
	country: string
	state: string
	city: string
	id: string
	website: string
}

export interface IApplicant extends Document {
	name: string
	email: string
	phone: string
	gender: string
	address: string
	breach_type: string
	inPrison: boolean
	daysPlus: boolean
	monthsPlus: boolean
	arrested_on: string
	arrested_at: string
	arraigned_at: string
	arraigned_on: string
	offence_charged: string
	offence_suspected: string
	case_mates: number
	itinerary: string
	station: string
	station2: string
	station_duration: number
	station2_duration: number
	state_origin: string
	state_residence: string
	state_arrest: string
	state_arraigned: string
	adjournment_date: Date
	charge_no: string
	lga: string
	image: string
	beaten: string
	injured: string
	bail_amount: number
	dpp: string
	detention_cost_explained: string
	caseType: string
	app_id: string
	division: string
	first_accused: string
	amount_paid: number
	rep: IUser | string
	lawyer: IUser | string
	print_ready: boolean
	contact_form: string
}

export interface IAffidavit extends Document {
	name: string
	address: string
	title: string
	religion: string
	occupation: string
	rel: string
	gender: string
	applicant_id: IApplicant | string
}

export interface IRelative extends Document {
	name: string
	phone: string
	rel: string
	applicant_id: IApplicant | string
}

export interface IExhibit extends Document {
	name: string
	image: string
	applicant_id: IApplicant | string
}

export interface IReport extends Document {
	applicant_id: IApplicant | string
	author: IUser | string
	title: string
	status: boolean
	content: string
	createdAt: Date
	comments: IRepComment[]
}

export interface IRepComment extends Document {
	author: IUser | string
	content: string
	status: boolean
	report: IReport | string
	createdAt: Date
}

enum CampaignStatusEnum {
	Active = "Active",
	Pending = "Pending",
	Finished = "Finished",
	Draft = "Draft",
}

export interface ICampaign extends Document {
  asset: any
  __typename: string
	name: string
	caption: string
	title: string
	video: string
	image: string
	picture: string
	aim: string
	target: string
	body: string
	slug: string
	status: CampaignStatusEnum
	createdAt: string
	updatedAt: Date
	addedFrom: string
	category: string
	excerpt: string
	likes: string[]
	likeCount: number
	endorsements: IEndorsement[]
	promoted: boolean
	views: IViews[]
	checked?: boolean
	authorName: string
	authorId: string
	authorImg: string
	id: string
	numberOfPaidViewsCount: any
}

export interface IViews {
	id: string
	user: IUser
	country: string
	sessionId: string
}

export interface IEndorsement extends Document {
	author: IUser
	body: string
	campaign: ICampaign | string
	likes: string[]
	createdAt: Date
	updatedAt: Date
}

export interface ICampaignNotice {
	action: string
	author: IUser
	data: ICampaign
	createdAt: Date
	read: boolean
}

export interface IMage {
	id: string
	_id: string
	createdAt: Date
	updatedAt: Date
	name: string
	alternativeText: string
	caption: string
	width: number
	height: number
	formats: JSON
	hash: string
	ext: string
	mime: string
	size: number
	url: string
	previewUrl: string
	provider: string
}

export interface Strapi_Socials {
	facebook: string
	twitter: string
	instagram: string
	linkedin: string
}

export interface Strapi_Rep {
	id: string
	name: string
	state: string
	image: IMage
	socials: Strapi_Socials
}

export interface Strapi_Lawyer {
	id: string
	name: string
	state: string
	image: IMage
	socials: Strapi_Socials
}

export interface Strapi_Single_Campaign {
	id: string
	title: string
	end_date: Date
	image: IMage
}

export interface Strapi_Testimony {
	id: string
	author: string
	company: string
	job_position: string
	body: string
	// image: IMage;
	image: string
}

export interface Strapi_About {
	who_we_are: string
	what_we_do: string
	what_we_do_image: IMage
	vision: string
	goal: string
}

export interface Strapi_Meta {
	title: string
	about: string
	phone: string
	address: string
	email: string
	logo: IMage
	socials: Strapi_Socials
}
