import axios from "axios";
import React, { Fragment, useState } from "react";
import router from "next/router";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const VerifyToken = (): JSX.Element => {
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);
	const [view, setView] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			await axios.post("//verify-token", { token });
			toast(
				"Your account has been verified. Continue to login with your password",
			);
			router.push("/");
			// router.push(`/?mode=change password&&id=${data}`);
			setLoading(false);
		} catch (error) {
			const e = error as any;
			if (e?.response?.data) {
				toast(e?.response?.data?.message);
			}
			console.log(error);
			setLoading(false);
		}
	};
	return (
		<Fragment>
			{!view ? (
				<div className="container">
					<div className="d-flex flex-column justify-content-end">
						<h2 className="text-secondary fw-bold">Verify token</h2>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="exampleInputEmail" className="form-label">
								Enter the verification code sent to your email address
							</label>
							<input
								type="number"
								className="form-control py-2"
								required
								value={token}
								onChange={(e) => setToken(e.target.value)}
							/>
						</div>

						<button className="btn btn-warning d-block w-100 text-white fw-bold py-2">
							{loading ? "loading..." : "Verify"}
						</button>
					</form>
					<div className="text-center">
						{/*  eslint-disable-next-line react/no-unescaped-entities */}
						Didn't get an email?{" "}
						<button
							className="btn p-0 text-primary"
							onClick={() => setView(!view)}
						>
							Resend email
						</button>
					</div>
				</div>
			) : (
				<ResendVerification onSuccess={() => setView(!view)} />
			)}
			<ToastContainer />
		</Fragment>
	);
};

export default VerifyToken;

const ResendVerification = ({ onSuccess }: { onSuccess(): void }) => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const { data } = await axios.post("//resend-token", { email });
			toast(`Verification message sent to ${email}`);
			onSuccess();
			console.log(data);
			// router.push(`/?mode=change password&&id=${data}`);
		} catch (error) {
			const e = error as any;
			if (e?.response?.data) {
				toast(e?.response?.data?.message);
			}
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container">
			<div className="d-flex flex-column justify-content-end">
				<h2 className="text-secondary fw-bold">Resend verification token</h2>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail" className="form-label">
						Enter the email address you registered your account with
					</label>
					<input
						className="form-control py-2"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<button className="btn btn-warning d-block w-100 text-white fw-bold py-2">
					{loading ? "loading..." : "Send verification code"}
				</button>
			</form>
		</div>
	);
};
