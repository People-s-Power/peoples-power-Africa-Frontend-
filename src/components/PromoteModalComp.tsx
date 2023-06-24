import { UserAtom } from "atoms/UserAtom";
import router, { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";
import { Button, Modal } from "rsuite";
import styled from "styled-components";




const PromoteModalComp = ({ show, onHide }: { show: boolean, onHide(): void }): JSX.Element => {
  const user = useRecoilValue(UserAtom);

  const { query } = useRouter();

  return (
    <Wrapper className='modal-container'>

      <Modal open={show} onClose={onHide} backdrop={true}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p className='fw-bold'>
            {user?.firstName}, are you sure you {"don't"} want to promote this
            Campaign now? Promoting this campaign will help you gain more
            supporters who will add voices to your campaign, reconsider
            promoting the campaign {user?.firstName}.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn btn-warning'
            onClick={() =>
              router.push(`/promote?slug=${query?.slug}&view=true`)
            }
          >
            Promote Now
          </Button>

          <Button onClick={() => router.push(`/campaigns/share?slug=${query?.slug}`)}>
            Not now
          </Button>
        </Modal.Footer>
      </Modal>
    </Wrapper>
  );
};

export default PromoteModalComp;
const Wrapper = styled.div`

`;
