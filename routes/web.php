<?php

use App\Models\User;
use App\Models\Friend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Models\Message;

// authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthController::class, 'index'])->name('home');
    Route::get('/login', [AuthController::class, 'loginPage'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/{token}', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/{invite_token}', [AuthController::class, 'index'])->whereUuid('invite_token')->name('home_token');
});

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    Route::prefix('chat')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('chat');
        Route::post('/sendMessage', [ChatController::class, 'sendMessage'])->name('chatSendMessage');
        Route::get('/test', function(Request $request) {
            // App\Events\MessagesBroadcast::dispatch(1, ['message' => $text]);

            $user = $request->user();
            $user2 = User::query()->where('username', 'nicolay2')->get()->first();
            $user3 = User::query()->where('username', 'nicolay3')->get()->first();

            return response()->json($user->messages()->get());
        });
    });

    Route::get('/logout', function () {
        Auth::logout();
        return redirect()->route('home')->with('success', 'Logout successful!');
    })->name('logout');
});