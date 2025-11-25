import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"
import { authAPI, tasksAPI, type User, type Task } from "@/services/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Eye, CheckCircle2, Clock, ListTodo, Plus, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

function Tasks() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [viewTask, setViewTask] = useState<Task | null>(null)

  // Create task state
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskStatus, setNewTaskStatus] = useState<"pending" | "in_progress" | "done">("pending")
  const [creating, setCreating] = useState(false)

  // Edit task state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editStatus, setEditStatus] = useState<"pending" | "in_progress" | "done">("pending")
  const [updating, setUpdating] = useState(false)

  // Assignment state
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [employeesResponse, tasksResponse] = await Promise.all([
        authAPI.getAllUsers(),
        tasksAPI.getTasks()
      ])
      setEmployees(employeesResponse.users)
      setAllUsers(employeesResponse.users)
      setTasks(tasksResponse.tasks)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTask = async (taskId: number) => {
    if (!selectedUserId) {
      alert("Please select a user")
      return
    }

    try {
      const response = await tasksAPI.assignTask(taskId, parseInt(selectedUserId))
      setTasks(tasks.map(t => t.id === taskId ? response.task : t))
      setAssigningTaskId(null)
      setSelectedUserId("")
    } catch (error: any) {
      console.error("Failed to assign task:", error)
      alert(`Failed to assign task: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditStatus(task.status)
    setEditDialogOpen(true)
  }

  const handleUpdateTask = async () => {
    if (!editingTask || !editTitle.trim()) {
      alert("Title is required")
      return
    }

    try {
      setUpdating(true)
      const response = await tasksAPI.updateTask(editingTask.id, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      })

      setTasks(tasks.map(t => t.id === editingTask.id ? response.task : t))
      setEditDialogOpen(false)
      setEditingTask(null)
      setEditTitle("")
      setEditDescription("")
      setEditStatus("pending")
    } catch (error) {
      console.error("Failed to update task:", error)
      alert("Failed to update task")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      await tasksAPI.deleteTask(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
    } catch (error: any) {
      console.error("Failed to delete task:", error)
      alert(`Failed to delete task: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      alert("Title is required")
      return
    }

    try {
      setCreating(true)
      const response = await tasksAPI.createTask({
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
      })

      setTasks([response.task, ...tasks])
      setCreateDialogOpen(false)
      setNewTaskTitle("")
      setNewTaskDescription("")
      setNewTaskStatus("pending")
    } catch (error: any) {
      console.error("Failed to create task:", error)
      alert(`Failed to create task: ${error.response?.data?.message || error.message}`)
    } finally {
      setCreating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock },
      in_progress: { variant: "default" as const, label: "In Progress", icon: ListTodo },
      done: { variant: "outline" as const, label: "Done", icon: CheckCircle2 }
    }
    const { variant, label, icon: Icon } = config[status as keyof typeof config] || config.pending
    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  // Filter tasks
  const myTasks = tasks.filter(task => task.user_id === user?.id)
  const unassignedTasks = tasks.filter(task => !task.user_id)

  // Get task statistics
  const getTaskStats = (taskList: Task[]) => {
    return {
      total: taskList.length,
      pending: taskList.filter(t => t.status === 'pending').length,
      in_progress: taskList.filter(t => t.status === 'in_progress').length,
      done: taskList.filter(t => t.status === 'done').length,
    }
  }

  const myStats = getTaskStats(myTasks)
  const allStats = getTaskStats(tasks)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const renderTaskRow = (task: Task, showAssignButton = true) => (
    <TableRow key={task.id}>
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell>
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {task.description || "No description"}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(task.status)}</TableCell>
      <TableCell>
        {task.user ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {getInitials(task.user.name)}
            </div>
            <div>
              <div className="text-sm font-medium">{task.user.name}</div>
              <div className="text-xs text-muted-foreground">{task.user.email}</div>
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewTask(task)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
          {showAssignButton && !task.user_id && (
            assigningTaskId === task.id ? (
              <div className="flex items-center gap-2">
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  onClick={() => handleAssignTask(task.id)}
                  disabled={!selectedUserId}
                >
                  Assign
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAssigningTaskId(null)
                    setSelectedUserId("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setAssigningTaskId(task.id)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Assign
              </Button>
            )
          )}
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <SidebarProvider>
      <AppSidebar user={user} employees={employees} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Tasks Management</h1>
          <div className="ml-auto">
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {myStats.pending} pending, {myStats.in_progress} in progress, {myStats.done} done
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All tasks in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unassignedTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  Tasks waiting for assignment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allUsers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active employees
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Tables */}
          <Tabs defaultValue="my-tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="my-tasks">My Tasks ({myStats.total})</TabsTrigger>
              <TabsTrigger value="all-tasks">All Tasks ({allStats.total})</TabsTrigger>
              <TabsTrigger value="employees">Employees & Tasks</TabsTrigger>
            </TabsList>

            {/* My Tasks Tab */}
            <TabsContent value="my-tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Assigned Tasks</CardTitle>
                  <CardDescription>
                    Tasks assigned to you ({myStats.pending} pending, {myStats.in_progress} in progress, {myStats.done} completed)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myTasks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                              No tasks assigned to you yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          myTasks.map(task => renderTaskRow(task, false))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Tasks Tab */}
            <TabsContent value="all-tasks" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>
                    Complete list of all tasks in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assigned To</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tasks.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                              No tasks found
                            </TableCell>
                          </TableRow>
                        ) : (
                          tasks.map(task => renderTaskRow(task, true))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Employees & Tasks Tab */}
            <TabsContent value="employees" className="space-y-4">
              {allUsers.map((employee) => {
                const employeeTasks = tasks.filter(t => t.user_id === employee.id)
                const stats = getTaskStats(employeeTasks)

                return (
                  <Card key={employee.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {getInitials(employee.name)}
                        </div>
                        <div className="flex-1">
                          <CardTitle>{employee.name}</CardTitle>
                          <CardDescription>{employee.email}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{stats.total}</div>
                          <p className="text-xs text-muted-foreground">
                            {stats.pending} pending, {stats.in_progress} in progress, {stats.done} done
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {employeeTasks.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          No tasks assigned to this employee
                        </div>
                      ) : (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {employeeTasks.map(task => (
                                <TableRow key={task.id}>
                                  <TableCell className="font-medium">{task.title}</TableCell>
                                  <TableCell>
                                    <div className="max-w-md truncate text-sm text-muted-foreground">
                                      {task.description || "No description"}
                                    </div>
                                  </TableCell>
                                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setViewTask(task)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>

      {/* View Task Dialog */}
      <Dialog open={!!viewTask} onOpenChange={() => setViewTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewTask?.title}</DialogTitle>
            <DialogDescription>Task Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Description</label>
              <p className="text-sm text-muted-foreground mt-1">
                {viewTask?.description || "No description provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <div className="mt-1">{viewTask && getStatusBadge(viewTask.status)}</div>
            </div>
            <div>
              <label className="text-sm font-medium">Assigned To</label>
              <p className="text-sm text-muted-foreground mt-1">
                {viewTask?.user ? `${viewTask.user.name} (${viewTask.user.email})` : "Unassigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-muted-foreground mt-1">
                {viewTask && new Date(viewTask.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={newTaskStatus} onValueChange={(value: "pending" | "in_progress" | "done") => setNewTaskStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateDialogOpen(false)
                  setNewTaskTitle("")
                  setNewTaskDescription("")
                  setNewTaskStatus("pending")
                }}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTask} disabled={creating}>
                {creating ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="Enter task title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter task description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={(value: "pending" | "in_progress" | "done") => setEditStatus(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setEditingTask(null)
                  setEditTitle("")
                  setEditDescription("")
                  setEditStatus("pending")
                }}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateTask} disabled={updating}>
                {updating ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

export default Tasks
