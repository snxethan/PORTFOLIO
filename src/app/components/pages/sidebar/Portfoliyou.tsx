"use client";
import Image from "next/image";
import TooltipWrapper from "../../ToolTipWrapper";

export default function Portfoliyou() {
  return (
    <div className="bg-[#1e1e1e] border border-[#333333] hover:border-red-600/50 rounded-xl p-6 shadow-lg text-white max-w-md mx-auto mt-10 text-center transition-transform duration-300 ease-out hover:scale-[1.03]">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 text-transparent bg-clip-text">
        My Capstone
        </h2>
        <div className="w-20 h-[2px] mt-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full" />
      </div>

      <p className="text-gray-400 text-sm mb-4">
        A Portfolio for you, by you.
      </p>

      <TooltipWrapper label="https://portfoliyou.snxethan.dev" url="https://portfoliyou.snxethan.dev">
        <a
          href="https://portfoliyou.snxethan.dev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit my Capstone"
          className="inline-flex items-center justify-center px-4 py-2 mt-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg gap-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
        >
    <Image
      src="https://portfoliyou.snxethan.dev/images/icon/portfoliyou.png"
      alt="Portfoli-YOU Icon"
      width={20}
      height={20}
      className="w-5 h-5 rounded"
    />          
    View Portfoli-YOU
        </a>
      </TooltipWrapper>
    </div>
  );
}
