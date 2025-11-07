<?php

use App\Models\User;
use App\Models\Friend;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatUploadController;
use App\Http\Controllers\FriendListController;

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
        Route::get('/friendlist', [FriendListController::class, 'index'])->name('chatFriendlist');
        Route::post('/friendlist', [FriendListController::class, 'inviteNewFriend']);
        Route::prefix('attachment')->group(function () {
            Route::post('/image', [ChatUploadController::class, 'uploadImage'])->name('chat.upload.image');
            Route::post('/video', [ChatUploadController::class, 'uploadVideo'])->name('chat.upload.video');
            Route::post('/document', [ChatUploadController::class, 'uploadDocument'])->name('chat.upload.document');
            Route::get('/', [ChatUploadController::class, 'getFile'])->name('chat.upload.getFile');
        });
    });

    Route::get('/logout', function () {
        Auth::logout();
        return redirect()->route('home')->with('success', 'Logout successful!');
    })->name('logout');
});
