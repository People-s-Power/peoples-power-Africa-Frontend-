import axios from "axios";
import React, { useState } from "react";
import { Loader } from "rsuite";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordComp = (): JSX.Element => {
	const [loading, setLoading] = useState(false);
	const [password, setPassword] = useState({
		oldPassword: "",
		newPassword: "",
		newPassword2: "",
	});

	const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPassword({ ...password, [name]: value });
	};
	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (password.newPassword !== password.newPassword2)
			return toast("Passwords do not match");
		try {
			await axios.post("/auth/change-password", password);
			toast("Password changed");
			setLoading(false);
		} catch (error) {
			const err: any = error;
			console.log({ error });
			if (err?.response?.data) {
				toast.warn(err?.response?.data?.message);
			}
			setLoading(false);
		}
	};
	return (
		<form onSubmit={handleSubmit} className="container">
			<div className="row mb-2">
				<label className="p-0 mb-1 " htmlFor="currentpassword">
					Current Password
				</label>
				<input
					type="password"
					autoComplete="off"
					className="form-control py-2"
					required
					onChange={handleValue}
					name="oldPassword"
					id="currentpassword"
				/>
			</div>
			<div className="row mb-2">
				<label className="p-0 mb-1 " htmlFor="newPassword">
					New Password
				</label>
				<input
					type="password"
					autoComplete="off"
					className="form-control py-2"
					required
					onChange={handleValue}
					name="newPassword"
					id="newPassword"
				/>
			</div>
			<div className="row mb-3">
				<label className="p-0 mb-1 " htmlFor="confirmnewpassword">
					Confirm New Password
				</label>
				<input
					type="password"
					autoComplete="off"
					className="form-control py-2 "
					required
					onChange={handleValue}
					name="newPassword2"
					id="confirmnewpassword"
				/>
			</div>
			<div
				className=" d-flex flex-column flex-sm-row align-items-start"
				style={{ gap: "1rem" }}
			>
				<button
					disabled={loading}
					className="btn m-0 btn-warning text-white px-4 py-2 rounded-pill fw-bold"
				>
					{loading ? <Loader content="processing...." /> : "Save Changes"}
				</button>
				<button className="btn  rounded-pill text-warning  px-4 py-2 border-warning border-2 fw-bold">
					Cancel
				</button>
			</div>
			<ToastContainer />
		</form>
	);
};

export default ChangePasswordComp;
