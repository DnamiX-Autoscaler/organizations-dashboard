import React from "react";

const AttackSimulation = () => {
  return (
    <div className="w-full h-full">

      

      <div className="w-full h-[calc(100vh-120px)]">
        <iframe
          src="http://157.173.111.84:3004/"
          title="Attack Simulation Dashboard"
          className="w-full h-full border-0"
        />
      </div>

    </div>
  );
};

export default AttackSimulation;