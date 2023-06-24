import React, { useState } from "react";
import styled from "styled-components";

const test = (): JSX.Element => {
	const [page, setPage] = useState("One");
	return (
		<Wrapper className="container">
			<div className="wrapper">
				<h1 className="text-center">Test Page</h1>
				<div className="d-flex inner">
					<div className="left">
						<ul>
							<li onClick={() => setPage("One")}>Paragraph 1</li>
							<li onClick={() => setPage("Two")}>Paragraph 2</li>
							<li onClick={() => setPage("Three")}>Paragraph 3</li>
							<li onClick={() => setPage("Four")}>Paragraph 4</li>
						</ul>
					</div>
					<div className="right">
						{page === "One" && <ParagraphComp paragraph="One" />}
						{page === "Two" && <ParagraphComp paragraph="Two" />}
						{page === "Three" && <ParagraphComp paragraph="Three" />}
						{page === "Four" && <ParagraphComp paragraph="Four" />}
					</div>
				</div>
			</div>
		</Wrapper>
	);
};

export default test;

const Wrapper = styled.div`
	margin-top: 2rem;
	.wrapper {
		.inner {
			gap: 2rem;
		}
	}
`;

const ParagraphComp = ({ paragraph }: { paragraph: string }) => {
	return (
		<div>
			<h1>Paragraph{paragraph}</h1>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam vero
				eligendi accusantium velit doloribus repellendus nisi asperiores dolore
				temporibus nihil neque aperiam quo incidunt deserunt, provident, ex
				itaque praesentium ut? Quis nesciunt eligendi laboriosam nam possimus
				magni suscipit vel. Sit!
			</p>
		</div>
	);
};
