import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

type DashboardHeaderProps = {
  headerSearch: string;
  onSearchChange: (value: string) => void;
  onCreateQuiz: () => void;
  onHome: () => void;
};

const DashboardHeader = ({ headerSearch, onSearchChange, onCreateQuiz, onHome }: DashboardHeaderProps) => (
  <header className="bg-gray-800 border-b border-gray-700 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between">
    <div className="relative flex-1 max-w-md w-full sm:w-auto">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
      <input
        type="text"
        placeholder="Search..."
        value={headerSearch}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
      />
    </div>
    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      <button
        onClick={onHome}
        className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base border border-gray-600"
      >
        <span>Home</span>
      </button>
      <button
        onClick={onCreateQuiz}
        className="flex-1 sm:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <AddIcon fontSize="small" />
        <span>Create Quiz</span>
      </button>
    </div>
  </header>
);

export default DashboardHeader;
