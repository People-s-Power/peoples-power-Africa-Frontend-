/* eslint-disable react/no-unescaped-entities */
import "animate.css"
import Link from "next/link"
import React from "react"
import LoginComp from "./LoginComp"
import { useRouter } from "next/router"
import { UserAtom } from "atoms/UserAtom"
import { useRecoilValue } from "recoil"

const LoginPage = (): JSX.Element => {
	const user = useRecoilValue(UserAtom)
	const router = useRouter()

	if (typeof window !== "undefined") {
		localStorage.clear()
		// localStorage.setItem('page', user?.id);
	}

	return (
		<>
			<div className="signup-main">
				<div className="">
					<div className="d-flex flex-column justify-content-end">
						<h2 className="text-secondary fw-bold">Sign In</h2>
						<p className="m-0 mb-3 fs-5">
							Don't have an account
							<Link href="/?mode=signup">
								<a className="text-warning fw-bold c-hand ms-2">create one</a>
							</Link>
						</p>
					</div>
					<p className="fs-5 mb-3">Sign in with your social media accounts for easy syncing and more secure privacy.</p>
					<LoginComp onSuccess={(data) => ((window.location.href = `/feeds`), localStorage.setItem("page", user?.id))} />
					<Link href="/?mode=forgot password">
						<a className="text-decoration-none text-center d-block">Forgot Password</a>
					</Link>
				</div>
			</div>
		</>
	)
}

export default LoginPage
