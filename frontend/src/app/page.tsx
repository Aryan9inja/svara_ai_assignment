export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in flex flex-col items-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 text-center">SvaraAI Internship Assignment</h1>
        <p className="text-gray-700 text-center mb-6 text-base font-medium">Task & Project Management System<br />Next.js 15 · React.js · TailwindCSS · Node.js · Express.js · MongoDB</p>
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
          <a href="/auth/signup" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition text-center focus:outline-none focus:ring-2 focus:ring-blue-400">Sign Up</a>
          <a href="/auth/login" className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-blue-700 transition text-center focus:outline-none focus:ring-2 focus:ring-purple-400">Login</a>
        </div>
        <p className="mt-8 text-xs text-gray-400 text-center">Duration: 22-09-2025 to 24-09-2025</p>
      </div>
    </main>
  );
}