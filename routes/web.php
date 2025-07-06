<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

// authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'index'])->name('home');
    Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    });
});