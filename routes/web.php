<?php

use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(AuthController::class)->group(function () {
    Route::get('/', [AuthController::class, 'index'])->name('home');
    Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});
