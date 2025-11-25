<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// This line should exist to load auth routes
require __DIR__.'/auth.php';
