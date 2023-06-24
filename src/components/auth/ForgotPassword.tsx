import axios from "axios";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import router from "next/router";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = (): JSX.Element => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			await axios.post("/auth/forgot-password", { email });
			toast("An email has been sent to you with your verification code");
			router.push("/?mode=verify token");
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};
	return (
		<div className="container">
			<div className="d-flex flex-column justify-content-end">
				<h2 className="text-secondary fw-bold">Forgot Password</h2>
				<p className="m-0 mb-3 fs-5">
					Already have an account ?
					<Link href="/auth?mode=login">
						<a className="text-warning fw-bold c-hand"> login</a>
					</Link>
				</p>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Enter your registered email address
					</label>
					<input
						type="email"
						className="form-control py-2"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<button className="btn btn-warning d-block w-100 text-white fw-bold py-2">
					Send verification
				</button>
				<Link href="/auth?mode=login">
					<a className="text-decoration-none text-center d-block">
						{loading ? "process..." : "Login instead"}
					</a>
				</Link>
			</form>
			<ToastContainer />
		</div>
	);
};

export default ForgotPassword;
