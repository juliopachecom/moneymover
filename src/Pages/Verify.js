import React from 'react';
import featureVideo from "../Assets/Images/MoneyMover.mp4";

function Verify() {
  return (
    <div className="verify-container">
      <video src={featureVideo} width={720} autoPlay loop muted playsInline />
    </div>
  );
}

export { Verify };