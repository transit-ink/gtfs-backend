import React from "react";

interface CircleLoaderProps {
  text?: string;
}

const CircleLoader: React.FC<CircleLoaderProps> = ({ text }) => {
  return (
    <div className="circle-loader-wrapper">
      <div className="circle-loader"></div>{text || "Loading..."}
    </div>
  );
};

export const CircleLoaderBlock: React.FC<CircleLoaderProps> = ({ text }) => {
  return (
    <div className="circle-loader-block">
      <CircleLoader
        text={text}
      />
    </div>
  );
}

export default CircleLoader; 