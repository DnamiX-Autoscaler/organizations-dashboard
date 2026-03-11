import { useContext } from "react";
import { MLModelContext } from "./MLModelContextDef";

const useMLModel = () => {
    const ctx = useContext(MLModelContext);
    if (!ctx) throw new Error("useMLModel must be used within MLModelProvider");
    return ctx;
};

export default useMLModel;
