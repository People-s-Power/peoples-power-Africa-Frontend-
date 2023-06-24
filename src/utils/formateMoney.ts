import axios from "axios";
import { CurrencyListEnum } from "components/campaign-comp/PromoteComp";

export const formateMoney = (
	amount: number,
	currency?: CurrencyListEnum,
): string => {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: currency || CurrencyListEnum.NGN,
		// minimumFractionDigits: 2,
		// maximumFractionDigits: 4,
	}).format(amount);
};

export const checkFX = async (currency: CurrencyListEnum): Promise<number> => {
	try {
		const { data } = await axios.post(`/convert`, { currency });
		return Number(Object.values(data).toString());
	} catch (error) {
		console.log(error);
		return 0;
	}
};
