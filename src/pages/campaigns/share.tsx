import ShareChampaign from "components/campaign-comp/ShareChampaign";
import FrontLayout from "layout/FrontLayout";
import React from "react";
import styled from "styled-components";

const ShareCampaignPage = (): JSX.Element => {
	return (
		<FrontLayout showFooter={false}>
			<Wrapper>
				<div className="container">
					<ShareChampaign />
				</div>
			</Wrapper>
		</FrontLayout>
	);
};

export default ShareCampaignPage;
const Wrapper = styled.div``;
