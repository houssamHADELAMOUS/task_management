<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'hire_date' => now()->subYears(2),
        ]);

        // Create Test Employee Users
        $employees = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'hire_date' => now()->subYear(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'hire_date' => now()->subMonths(8),
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'hire_date' => now()->subMonths(6),
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'hire_date' => now()->subMonths(4),
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'password' => Hash::make('password'),
                'role' => 'employee',
                'hire_date' => now()->subMonths(3),
            ],
        ];

        $createdEmployees = [];
        foreach ($employees as $employee) {
            $createdEmployees[] = User::create($employee);
        }

        // Create Tasks
        $taskData = [
            // Pending tasks
            ['title' => 'Setup development environment', 'description' => 'Install and configure all necessary tools for development', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Review project requirements', 'description' => 'Go through all project requirements and clarify any doubts', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Create database schema', 'description' => 'Design and implement the database structure', 'status' => 'pending', 'user_id' => $createdEmployees[0]->id],
            ['title' => 'Write API documentation', 'description' => 'Document all API endpoints with examples', 'status' => 'pending', 'user_id' => $createdEmployees[1]->id],
            ['title' => 'Setup CI/CD pipeline', 'description' => 'Configure automated testing and deployment', 'status' => 'pending', 'user_id' => null],

            // In Progress tasks
            ['title' => 'Implement user authentication', 'description' => 'Add JWT authentication to the application', 'status' => 'in_progress', 'user_id' => $createdEmployees[0]->id],
            ['title' => 'Design landing page', 'description' => 'Create wireframes and mockups for the landing page', 'status' => 'in_progress', 'user_id' => $createdEmployees[1]->id],
            ['title' => 'Build REST API endpoints', 'description' => 'Develop all necessary API endpoints for the frontend', 'status' => 'in_progress', 'user_id' => $createdEmployees[2]->id],
            ['title' => 'Implement search functionality', 'description' => 'Add search feature with filters and sorting', 'status' => 'in_progress', 'user_id' => $createdEmployees[3]->id],
            ['title' => 'Create user dashboard', 'description' => 'Build the main dashboard with widgets and statistics', 'status' => 'in_progress', 'user_id' => $createdEmployees[4]->id],
            ['title' => 'Add email notifications', 'description' => 'Implement email notification system for important events', 'status' => 'in_progress', 'user_id' => $createdEmployees[0]->id],
            ['title' => 'Optimize database queries', 'description' => 'Review and optimize slow database queries', 'status' => 'in_progress', 'user_id' => $createdEmployees[1]->id],

            // Done tasks
            ['title' => 'Setup project repository', 'description' => 'Initialize Git repository and setup branches', 'status' => 'done', 'user_id' => $createdEmployees[2]->id],
            ['title' => 'Configure development server', 'description' => 'Setup development server with all dependencies', 'status' => 'done', 'user_id' => $createdEmployees[3]->id],
            ['title' => 'Install dependencies', 'description' => 'Install all required packages and libraries', 'status' => 'done', 'user_id' => $createdEmployees[4]->id],
            ['title' => 'Create project structure', 'description' => 'Setup folder structure and organize files', 'status' => 'done', 'user_id' => $createdEmployees[0]->id],
            ['title' => 'Write unit tests', 'description' => 'Create comprehensive unit tests for core functionality', 'status' => 'done', 'user_id' => $createdEmployees[1]->id],
            ['title' => 'Setup logging system', 'description' => 'Implement logging for debugging and monitoring', 'status' => 'done', 'user_id' => $createdEmployees[2]->id],
            ['title' => 'Configure error handling', 'description' => 'Add global error handling and user-friendly messages', 'status' => 'done', 'user_id' => $createdEmployees[3]->id],
            ['title' => 'Create user model', 'description' => 'Implement user model with validation', 'status' => 'done', 'user_id' => $createdEmployees[4]->id],

            // More unassigned tasks
            ['title' => 'Implement file upload', 'description' => 'Add file upload functionality with validation', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Create admin panel', 'description' => 'Build admin interface for system management', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Add data export feature', 'description' => 'Allow users to export data in CSV and PDF formats', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Implement caching', 'description' => 'Add Redis caching for improved performance', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Setup monitoring', 'description' => 'Configure application monitoring and alerting', 'status' => 'pending', 'user_id' => null],

            // Additional tasks for variety
            ['title' => 'Fix mobile responsiveness', 'description' => 'Ensure all pages work well on mobile devices', 'status' => 'in_progress', 'user_id' => $createdEmployees[2]->id],
            ['title' => 'Update dependencies', 'description' => 'Update all packages to latest stable versions', 'status' => 'done', 'user_id' => $createdEmployees[3]->id],
            ['title' => 'Implement dark mode', 'description' => 'Add dark mode theme option for users', 'status' => 'pending', 'user_id' => $createdEmployees[4]->id],
            ['title' => 'Add accessibility features', 'description' => 'Implement ARIA labels and keyboard navigation', 'status' => 'pending', 'user_id' => null],
            ['title' => 'Create backup system', 'description' => 'Setup automated database backups', 'status' => 'in_progress', 'user_id' => $createdEmployees[0]->id],
            ['title' => 'Write integration tests', 'description' => 'Create end-to-end tests for critical workflows', 'status' => 'pending', 'user_id' => $createdEmployees[1]->id],
        ];

        foreach ($taskData as $task) {
            Task::create($task);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Employees: john@example.com, jane@example.com, mike@example.com, sarah@example.com, david@example.com / password');
    }
}
