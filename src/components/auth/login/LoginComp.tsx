import axios from "axios";
import cookie from "js-cookie";
import router from "next/router";
import React, { useState } from "react";
import { Loader } from "rsuite";
import { TOKEN_NAME } from "utils/constants";
import GoogleAuthComp from "../GoogleAuth";
import Facebook from "../Facebook";
import { useRouter } from 'next/router'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginComp = ({
	onSuccess,
}: {
	onSuccess(e?: { id: string; token: string }): void;
}): JSX.Element => {
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState({
		email: "",
		password: "",
	});
	const router = useRouter()

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!info.email || !info.password) return;
		setLoading(true);
		// axios.post("https://apiv5-xacq2.ondigitalocean.app/api/v3/auth/login", info)
		// 	.then(response => {
		// 		console.log(response.data)
		// 		cookie.set("user_id", response.data?.id);
		// 		cookie.set(TOKEN_NAME, response.data?.token);
		// 		// onSuccess(response.data);
		// 		router.push(`/user?page=${response.data.id}`)
		// 		toast("Logged In successfully")
		// 	})
		// 	.catch(error => {
		// 		console.log(error)
		// 		toast(error)
		// 	})

		try {
			const { data } = await axios.post("/auth/login", info);
			cookie.set("user_id", data?.id);
			cookie.set(TOKEN_NAME, data?.token);
			// cookie.set("user_id", data.id);
			onSuccess(data);
			toast("Logged In successfully")
			console.log(data)
		} catch (error) {
			const e = error as any;
			console.log({ error });
			toast(e?.response?.data?.message);
			setLoading(false);
		}
	};

	return (
		<div>
			<h4 className="text-center">Login with</h4>
			<div className="flex center w-[88px] m-auto">
				<Facebook onSuccess={() => onSuccess()} />
				<GoogleAuthComp onSuccess={() => onSuccess()} />
			</div>
			<form onSubmit={handleLogin}>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control py-2"
						value={info.email}
						onChange={(e) => setInfo({ ...info, email: e.target.value })}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputPassword1" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control py-2"
						value={info.password}
						onChange={(e) => setInfo({ ...info, password: e.target.value })}
					/>
				</div>

				<button
					disabled={loading}
					className="btn btn-warning d-block w-100 text-white fw-bold py-2"
				>
					{loading ? <Loader content="Loading...." /> : "Log In"}
				</button>
			</form>
			<ToastContainer />
		</div>
	);
};

export default LoginComp;
