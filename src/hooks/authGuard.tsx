import { useQuery } from "@apollo/client";
import { MY_CAMPAIGN } from "apollo/queries/campaignQuery";
import { UserCampaignAtom } from "atoms/UserAtom";
import axios from "axios";
import cookie from "cookie";
import { NextPage, NextPageContext } from "next";
import { AppProps } from "next/app";
import React from "react";
import { useSetRecoilState } from "recoil";
import { IUser } from "types/Applicant.types";
import { TOKEN_NAME } from "utils/constants";
import { apollo } from "apollo";

interface IProps extends AppProps {
	user: IUser;
	children: React.ReactChildren;
	token?: string | undefined;
}

const authGuard = (
	WrappedComponent: any,
): {
	({ children, ...props }: IProps): JSX.Element;
	getInitialProps(
		ctx: NextPageContext,
	): Promise<{ token: string | undefined; user: IUser }>;
} => {
	const MyComp = ({ children, ...props }: IProps) => {
		const setCampaign = useSetRecoilState(UserCampaignAtom);

		console.log(children)

		useQuery(MY_CAMPAIGN, {
			client: apollo,
			onCompleted: (data) => {
				setCampaign(data.myCampaign);
			},
			onError: (err) => console.log(err),
		});
		return <WrappedComponent {...props}>{children}</WrappedComponent>;
	};

	MyComp.getInitialProps = async (ctx: NextPageContext) => {
		// let user: IUser | null = null;
		let cookies;
		let token;
		let user;
		if (ctx?.req && ctx?.req?.headers?.cookie) {
			cookies = cookie.parse(ctx?.req?.headers?.cookie as string);
			// cookies = { __ed: "" };
		}
		if (cookies?.[TOKEN_NAME]) {
			token = cookies[TOKEN_NAME];
			try {
				const { data } = await axios.get("/auth/me", {
					headers: {
						cookie: token || "",
						authorization: "Bearer " + token,
					},
					// withCredentials: true,
				});
				user = data;
			} catch (error: any) {
				console.log(error?.message);

				if (ctx?.res) {
					ctx.res.writeHead(307, { Location: "/?mode=login" });
					ctx.res.end();
				}
			}
		} else {
			if (ctx?.res) {
				ctx.res.writeHead(307, { Location: "/?mode=login" });
				ctx.res.end();
			}
		}

		const props =
			WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx));

		return {
			...props,
			token,
			user,
		};
	};
	return MyComp;
};

export default authGuard;
