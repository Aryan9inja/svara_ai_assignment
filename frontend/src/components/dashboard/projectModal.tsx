"use client";

import { useState } from "react";
import { projectService } from "@/services/projectService";

type CreateProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
};

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await projectService.createProject({ name, description });
      onProjectCreated();
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
        <h3 className="text-2xl font-extrabold mb-6 text-blue-600">Create Project</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base shadow-sm"
              placeholder="Project name"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-base shadow-sm resize-none"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          {error && <p className="text-red-500 text-base font-semibold text-center mb-2">{error}</p>}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
