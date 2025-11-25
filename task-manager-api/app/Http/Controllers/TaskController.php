<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Get all tasks with user information
        $tasks = Task::with('user:id,name,email,role')->get();
        return response()->json(['tasks' => $tasks]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,done',
            'user_id' => 'nullable|exists:users,id' // Made optional for public access
        ]);

        $task = Task::create($validated);

        // Load user relationship if assigned
        if ($task->user_id) {
            $task->load('user:id,name,email,role');
        }

        return response()->json(['task' => $task], 201);
    }


    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:pending,in_progress,done',
            'user_id' => 'sometimes|nullable|exists:users,id'
        ]);

        $task->update($validated);

        // Load user relationship if assigned
        if ($task->user_id) {
            $task->load('user:id,name,email,role');
        }

        return response()->json(['task' => $task]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Assign a task to a user.
     */
    public function assign(Request $request, Task $task)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $task->update(['user_id' => $validated['user_id']]);

        return response()->json([
            'message' => 'Task assigned successfully',
            'task' => $task->load('user:id,name,email,role')
        ]);
    }
}
