<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;

// authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'index'])->name('home');
    Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::prefix('chat')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('chat');
        Route::get('/{text}', function(string $text) {
            App\Events\MessagesBroadcast::dispatch(1, ['message' => $text]);
        });
    });

    Route::get('/logout', function () {
        Auth::logout();
        return redirect()->route('home')->with('success', 'Logout successful!');
    })->name('logout');
});