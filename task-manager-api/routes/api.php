<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ApiAuthController;
use App\Models\User;

// Public routes - no authentication required
Route::get('/users', function (Request $request) {
    // Get all users with employee role
    $users = User::where('role', 'employee')->get();
    return response()->json(['users' => $users]);
});

Route::apiResource('tasks', TaskController::class);
Route::post('/tasks/{task}/assign', [TaskController::class, 'assign']);

// Auth routes (kept for compatibility but not required)
Route::post('/auth/login', [ApiAuthController::class, 'login']);
Route::post('/auth/logout', [ApiAuthController::class, 'logout']);
Route::get('/user', function (Request $request) {
    // Return first user for public access
    return User::first();
});
