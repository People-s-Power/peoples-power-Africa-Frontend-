import React from "react";
import axios from "axios";
import ChangePassword from "components/auth/ChangePassword";
import ForgotPassword from "components/auth/ForgotPassword";
import Login from "components/auth/login/Login";
import Signup from "components/auth/signup/Signup";
import VerifyToken from "components/auth/VerifyToken";
import AuthLayout from "layout/AuthLayout";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

enum QueryOptions {
	VERIFY_TOKEN = "verify token",
	FORGOT_PASSWORD = "forgot password",
	CHANGE_PASSWORD = "change password",
	LOGIN = "login",
	SIGNUP = "signup",
}

const AuthPage = (): JSX.Element => {
	const { query } = useRouter();

	const mode = query?.mode || "login";
	if (typeof window !== 'undefined') {
		localStorage.clear()
	}
	return (
		<AuthLayout>
			<>
				{mode === QueryOptions.LOGIN && <Login />}
				{mode === QueryOptions.SIGNUP && <Signup />}
				{mode === QueryOptions.FORGOT_PASSWORD && <ForgotPassword />}
				{mode === QueryOptions.VERIFY_TOKEN && <VerifyToken />}
				{mode === QueryOptions.CHANGE_PASSWORD && <ChangePassword />}
			</>
		</AuthLayout>
	);
};

export default AuthPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const mode = ctx?.query?.mode;
		const token = ctx?.query?.token;

		if (mode === QueryOptions.VERIFY_TOKEN) {
			const { data } = await axios.post("/auth/verify-token", token);
			const id = data || null;

			if (data) {
				return {
					redirect: {
						permanent: false,
						destination: "/auth?mode=login",
					},
				};
			}
			return {
				props: {
					auth: id,
				},
			};
		} else {
			return {
				props: {
					auth: null,
				},
			};
		}
	} catch (error) {
		console.log(error);
		return {
			props: {
				auth: null,
			},
		};
	}
};
