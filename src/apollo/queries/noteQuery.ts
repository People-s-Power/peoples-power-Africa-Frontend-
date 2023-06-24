import { gql } from "@apollo/client";

export const GET_SUBJECTS = gql`
  {
    getSubjects {
      _id
      title
      slug
    }
  }
`;

export const GET_SUBJECT = gql`
  query ($_id: ID, $slug: String) {
    getSubject(_id: $_id, slug: $slug) {
      _id
      title
      slug
      intro
      contents {
        title
        slug
      }
    }
  }
`;

export const GET_CONTENTS_BY_SUBJECT = gql`
  query ($subject: ID) {
    getContentsBySubject(subject: $subject) {
      _id
      slug
      title
    }
  }
`;

export const GET_CONTENT = gql`
  query ($slug: String) {
    getContent(slug: $slug) {
      _id
      slug
      title
      body
    }
  }
`;

export const GET_CONTENTS = gql`
  {
    getContents {
      title
      _id
      slug
    }
  }
`;
