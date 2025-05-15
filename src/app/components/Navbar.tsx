interface NavbarProps {
  onTabChange: (tab: string) => void;
  activeTab: string | null;
}

const Navbar = ({ onTabChange, activeTab }: NavbarProps) => {
  const tabs = ["about", "resume", "portfolio"];
  const isLoading = !activeTab;

  return (
    <nav className="w-full bg-[#222222] py-4 fixed top-0 left-0 z-50 lg:static lg:top-auto lg:left-auto lg:z-0">
      <div className="container mx-auto flex items-center justify-center">
        {isLoading ? (
          <ul className="flex space-x-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <li key={i}>
                <div className="w-20 h-8 bg-[#333333] rounded-lg" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex space-x-4">
            {tabs.map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => onTabChange(tab)}
                  className={`capitalize px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg"
                      : "text-gray-300 hover:bg-[#333333] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
