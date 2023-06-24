import HeaderComp from "components/HeaderComp";
import React from "react";
import styled from "styled-components";

const AdminLayout = ({
	children,
}: {
	children: React.ReactChild;
}): JSX.Element => {
	return (
		<Wrapper>
			<HeaderComp />
			<main className="layout-main">{children}</main>
		</Wrapper>
	);
};

export default AdminLayout;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	.layout-main {
		flex: 1;
	}
`;
