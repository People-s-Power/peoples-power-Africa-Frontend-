import { useQuery } from '@apollo/client';
import { apollo } from 'apollo';
import { GET_REVIEWS, NEW_REVIEW } from 'apollo/queries/reviewsQuery';
import axios from 'axios';
import React, { useState } from 'react';
import { Modal } from "rsuite"
import { SERVER_URL } from 'utils/constants';
import { print } from "graphql"
import { useRecoilValue } from "recoil"
import { UserAtom } from "atoms/UserAtom"

const Reviews = ({ open, user, handelClick }: { open: boolean, user: String, handelClick: any }) => {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(0)
  const [body, setBody] = useState("")
  const author = useRecoilValue(UserAtom)
  const [loading, setLoading] = useState(false)

  useQuery(GET_REVIEWS, {
    variables: { userId: user, page: 1, limit: 100 },
    client: apollo,
    onCompleted: (data) => {
      console.log(data)
      setReviews(data.reviews.reviews)
    },
    onError: (err) => console.log(err),
  })

  const sendReview = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(SERVER_URL + "/graphql", {
        // client: apollo,
        query: print(NEW_REVIEW),
        variables: {
          body,
          rating,
          userId: user,
          author: author.id
        },
      })
      setLoading(false)
      handelClick()
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  return (
    <div>
      <Modal open={open} size="md" onClose={handelClick}>
        <Modal.Header>
          <div className="border-b border-gray-200 p-3 w-full flex justify-between">
            <Modal.Title>Rating and Reviews</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='my-10'>
            <div className='w-full'>
              <textarea value={body} onChange={e => setBody(e.target.value)} className='p-2 rounded-md w-full h-20'></textarea>
              <div className="flex my-2 justify-center cursor-pointer">
                <div onClick={() => setRating(1)} className="mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={rating >= 1 ? "#18C73E" : "#D9D9D9"}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
                <div onClick={() => setRating(2)} className="mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={rating >= 2 ? "#18C73E" : "#D9D9D9"}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
                <div onClick={() => setRating(3)} className="mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={rating >= 3 ? "#18C73E" : "#D9D9D9"}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
                <div onClick={() => setRating(4)} className="mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={rating >= 4 ? "#18C73E" : "#D9D9D9"}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
                <div onClick={() => setRating(5)} className="mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill={rating >= 5 ? "#18C73E" : "#D9D9D9"}
                    className="bi bi-star-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </div>
              </div>
              <button onClick={() => sendReview()} className='p-2 w-44 text-center rounded-md bg-warning text-white'>{loading ? "loading..." : "Submit"}</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reviews;