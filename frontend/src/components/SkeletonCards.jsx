import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCards = () => {
  const skeletonCount = 10;
  return (
    <div
      style={{
        gridGap: "1em",
        display: "grid",
        gridTemplateColumns: "1, minmax(0px, 80vw))",
        gridAutoRows: "auto",
        padding: "1em",
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Skeleton
          key={index}
          enableAnimation={true}
          inline={true}
          height={200}
          baseColor="#7f7f7f"
          highlightColor="#bebebe"
          borderRadius="2%"
        />
      ))}
    </div>
  );
};

export default SkeletonCards;
