import { gql } from "@apollo/client";

export const GET_THREADS = gql`
  query($search: String, $page: Int) {
    getThreads(search: $search, page: $page) {
      count
      threads {
        _id
        title
        tags
        slug
        excerpt
        author {
          firstName
          lastName
          account_type
          image
          _id
        }
      }
    }
  }
`;

export const GET_THREAD = gql`
  query($slug: String) {
    getThread(slug: $slug) {
      title
      slug
    }
  }
`;
