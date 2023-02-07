import { Skeleton } from "@chakra-ui/react";
import React from "react";

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      {[...Array(count)].map((_: any, index) => (
        <Skeleton
          key={index}
          startColor="blackAlpha.400"
          borderRadius={4}
          endColor="whiteAlpha.300"
          height={height}
          width={{base: "full"}}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
