import ShareModal from 'components/modals/ShareModal';
import React, { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { ICampaign } from "types/Applicant.types";
import { BASEURL } from "utils/constants";


export const CampaignShareMenuList = ({
  camp,
  children,
  orgs,
  ...props
}: {
  camp: ICampaign;
  children: React.ReactChild;
  orgs?: any;
}): JSX.Element => {
  const [open, setOpen] = useState(false)

  return (
    <div className="dropdown">
      <span data-bs-toggle="dropdown" {...props}>
        {children}
      </span>
      <ul className="dropdown-menu m-0 ">
        <li className="dropdown-menu-item mb-2 ">
          <button className="btn py-0 d-flex justify-start" onClick={() => setOpen(!open)}>
            <img src="/images/lolo.jpeg" className='w-6 h-6 me-2' alt="" />
            <span>Timeline</span>
          </button>
        </li>
        <li className="dropdown-menu-item mb-2 ">
          <FacebookShareButton url={camp.__typename === 'Petition' ? `${BASEURL}/campaigns/${camp.slug}` : `${BASEURL}/${camp?.__typename}?page=${camp?._id}`}>
            <button className="btn py-0 ">
              <i className="fab fa-facebook-f text-facebook me-2"></i>
              Facebook
            </button>
          </FacebookShareButton>
        </li>
        <li className="dropdown-menu-item mb-2 ">
          <TwitterShareButton url={camp.__typename === 'Petition' ? `${BASEURL}/campaigns/${camp.slug}` : `${BASEURL}/${camp?.__typename}?page=${camp?._id}`}>
            <button className="btn py-0 ">
              <i className="fab fa-twitter text-twitter me-2"></i> Twitter
            </button>
          </TwitterShareButton>
        </li>
        <li className="dropdown-menu-item mb-2 ">
          <WhatsappShareButton url={camp.__typename === 'Petition' ? `${BASEURL}/campaigns/${camp.slug}` : `${BASEURL}/${camp?.__typename}?page=${camp?._id}`}>
            <button className="btn py-0 ">
              <i className="fab fa-whatsapp text-whatsapp me-2 "></i>
              Whatsapp
            </button>
          </WhatsappShareButton>
        </li>

      </ul>
      <ShareModal open={open} handelClick={() => setOpen(!open)} single={camp} orgs={orgs} />
    </div>
  );
};

