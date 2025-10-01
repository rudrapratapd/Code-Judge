import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BiSolidLeftArrow, BiSolidDownArrow } from "react-icons/bi";
import toast from "react-hot-toast";

import { useGetProblemByIdQuery, useGetProblemStatusQuery } from "../../redux/api/problemAPI";
import CodeEditor from "../../components/CodeEditor";

const ProblemPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("side");

  const { data: problemData, isLoading, isError } = useGetProblemByIdQuery(id);
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useGetProblemStatusQuery(id);
  console.log(problemData)
  const problem = problemData?.data;
  const isSolved = statusData?.status === "solved";

  const handleAIReview = () => {
    toast("🤖 AI Review requested!", { icon: "🤖" });
  };

  if (isLoading || isStatusLoading) return <Skeleton viewMode={viewMode} />;
  if (isError || isStatusError || !problem) return <ErrorState />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[#0e1117] text-white min-h-screen px-4 py-6"
    >
      <div className="max-w-[1600px] mx-auto">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "side" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProblemContent problem={problem} isSolved={isSolved} />
            <EditorPanel handleAIReview={handleAIReview} />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <ProblemContent problem={problem} isSolved={isSolved} />
            <EditorPanel handleAIReview={handleAIReview} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProblemPage;

const ErrorState = () => (
  <div className="bg-[#0e1117] text-white min-h-screen flex items-center justify-center">
    <p className="text-lg text-red-500">Failed to load problem.</p>
  </div>
);

const ViewToggle = ({ viewMode, setViewMode }) => (
  <div className="hidden lg:flex justify-end mb-4">
    <button
      onClick={() => setViewMode(viewMode === "side" ? "bottom" : "side")}
      className="bg-[#1e2330] hover:bg-[#2b3042] text-blue-300 text-sm font-medium px-4 py-2 rounded-md border border-[#2a2f3d] flex items-center gap-2 transition cursor-pointer"
    >
      {viewMode === "side" ? (
        <>
          <BiSolidDownArrow className="text-lg" />
          Editor Below
        </>
      ) : (
        <>
          <BiSolidLeftArrow className="text-lg" />
          Editor Side
        </>
      )}
    </button>
  </div>
);

const EditorPanel = ({ handleAIReview }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="overflow-y-auto max-h-[calc(150vh-3rem)]"
  >
    <CodeEditor onAIReview={handleAIReview} />
  </motion.div>
);

const ProblemContent = ({ problem, isSolved }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-6 overflow-y-auto max-h-[calc(180vh-3rem)] pr-2"
  >
    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      {problem.title}
    </h1>

    <TagsAndDifficulty problem={problem} />

    <Section title="📝 Description" content={problem.description} />

    {problem.constraints?.length > 0 && (
      <ListSection title="📌 Constraints" items={problem.constraints} />
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {problem.inputFormat?.length > 0 && (
        <ListSection title="🔽 Input Format" items={problem.inputFormat} />
      )}
      {problem.outputFormat?.length > 0 && (
        <ListSection title="🔼 Output Format" items={problem.outputFormat} />
      )}
    </div>

    <SampleTestCases testCases={problem.sampleTestCases} />

    <SolvedState isSolved={isSolved} problemId={problem._id} />
  </motion.div>
);

const TagsAndDifficulty = ({ problem }) => (
  <div className="flex flex-wrap items-center gap-3">
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full shadow ${
        problem.difficulty === "Easy"
          ? "bg-green-600"
          : problem.difficulty === "Medium"
          ? "bg-yellow-500"
          : "bg-red-600"
      }`}
    >
      {problem.difficulty}
    </span>
    {problem.tags.map((tag, i) => (
      <span
        key={i}
        className="bg-[#1e2330] text-xs px-3 py-1 rounded-full text-blue-300 border border-[#2a2f3d]"
      >
        #{tag}
      </span>
    ))}
  </div>
);

const Section = ({ title, content }) => (
  <section>
    <h2 className="text-xl font-semibold mb-2 text-blue-400">{title}</h2>
    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
      {content}
    </p>
  </section>
);

const ListSection = ({ title, items }) => (
  <section>
    <h2 className="text-lg font-semibold mb-2 text-blue-300">{title}</h2>
    <ul className="bg-[#1e2330] p-4 rounded-md text-sm text-gray-200 space-y-1 list-disc pl-6 border border-[#2a2f3d]">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </section>
);

const SampleTestCases = ({ testCases }) => (
  <section>
    <h2 className="text-lg font-semibold mb-4 text-blue-300">🧪 Sample Test Cases</h2>
    <div className="space-y-4">
      {testCases.map((test, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
          key={index}
          className="bg-[#1e2330] p-4 rounded-md space-y-2 border border-[#2a2f3d]"
        >
          <p className="text-sm text-gray-400">Test Case {index + 1}</p>

          <div>
            <span className="text-blue-400 font-medium">Input:</span>
            <pre className="bg-[#0e1117] p-2 mt-1 rounded text-gray-300 whitespace-pre-wrap text-sm">
              {test.input}
            </pre>
          </div>

          <div>
            <span className="text-green-400 font-medium">Output:</span>
            <pre className="bg-[#0e1117] p-2 mt-1 rounded text-gray-300 whitespace-pre-wrap text-sm">
              {test.output}
            </pre>
          </div>

          {test.explanation && (
            <div>
              <span className="text-yellow-400 font-medium">Explanation:</span>
              <pre className="bg-[#0e1117] p-2 mt-1 rounded text-gray-300 whitespace-pre-wrap text-sm">
                {test.explanation}
              </pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);


const SolvedState = ({ isSolved, problemId }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
    <div className="text-sm font-medium">
      {isSolved ? (
        <span className="text-green-400">✅ Solved</span>
      ) : (
        <span className="text-gray-400">🕒 Not Solved Yet</span>
      )}
    </div>

    <Link
      to={`/submissions/problem/${problemId}`}
      className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-md"
    >
      📄 View Submissions
    </Link>
  </div>
);

const SkeletonBox = ({ className }) => (
  <div className={`animate-pulse bg-[#1e2330] rounded-md ${className}`} />
);

const Skeleton = ({ viewMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="bg-[#0e1117] text-white min-h-screen px-4 py-6"
  >
    <div className="max-w-[1600px] mx-auto space-y-4">
      <div className="hidden lg:flex justify-end mb-4">
        <SkeletonBox className="w-40 h-8" />
      </div>

      {viewMode === "side" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonContent />
          <SkeletonEditor />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <SkeletonContent />
          <SkeletonEditor />
        </div>
      )}
    </div>
  </motion.div>
);

const SkeletonContent = () => (
  <div className="space-y-4">
    <SkeletonBox className="h-10 w-1/2" />
    <div className="flex gap-3">
      <SkeletonBox className="w-20 h-6" />
      <SkeletonBox className="w-12 h-6" />
      <SkeletonBox className="w-12 h-6" />
    </div>
    <SkeletonBox className="h-24 w-full" />
    <SkeletonBox className="h-20 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonBox className="h-20 w-full" />
      <SkeletonBox className="h-20 w-full" />
    </div>
    <SkeletonBox className="h-32 w-full" />
    <div className="flex gap-4">
      <SkeletonBox className="h-8 w-32" />
      <SkeletonBox className="h-8 w-40" />
    </div>
  </div>
);

const SkeletonEditor = () => (
  <div className="space-y-4">
    <div className="flex flex-wrap justify-between gap-3">
      <SkeletonBox className="h-8 w-32" />
      <div className="flex gap-3">
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-20" />
        <SkeletonBox className="h-8 w-24" /> 
      </div>
    </div>
    <SkeletonBox className="h-[420px] w-full" />
    <SkeletonBox className="h-24 w-full" />
    <SkeletonBox className="h-10 w-full" />
  </div>
);
