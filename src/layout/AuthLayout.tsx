// import Signup from "pages/signup";
import Indexsvg from "components/icon/Indexsvg";
import React, { Fragment, ReactChild } from "react";
import styled from "styled-components";

const AuthLayout = ({ children }: { children: ReactChild }): JSX.Element => {
	return (
		<Fragment>
			<AuthWrapper>
				<div className="auth-children">
					<div className="inner">
						<div className="auth-container py-2 container">
							<div className="auth-container-toggle-comp">{children}</div>
							<div className="auth-container-right d-none d-md-flex align-items-center">
								{/* <a>
									<Indexsvg />
								</a> */}
							</div>
						</div>
						<div className="auth-footer text-center text-secondary">
							@ {new Date().getFullYear()} all rights reserved
						</div>
					</div>
				</div>
			</AuthWrapper>
		</Fragment>
	);
};

export default AuthLayout;

const AuthWrapper = styled.div`
	min-height: 100vh;
	.auth-children {
		min-height: inherit;
		display: flex;
		justify-content: center;
		align-items: center;

		.auth-container {
			display: flex;
			gap: 2rem;
			align-items: center;
		}
	}
`;
