import { UserAtom } from "atoms/UserAtom";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { Fragment } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { AccountTypeEnum } from "types/Applicant.types";
import { TOKEN_NAME } from "utils/constants";
import router, { useRouter } from "next/router";

const UserMenu = (): JSX.Element => {
	const user = useRecoilValue(UserAtom);
	const logout = async () => {
		Cookies.remove(TOKEN_NAME);
		Cookies.remove("user_id");
		router.push(`/`)
		localStorage.clear()
	};

	return (
		<Wrapper>
			<div className="dropdown dropstart">
				<a className="c-hand" data-bs-toggle="dropdown">
					<img
						src={user?.image}
						alt=""
						className="image rounded-circle mt-2 border border-3 border-warning"
					/>
				</a>
				<ul className="dropdown-menu dropdown-menu-dark bg-primary dropdown-menu-start">
					<li className="dropdown-item">
						<Link href="/mycamp/profile">
							<a className="text-decoration-none text-light c-hand">Settings</a>
						</Link>
					</li>
					<li className="dropdown-item">
						<Link href={`/wallet?page=${user.id}`}>
							<a className="text-decoration-none text-light c-hand">Wallet</a>
						</Link>
					</li>
					{/* <li className="dropdown-item">
						<Link href="/mycamp">
							<a className="text-decoration-none text-light c-hand">Manage</a>
						</Link>
					</li> */}
					{user?.accountType === AccountTypeEnum.Staff && (
						<Fragment>
							<li className="dropdown-item">
								<a
									href="https://teams.peoplespow.com/"
									className="text-decoration-none text-light c-hand"
								>
									Legal Connect
								</a>
							</li>
							<li className="dropdown-item">
								<Link href="/mycamp/manage">
									<a className="text-decoration-none text-light c-hand">
										Manage Campaigns
									</a>
								</Link>
							</li>
						</Fragment>
					)}
					<li className="dropdown-item">
						<a
							className="text-decoration-none text-light c-hand"
							onClick={logout}
						>
							Logout
						</a>
					</li>
				</ul>
			</div>
		</Wrapper>
	);
};

export default UserMenu;

const Wrapper = styled.div`
	.dropdown {
		.image {
			/* width: 100%; */
			width: 2rem;
			height: 2rem;
		}
	}
`;
