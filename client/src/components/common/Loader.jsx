import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex  min-h-screen items-center justify-center w-full h-full p-4">
      <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
    </div>
  );
};

export default Loader;
