import type { Student } from "../../lib/api/types";
import { Odometer } from "../../components/Charts/Odometer";
import PeopleIcon from "@mui/icons-material/People";

type TopUsersProps = {
  students: Student[];
  loading: boolean;
};

const TopUsers = ({ students, loading }: TopUsersProps) => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-2">Top Users</h2>
      <p className="text-gray-400 text-sm">Users with highest quiz scores</p>
    </div>
    <div className="space-y-3">
      {loading && <div className="text-gray-400 text-sm">Loading users...</div>}
      {students.map((student, index) => (
        <div
          key={student.id}
          className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-4 border border-gray-600"
        >
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
          <PeopleIcon className="text-2xl text-gray-300" />
          <div className="flex-1">
            <h3 className="text-white font-semibold">{student.name}</h3>
            <p className="text-gray-400 text-sm">{student.subject}</p>
          </div>
          <div className="flex items-center gap-2 text-white font-bold">
            <Odometer value={student.score} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopUsers;
