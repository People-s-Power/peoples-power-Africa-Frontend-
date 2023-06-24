import { UserAtom } from "atoms/UserAtom";
import React from "react";
// import { useRecoilValue } from "recoil";
import { Button, Modal } from "rsuite";
import styled from "styled-components";
import { ICampaign } from "types/Applicant.types";
interface Props {
  show: boolean;
  onHide?: boolean
  submit: (event: any) => void;

}


const sendMsgModel = (props: Props): JSX.Element => {

  return (
    <Wrapper className='modal-container'>
      
      <Modal open={props.show} backdrop={true}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
            <div>

            <div>
              <label htmlFor="" className="text-lg font-bold">Title</label>
              <br />
              <input type="text" className="form-input px-4 py-3 outline-0 rounded-xl w-[310px]" />
            </div>
            <div>
              <label htmlFor="" className="text-lg font-bold">Message</label>
              <br />
              <textarea className="w-[310px] form-textarea rounded-xl" name="" id="" ></textarea>
            </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className='btn btn-warning'
                // onClick={() => submit}
                >
                Submit Now
              </Button>
            </Modal.Footer>
          </Modal>
    </Wrapper>
  );
};

export default sendMsgModel;
const Wrapper = styled.div`

`;
