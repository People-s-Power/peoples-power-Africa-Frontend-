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
    <>

      <Modal open={show} onClose={onHide} backdrop={true}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p className='fw-bold'>
            {user?.firstName}, please choose which you wish to promote.
          </p>
          <Button
            className='btn btn-warning mr-3'
            onClick={() =>
              router.push(`/promote?slug=${query?.slug}&view=true`)
            }

          >
            Promote Views
          </Button>
          {/* <Button
                className='btn btn-warning mr-3'
                onClick={() =>
                  router.push(`/promote?slug=${query?.slug}&message=true`)
                }
                
                >
                Promote to Inbox
              </Button> */}
          <Button
            className='btn btn-warning'
            onClick={() =>
              router.push(`/promote?slug=${query?.slug}&endorse=true`)
            }
          >
            Promote endorsement
          </Button>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
                className='btn btn-warning'
                onClick={() =>
                  router.push(`/promote?slug=${query?.slug}&view=true`)
                }
                >
                Promote Now
              </Button> */}

          <Button onClick={() => router.push(`/campaigns/share?slug=${query?.slug}`)}>
            Not now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PromoteModalComp;
const Wrapper = styled.div`

`;
