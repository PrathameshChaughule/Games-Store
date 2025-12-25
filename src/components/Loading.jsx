import React from "react";

function Loading() {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full h-screen text-white gap-6">
        <div className="w-16 h-16 border-4 border-orange-500 rounded-lg relative animate-spin">
          <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full top-2 left-2"></div>
          <div className="absolute w-2.5 h-2.5 bg-orange-500 rounded-full bottom-2 right-2"></div>
        </div>
        <p className="font-mono text-sm tracking-wider">Loading Games...</p>
      </div>
    </div>
  );
}

export default Loading;
