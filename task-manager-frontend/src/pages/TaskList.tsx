import { useEffect, useState } from "react"
import { tasksAPI, type Task } from "../services/api"
import { Link } from "react-router-dom"

function TaskList() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      console.log("API Response:", response);

      // Handle different response formats
      const tasks = Array.isArray(response) ? response : (response?.tasks || []);
      setAllTasks(tasks);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await tasksAPI.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>All Tasks</h1>
        <Link to="/tasks/new">
          <button style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem"
          }}>
            + Create New Task
          </button>
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>#Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.length === 0 ? (
            <tr>
              <td colSpan={5}>No tasks found</td>
            </tr>
          ) : (
            allTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description || "N/A"}</td>
                <td>{task.status}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link to={`/tasks/${task.id}`}>
                      <button
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(task.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList
