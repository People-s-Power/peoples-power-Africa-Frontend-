import { SignupCom } from "components/auth/signup/Signup";
import React, { useState } from "react";
import { Modal } from "rsuite";
import LoginComp from "../LoginComp";

const LoginModal = ({
	show,
	onHide,
}: {
	show: boolean;
	onHide(): void;
}): JSX.Element => {
	const [isLogin, setIsLogin] = useState(true);
	return (
		<Modal open={show} onClose={onHide} size="sm">
			<Modal.Header>
				<Modal.Title className="fw-bold text-center fs-3">Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{isLogin ? (
					<LoginComp onSuccess={() => window.location.reload()} />
				) : (
					<SignupCom onSucess={(d) => console.log(d)} />
				)}
				<div className="text-center">
					<button
						className="btn text-primary"
						onClick={() => setIsLogin(!isLogin)}
					>
						{isLogin ? "Register instead" : "Login instead"}
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default LoginModal;
