"use client"

interface SubsectionTab {
  id: string
  label: string
}

interface SubsectionTabsProps {
  tabs: SubsectionTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const SubsectionTabs: React.FC<SubsectionTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex justify-center gap-3 mb-12 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 transform ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105 shadow-lg shadow-red-500/30"
              : "bg-[#1e1e1e] text-gray-300 border-2 border-[#333333] hover:border-red-600/50 hover:text-white hover:scale-105"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SubsectionTabs
