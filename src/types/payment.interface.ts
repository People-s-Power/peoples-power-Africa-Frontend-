export enum PaymentPurposeEnum {
	VIEWS = "Promote views",
	ENDORSE = "Promote Endorsements",
	PROMOTION = "Promotion",
	MESSAGE = "Promote in Messages",
	APPLICANT_REGISTRATION = "New Applicant Registration",
}

export interface PaystackPaymentResponse {
	message: string;
	redirecturl: string;
	reference: string;
	status: string;
	trans: string;
	transaction: string;
	trxref: string;
}
