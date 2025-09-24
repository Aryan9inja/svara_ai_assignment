"use client";

import { projectService } from "@/services/projectService";
import { useEffect, useState } from "react";
import CreateProjectModal from "./projectModal";
import { FiFolder, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Project = {
  _id: string;
  name: string;
  description?: string;
};

type ProjectsResponse = {
  statusCode: number;
  data: Project[];
  message: string;
  success: boolean;
};

type ProjectsListProps = {
  onProjectCreated?: () => void;
};

export default function ProjectsList({ onProjectCreated }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getProjects();
        const extractedData: ProjectsResponse = response.data;
        if (extractedData.success) {
          setProjects(extractedData.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };
  const handleProjectCreated = async () => {
    setLoading(true);
    try {
      const response = await projectService.getProjects();
      const extractedData: ProjectsResponse = response.data;
      if (extractedData.success) {
        setProjects(extractedData.data);
      }
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setLoading(true);
    try {
      await projectService.deleteProject(projectToDelete._id);
      setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
      if (onProjectCreated) {
        onProjectCreated();
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex-1 overflow-y-auto animate-fade-in">
      {/* Header with title and Create button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Projects</h3>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 transition shadow-lg active:scale-95"
          title="Create a new project"
        >
          <FiPlus className="w-5 h-5" /> <span className="font-semibold">Create Project</span>
        </button>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-28 w-full shadow-md"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FiFolder className="w-12 h-12 text-blue-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">No projects found.</p>
          <p className="text-gray-400 text-base">Start by creating your first project!</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <li
              key={project._id}
              onClick={() => router.push(`/project/${project._id}`)}
              className="relative flex flex-col justify-between p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 cursor-pointer group"
              tabIndex={0}
              title={`View project: ${project.name}`}
            >
              {/* Edit/Delete icons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); openDeleteModal(project); }}
                  className="text-gray-400 hover:text-red-500 transition p-1 rounded-full bg-white shadow focus:outline-none focus:ring-2 focus:ring-red-300"
                  disabled={loading}
                  title="Delete project"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
                {/* Delete Confirmation Modal */}
                {deleteModalOpen && projectToDelete && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                      <h3 className="text-2xl font-bold mb-6 text-red-600 flex items-center gap-2">
                        <FiTrash2 className="text-red-500 w-6 h-6" /> Delete Project
                      </h3>
                      <p className="mb-8 text-gray-700 text-base">
                        Are you sure you want to delete <span className="font-semibold">{projectToDelete.name}</span>?<br />
                        <span className="text-red-500 font-semibold">This action cannot be undone.</span>
                      </p>
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={closeDeleteModal}
                          className="px-5 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition font-semibold"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={confirmDelete}
                          className={`px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={loading}
                        >
                          {loading ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 mb-2">
                <FiFolder className="text-blue-500 w-7 h-7" />
                <h4 className="font-bold text-gray-800 truncate text-lg" title={project.name}>
                  {project.name}
                </h4>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">Project</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                {project.description || <span className="italic text-gray-400">No description provided.</span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
