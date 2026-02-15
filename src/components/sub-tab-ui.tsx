export default function SubTabUI({
  pendingTabs,
  setPendingSubTab,
  pendingSubTab,
}: {
  pendingTabs: {
    label: string;
    value: string;
    count: number;
  }[];
  setPendingSubTab: (value: string) => void;
  pendingSubTab: string;
}) {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center gap-2 bg-muted rounded-lg">
        {pendingTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPendingSubTab(tab.value)}
            className={`rounded-lg px-4 py-1.5 text-xs sm:text-sm h-auto ${pendingSubTab === tab.value ? "bg-sidebar text-white dark:bg-white dark:text-black" : "text-black/70 dark:text-white/70"}`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
}
