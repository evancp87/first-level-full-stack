import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NewGameSkeletonCard = () => {
  const skeletonCount = 3;
  return (
    <div
      style={{
        gridGap: "1em",
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0px, 100vw))",
        gridAutoRows: "auto",
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Skeleton
          key={index}
          enableAnimation={true}
          inline={true}
          height={250}
          baseColor="#7f7f7f"
          highlightColor="#bebebe"
          borderRadius="10%"
        />
      ))}
    </div>
  );
};

export default NewGameSkeletonCard;
