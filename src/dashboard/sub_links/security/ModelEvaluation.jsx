import React from "react";

const ModelEvaluation = () => {
  return (
    <div className="w-full h-full">

     

      {/* Embedded external dashboard */}
      <div className="w-full h-[calc(100vh-120px)]">
        <iframe
          src="http://157.173.111.84:8080/"
          title="Model Evaluation Dashboard"
          className="w-full h-full border-0"
        />
      </div>

    </div>
  );
};

export default ModelEvaluation;