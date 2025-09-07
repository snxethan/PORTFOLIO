/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",

    // Scan the library (source + compiled)
    "./node_modules/@snxethan/snex-components/**/*.{js,mjs,ts,jsx,tsx}",
    "./node_modules/@snxethan/snex-components/dist/**/*.{js,mjs,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Your components use these animation utilities:
      keyframes: {
        elasticIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        elasticOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        "elastic-in": "elasticIn .3s cubic-bezier(.2,.8,.2,1)",
        "elastic-out": "elasticOut .3s cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fadeIn .2s ease-out",
      },
    },
  },
  plugins: [],

  // Safety net in case the glob still misses something
  safelist: [
    // common in your lib
    "relative","group","inline-block","w-full","max-w-[90vw]","w-[220px]","h-[260px]",
    "bg-[#1a1a1a]","bg-[#222222]","bg-[#111]","bg-black/50","bg-black/60",
    "border","border-[#333]","rounded","rounded-md","rounded-xl","shadow-md","shadow-lg","shadow-xl",
    "p-2","p-3","p-4","p-6","p-8","px-2","px-4","py-1","py-2",
    "text-white","text-gray-100","text-gray-200","text-gray-300","text-gray-400","text-white/70",
    "text-xs","text-sm","text-xl","text-2xl","text-3xl","font-medium","font-semibold",
    "flex","items-center","justify-center","justify-between","gap-2","gap-3","gap-4","flex-col",
    "absolute","fixed","inset-0","bottom-0","bottom-full","left-0","right-0","left-1/2",
    "-translate-x-1/2","translate-x-0","opacity-100","scale-100",
    "z-50","overflow-hidden","overflow-y-auto","backdrop-blur-sm",
    "truncate","max-w-[140px]",
    "bg-gradient-to-r","from-red-600","to-red-500","hover:from-red-500","hover:to-red-400",
    "bg-gradient-to-t","from-black/80","to-transparent",
    "hover:text-red-500","text-white/70",
    "border-b",

    // animations your components use
    "animate-elastic-in","animate-elastic-out","animate-fade-in",

    // responsive bits seen in the code
    "sm:p-4",
  ],
};
