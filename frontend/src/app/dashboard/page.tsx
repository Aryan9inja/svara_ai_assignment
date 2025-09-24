"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService } from "@/services/dashboardService";
import { BiErrorCircle } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ProjectsList from "@/components/dashboard/projects";

type DashboardResponse = {
  totalProjects: number;
  taskStatusCounts: {
    todo: number;
    "in-progress": number;
    done: number;
  };
  overdueTasks: { _id: string; title: string; deadline: string }[];
};

type ChartData = {
  name: string;
  value: number;
};

const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getData();
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-20 w-20 border-b-8 border-blue-500 mx-auto mb-6 shadow-lg"></div>
          <p className="text-gray-700 font-semibold text-xl tracking-wide">
            Loading your dashboard...
          </p>
          <p className="text-gray-400 mt-2 text-sm">Please wait a moment</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="text-center animate-fade-in">
          <div className="bg-red-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BiErrorCircle className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-red-600 font-bold text-xl">Failed to load dashboard</p>
          <p className="text-gray-500 mt-2">Please refresh the page or check your connection.</p>
        </div>
      </div>
    );

  const chartData: ChartData[] = [
    { name: "Todo", value: data.taskStatusCounts.todo },
    { name: "In Progress", value: data.taskStatusCounts["in-progress"] },
    { name: "Done", value: data.taskStatusCounts.done },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white/90 shadow-md border-b border-gray-200 flex-shrink-0 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            Dashboard
          </h1>
          <div className="flex items-center space-x-6">
            <p className="hidden sm:block text-gray-600 text-base">
              Welcome, <span className="font-semibold text-gray-800">{user?.email}</span>
            </p>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 text-white text-base font-semibold rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-400 transition shadow-lg disabled:opacity-50 active:scale-95"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Project Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Project Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Projects", value: data.totalProjects, color: "from-blue-400 to-blue-600" },
              {
                title: "Tasks",
                value:
                  data.taskStatusCounts.todo +
                  data.taskStatusCounts["in-progress"] +
                  data.taskStatusCounts.done,
                color: "from-green-400 to-green-600",
              },
              { title: "Overdue", value: data.overdueTasks.length, color: "from-red-400 to-red-600" },
            ].map((stat) => (
              <div
                key={stat.title}
                className={`bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-center items-center border border-gray-100 transition group relative overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 bg-gradient-to-br ${stat.color}`}></div>
                <h1 className="text-lg font-semibold text-gray-700 mb-1 z-10">{stat.title}</h1>
                <span className="text-3xl font-extrabold text-gray-900 z-10">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Charts & Overdue Tasks */}
        <section className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="text-xl font-bold mb-4 text-gray-900">Tasks by Status</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  animationDuration={800}
                  label={(entry) => {
                    const name = entry.name;
                    const percent = typeof entry.percent === "number" ? entry.percent : 0;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                >
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} tasks`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Overdue Tasks</h3>
            {data.overdueTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <span className="text-green-500 text-2xl font-bold mb-2">🎉</span>
                <p className="text-gray-500 text-base text-center">You&apos;re all caught up! No overdue tasks.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {data.overdueTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition cursor-pointer shadow-sm"
                  >
                    <span className="font-medium text-gray-900 text-base truncate" title={task.title}>
                      {task.title}
                    </span>
                    <span className="text-red-600 text-xs font-semibold">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Projects List */}
        <section className="mb-8">
          <ProjectsList onProjectCreated={fetchDashboardData} />
        </section>
      </main>
    </div>
  );
}
