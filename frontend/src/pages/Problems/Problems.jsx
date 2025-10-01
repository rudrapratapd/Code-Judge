import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetAllProblemsQuery } from "../../redux/api/problemAPI.js";
import Pagination from "../../components/Pagination.jsx";
import PageLoader from "../../components/PageLoader.jsx";

const Problems = () => {
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("card");

  const { data, isLoading, isFetching, isError } = useGetAllProblemsQuery({
    page: currentPage,
    search,
    difficulty: selectedDifficulty,
    tag: "",
    status: selectedStatus,
  });

  const problems = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen px-4 py-10">
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      <Filters
        search={search}
        setSearch={setSearch}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        setCurrentPage={setCurrentPage}
      />

      {(isLoading || isFetching) && <SkeletonLoader viewMode={viewMode} />}

      {isError && (
        <div className="text-center text-red-500 font-medium py-10">
          Failed to fetch problems. Please try again later.
        </div>
      )}

      {!isLoading && !isFetching && !isError && (
        <>
          {viewMode === "card" ? (
            <CardView problems={problems} />
          ) : (
            <TableView problems={problems} />
          )}

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Problems;

// ================= Header =================
const Header = ({ viewMode, setViewMode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
  >
    <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
      💼 DSA Problems
    </h1>

    <button
      onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg font-medium transition transform hover:scale-105 cursor-pointer"
    >
      {viewMode === "card" ? "Table View" : "Card View"}
    </button>
  </motion.div>
);

// ================= Filters =================
const Filters = ({
  search,
  setSearch,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedStatus,
  setSelectedStatus,
  setCurrentPage,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex flex-col gap-4 mb-8 md:flex-row md:justify-between md:items-center"
  >
    <input
      type="text"
      placeholder="🔍 Search problems by name or tag..."
      className="w-full md:w-1/3 px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />

    <div className="flex flex-wrap gap-2 justify-end">
      <select
        value={selectedDifficulty}
        onChange={(e) => {
          setSelectedDifficulty(e.target.value);
          setCurrentPage(1);
        }}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 shadow-md cursor-pointer"
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => {
          setSelectedStatus(e.target.value);
          setCurrentPage(1);
        }}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 shadow-md cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="solved">✅ Solved</option>
        <option value="unsolved">⭕ Unsolved</option>
      </select>
    </div>
  </motion.div>
);

// ================= Card View =================
const CardView = ({ problems }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {problems.map((problem) => (
      <ProblemCard key={problem._id} problem={problem} />
    ))}
  </div>
);

const ProblemCard = ({ problem }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium uppercase tracking-wide ${
              problem.difficulty === "Easy"
                ? "bg-green-600"
                : problem.difficulty === "Medium"
                ? "bg-yellow-500 text-black"
                : "bg-red-600"
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {problem.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-700 text-sm px-2 py-0.5 rounded-full text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <span
          className={`text-sm font-medium ${
            problem.isSolved ? "text-green-400" : "text-red-400"
          }`}
        >
          {problem.isSolved ? "✅ Solved" : "⭕ Unsolved"}
        </span>
        <Link
          to={`/problems/${problem._id}`}
          className="text-blue-400 hover:underline text-sm"
        >
          Solve →
        </Link>
      </div>
    </div>
  );
};

// ================= Table View =================
const TableView = ({ problems }) => (
  <div className="overflow-x-auto mt-4 bg-gray-800 rounded-xl shadow-xl">
    <table className="min-w-full text-sm text-left">
      <thead className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
        <tr>
          <th className="px-6 py-3">Problem</th>
          <th className="px-6 py-3">Difficulty</th>
          <th className="px-6 py-3">Tags</th>
          <th className="px-6 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((problem) => (
          <tr
            key={problem._id}
            className="border-b border-gray-700 hover:bg-gray-700 transition"
          >
            <td className="px-6 py-3">
              <Link
                to={`/problems/${problem._id}`}
                className="text-blue-400 hover:underline"
              >
                {problem.title}
              </Link>
            </td>
            <td className="px-6 py-3">
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  problem.difficulty === "Easy"
                    ? "bg-green-600"
                    : problem.difficulty === "Medium"
                    ? "bg-yellow-500 text-black"
                    : "bg-red-600"
                }`}
              >
                {problem.difficulty}
              </span>
            </td>
            <td className="px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-600 text-gray-200 px-2 py-0.5 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-6 py-3">{problem.isSolved ? "✅" : "⭕"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ================= Skeleton Loader =================
const SkeletonLoader = ({ viewMode }) => {
  return viewMode === "card" ? <CardSkeletonLoader /> : <TableSkeletonLoader />;
};

const CardSkeletonLoader = () => {
  const skeletons = Array.from({ length: 12 });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 p-6 rounded-2xl shadow animate-pulse min-h-[220px]"
        >
          <div className="h-6 bg-gray-700 mb-4 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-700 mb-2 w-1/2 rounded"></div>
          <div className="h-4 bg-gray-700 mb-2 w-1/3 rounded"></div>
        </div>
      ))}
    </div>
  );
};

const TableSkeletonLoader = () => {
  const skeletonRows = Array.from({ length: 12});
  return (
    <div className="overflow-x-auto mt-4 bg-gray-800 rounded-xl shadow-xl animate-pulse">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3">
              <div className="h-4 bg-gray-600 rounded w-24"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-gray-600 rounded w-16"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-gray-600 rounded w-32"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-gray-600 rounded w-12"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, i) => (
            <tr key={i} className="border-b border-gray-700">
              <td className="px-6 py-3">
                <div className="h-5 bg-gray-700 rounded w-48"></div>
              </td>
              <td className="px-6 py-3">
                <div className="h-5 bg-gray-700 rounded w-20"></div>
              </td>
              <td className="px-6 py-3">
                <div className="h-5 bg-gray-700 rounded w-40"></div>
              </td>
              <td className="px-6 py-3">
                <div className="h-5 bg-gray-700 rounded w-8"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
