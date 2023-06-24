import styled from "styled-components";

export const CardImg = styled.div`
  height: 25vh;
  position: relative;
  overflow: hidden;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const TabStyle = styled.div`
  transition: background 0.5s;
  &:hover {
    background: #cadfcb;
    .t-camp-row {
      .t-camp-btn {
        &-promoted {
          background: #f4a920 !important;
        }
      }
    }
  }
  .t-camp-row {
    border-bottom: 1px solid black;
    .t-camp-img {
      position: relative;
      min-width: 50px;
      min-height: 50px;
      overflow: hidden;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .t-camp-btn {
      .t-camp-btn-promoted {
        background: #c1c1c1;
      }
    }
  }
`;

export const Table = styled.div`
  gap: 2rem;
  .left {
    flex: 0.7;
    @media screen and (max-width: 991px) {
      flex: 1;
    }
    @media screen and (max-width: 1300px) {
      .ov-x {
        overflow-x: auto;
        &::-webkit-scrollbar {
          background: transparent;
          height: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background: grey;
        }
      }
    }
  }
  .right {
    flex: 0.3;
    @media screen and (max-width: 991px) {
      flex: 1;
    }
    .updates {
      &-head {
        border-radius: 15px 15px 0px 0px;
      }
    }
  }
`;

export const Update = styled.div`
  transition: background 0.5s;
  &:hover {
    background: #cadfcb;
  }
  .update-list {
    .updates {
      font-size: 0.8rem;
      span,
      b {
        font-size: inherit;
      }
      .update-img {
        &-wrap {
          width: 2rem;
          height: 2rem;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .update-txt {
      }
      .left {
        flex: 0.2;
      }
      .right {
        flex: 1;
      }
    }
    @media screen and (max-width: 768px) {
      .updates {
        /* background: red; */
        overflow-x: auto;
        &::-webkit-scrollbar {
          background: transparent;
          height: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background: grey;
        }
      }
    }
  }
`;

export const Div = styled.div`
  gap: 1rem;
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
  }
`;

export const Contact = styled.div`
  transform-origin: 0 0;
  /* transform: translateY(10rem); */
  border-radius: 15px;
  -webkit-box-shadow: -1px -1px 7px 4px rgba(0, 0, 0, 0.22);
  box-shadow: -1px -1px 7px 4px rgba(0, 0, 0, 0.22);
  gap: 1rem;
  .left {
    flex: 0.3;

    @media screen and (max-width: 768px) {
      flex: 1;
      border-right: 0 !important;
    }
  }
  .right {
    flex: 0.7;
    @media screen and (max-width: 768px) {
      flex: 1;

      .right_ {
        width: 100%;
      }
    }
    &_ {
      width: 90%;
    }
  }
`;

export const Wrapper = styled.div`
  .main {
    gap: 1rem;
    .left {
      flex: 1;
      overflow-x: auto;
      /* box-shadow: 0px 0px 30px 0px rgba(50, 50, 50, 0.29); */
      &::-webkit-scrollbar {
        background: transparent;
        height: 10px;
        border-radius: 25px;
      }
      &::-webkit-scrollbar-thumb {
        background: #f6b333;
        border-radius: 25px;
      }
      &::-webkit-scrollbar-button {
        height: 10px;
        background: #0f401c;
        height: 10px;
        width: 10px;
        border-radius: 100%;
        cursor: pointer;
      }
      @media screen and (max-width: 768px) {
        flex: 1;
      }
    }
    .right {
      width: 100%;
      max-width: 20rem;
      @media screen and (max-width: 768px) {
        flex: 1;
        max-width: none;
      }
    }
  }
`;

export const Main = styled.div`
  min-height: 80vh;
  .signup-main_ {
    min-height: inherit;
    gap: 1rem;
    .left {
      flex: 1;
    }
    .right {
      flex: 1;
    }
  }
`;
