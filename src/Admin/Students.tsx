import { useMemo, useCallback } from "react";
import { useAdminStore } from "./store/adminStore";
import { useInfiniteLoopDetector } from "../utils/useInfiniteLoopDetector";
import { SEO } from "../components/SEO";
import { getBreadcrumbStructuredData } from "../utils/structuredData";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UserDetailModal from "./UserDetailModal";

const Students = () => {
  // Debug infinite loops in development (hook handles dev check internally)
  useInfiniteLoopDetector("Students");

  // Select individual slices to keep getSnapshot stable
  const headerSearch = useAdminStore((s) => s.headerSearch);
  const setHeaderSearch = useAdminStore((s) => s.setHeaderSearch);
  const activeStudentTab = useAdminStore((s) => s.activeStudentTab);
  const setActiveStudentTab = useAdminStore((s) => s.setActiveStudentTab);
  const studentSearch = useAdminStore((s) => s.studentSearch);
  const setStudentSearch = useAdminStore((s) => s.setStudentSearch);
  const studentSortBy = useAdminStore((s) => s.studentSortBy);
  const setStudentSortBy = useAdminStore((s) => s.setStudentSortBy);
  const students = useAdminStore((s) => s.students);

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Filter by tab
    if (activeStudentTab !== "All Students") {
      filtered = filtered.filter((s) => s.class === activeStudentTab);
    }

    // Filter by search
    if (studentSearch) {
      const searchLower = studentSearch.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.class.toLowerCase().includes(searchLower)
      );
    }

    // Sort by selected field
    if (studentSortBy === "Name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (studentSortBy === "Class") {
      filtered = [...filtered].sort((a, b) => a.class.localeCompare(b.class));
    } else if (studentSortBy === "Average Score") {
      filtered = [...filtered].sort((a, b) => b.averageScore - a.averageScore);
    }

    return filtered;
  }, [students, activeStudentTab, studentSearch, studentSortBy]);

  const selectedUser = useAdminStore((s) => s.selectedUser);
  const setSelectedUser = useAdminStore((s) => s.setSelectedUser);
  const userDetailModalOpen = useAdminStore((s) => s.userDetailModalOpen);
  const setUserDetailModalOpen = useAdminStore((s) => s.setUserDetailModalOpen);

  const tabs: ("All Students" | "10A" | "10B")[] = useMemo(
    () => ["All Students", "10A", "10B"],
    []
  );

  function handleHeaderSearchChange(e) {
    e.preventDefault();
    console.log(e);
  }

  function handleStudentSearchChange(e) {
    handleHeaderSearchChange(e);
  }

  const handleUserClick = useCallback(
    (user: any) => {
      setSelectedUser(user);
      setUserDetailModalOpen(true);
    },
    [setSelectedUser, setUserDetailModalOpen]
  );

  const handleCloseModal = useCallback(() => {
    setUserDetailModalOpen(false);
    setSelectedUser(null);
  }, [setUserDetailModalOpen, setSelectedUser]);

  const getInitials = useCallback((name: string) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`
      : name[0].toUpperCase();
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 90) return "#10b981";
    if (score >= 70) return "#3b82f6";
    if (score >= 50) return "#f59e0b";
    return "#ef4444";
  }, []);

  const handleTabChange = useCallback(
    (tab: "All Students" | "10A" | "10B") => {
      setActiveStudentTab(tab);
    },
    [setActiveStudentTab]
  );

  const handleSortToggle = useCallback(() => {
    const options = ["Name", "Class", "Average Score"];
    const currentIndex = options.indexOf(studentSortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setStudentSortBy(options[nextIndex]);
  }, [studentSortBy, setStudentSortBy]);

  const breadcrumbs = getBreadcrumbStructuredData([
    { name: "Home", url: "/" },
    { name: "Students", url: "/admin/students" },
  ]);

  return (
    <>
      <SEO
        title="Students"
        description="Manage your students, track their progress, view quiz performance, and analyze results."
        url="/admin/students"
        structuredData={breadcrumbs}
      />
      {/* Top Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
          <input
            type="text"
            placeholder="Search..."
            value={headerSearch}
            onChange={handleHeaderSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex items-center gap-3 ml-4">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <AddIcon fontSize="small" />
            <span>Create Quiz</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <PersonAddIcon fontSize="small" />
            <span>Invite Students</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
            <p className="text-gray-400">
              Manage your students and track their progress
            </p>
          </div>

          {/* Student Directory Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">
              Student Directory
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              View and manage all your students
            </p>

            {/* Tabs and Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Tabs */}
              <div className="flex gap-2 bg-gray-800 rounded-lg p-1 border border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeStudentTab === tab
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fontSize="small"
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={handleStudentSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Sort Filter */}
              <button
                onClick={handleSortToggle}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FilterListIcon fontSize="small" />
                <span>{studentSortBy}</span>
                <KeyboardArrowDownIcon
                  className="text-gray-400"
                  fontSize="small"
                />
              </button>
            </div>

            {/* Student Table */}
            <TableContainer
              component={Paper}
              sx={{
                bgcolor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "0.5rem",
              }}
            >
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#374151" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Class
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Quizzes Taken
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Average Score
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Last Active
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ textAlign: "center", py: 4, color: "#9ca3af" }}
                      >
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <StudentRow
                        key={student.id}
                        student={student}
                        onUserClick={handleUserClick}
                        getInitials={getInitials}
                        getScoreColor={getScoreColor}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        open={userDetailModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </>
  );
};

export default Students;

type StudentRowProps = {
  student: ReturnType<typeof useAdminStore.getState>["students"][number];
  onUserClick: (user: any) => void;
  getInitials: (name: string) => string;
  getScoreColor: (score: number) => string;
};

const StudentRow = ({
  student,
  onUserClick,
  getInitials,
  getScoreColor,
}: StudentRowProps) => {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": { bgcolor: "#2d3748" },
        cursor: "pointer",
      }}
      onClick={() => onUserClick(student)}
    >
      <TableCell sx={{ color: "white", borderColor: "#374151" }}>
        <div className="flex items-center gap-3">
          <Avatar
            sx={{
              bgcolor: "#4f46e5",
              width: 36,
              height: 36,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {getInitials(student.name)}
          </Avatar>
          <div>
            <div className="text-white font-medium">{student.name}</div>
            <div className="text-gray-400 text-sm">{student.subject}</div>
          </div>
        </div>
      </TableCell>
      <TableCell sx={{ color: "white", borderColor: "#374151" }}>
        {student.class}
      </TableCell>
      <TableCell sx={{ color: "white", borderColor: "#374151" }}>
        {student.quizzesTaken}
      </TableCell>
      <TableCell sx={{ color: "white", borderColor: "#374151" }}>
        <Chip
          label={`${student.averageScore}%`}
          sx={{
            bgcolor: `${getScoreColor(student.averageScore)}1A`,
            color: getScoreColor(student.averageScore),
            fontWeight: 600,
          }}
          size="small"
        />
      </TableCell>
      <TableCell sx={{ color: "white", borderColor: "#374151" }}>
        {student.lastActive}
      </TableCell>
      <TableCell
        sx={{
          color: "white",
          borderColor: "#374151",
          display: "flex",
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick(student);
          }}
          sx={{ color: "#9ca3af" }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => e.stopPropagation()}
          sx={{ color: "#9ca3af" }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
