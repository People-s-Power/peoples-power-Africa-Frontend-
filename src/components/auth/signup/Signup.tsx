import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import cookie from "js-cookie";
import { HTTP_URI, TOKEN_NAME } from "utils/constants";
import { useRouter } from 'next/router'
import { Loader } from "rsuite";
import GoogleAuthComp from "../GoogleAuth";
import Facebook from "../Facebook";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterComp = (): JSX.Element => {
	const router = useRouter()

	return (
		<div className="signup-main">
			<div className="d-flex flex-column justify-content-end">
				<h2 className="text-secondary fw-bold">Sign Up</h2>
				<p className="m-0 mb-3 fs-5">
					Already have an account
					<Link href="/">
						<a className="text-warning fw-bold c-hand ms-2">Log In </a>
					</Link>
				</p>
			</div>
			<p className="fs-5 mb-3">
				Sign up with your social media accounts for easy syncing and more secure
				privacy.
			</p>
			<div className="lg:w-1/2 mx-auto">
				<h4 className="text-center">Sign Up</h4>
				<div className="flex justify-center center w-[88px] m-auto">
					{/* <Facebook onSuccess={() => (window.location.href = "/mycamp")} /> */}
					<GoogleAuthComp onSuccess={() => (window.location.href = "/buildprofile")} />
				</div>
				<SignupCom onSucess={(d) => console.log(d)} />
			</div>
			<Link href="/?mode=login">
				<a className="text-decoration-none text-center d-block">
					Login instead
				</a>
			</Link>
		</div>
	);
};

export default RegisterComp;

export const SignupCom = ({
	onSucess,
}: {
	onSucess(data?: any): void;
}): JSX.Element => {
	// const router = useRouter()
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState({
		email: "",
		password: "",
		// password2: "",
		name: "",
	});
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setInfo({
			...info,
			[name]: value,
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!info.email || !info.password) return;
		// if (info.password !== info.password2) return alert("Passwords must match");
		setLoading(true);
		try {
			const { data } = await axios.post(HTTP_URI + "/auth/register", info);
			cookie.set("user_id", data?.id);

			cookie.set(TOKEN_NAME, data?.token);
			// router.push("/mycamp/profile");
			window.location.href = '/buildprofile'
			onSucess(data);
			setLoading(false);
		} catch (error) {
			const e = error as any;
			toast.warn(error && e?.response?.data?.message);
			setLoading(false);
			console.log({ error });
		}
	};

	return (
		<div className="form">
			<form className="" onSubmit={handleLogin}>
				<div className="mb-1">
					<label className="form-label">Full Name</label>
					<input
						type="text"
						name="name"
						className="form-control py-2 h-10"
						value={info.name}
						onChange={handleChange}
						required
						placeholder="Enter your Name"
					/>
				</div>

				<div className="mb-1">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Email address
					</label>
					<input
						type="email"
						name="email"
						className="form-control py-2 h-10"
						value={info.email}
						onChange={handleChange}
						required
						placeholder="Your Email Address"
					/>
				</div>
				<div className="mb-1 relative">
					<label htmlFor="exampleInputPassword1" className="form-label">
						Password
					</label>
					<input
						type={passwordShown ? "text" : "password"}
						className="form-control py-2 h-10"
						name="password"
						value={info.password}
						onChange={handleChange}
						required
						placeholder="Password"
					/>
					<div className="absolute top-10 right-6" onClick={togglePassword}>
						<i className="fa fa-eye"></i>
					</div>
				</div>
				{/* <div className="mb-3">
					<label htmlFor="exampleInputPassword1" className="form-label">
						Confirm Password
					</label>
					<input
						type="password"
						className="form-control py-2"
						name="password2"
						value={info.password2}
						onChange={handleChange}
						required
					/>
				</div> */}
				<div className="mb-3 flex">
					<input className="mr-3 mt-3" type="checkbox" required />
					<label className="p-1" htmlFor="">I have read and accept <Link href="/privacy">the terms and condition and privacy policy</Link> </label>
				</div>
				<button
					disabled={loading}
					className="btn btn-warning d-block w-100 text-white fw-bold py-2"
				>
					{loading ? <Loader content="Loading...." /> : "Sign up"}
				</button>
			</form>
			<ToastContainer />
		</div>
	);
};
