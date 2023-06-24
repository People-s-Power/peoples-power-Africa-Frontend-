import * as React from "react";

function SvgComponent(): JSX.Element {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2.5a2.5 2.5 0 11.603 1.629l-6.718 3.12c.155.489.155 1.014 0 1.504l6.718 3.12a2.5 2.5 0 11-.488.876l-6.718-3.12a2.5 2.5 0 110-3.256l6.718-3.12A2.498 2.498 0 0111 2.5z"
        fill="#18C73E"
      />
    </svg>
  );
}

export default SvgComponent;
