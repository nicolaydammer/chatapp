<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Friend;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterRequest;
use Exception;

class AuthController extends Controller
{
    public function index(?string $inviteToken = null): \Inertia\Response
    {
        $data = [
            'title' => 'Home',
            'description' => 'Welcome to our website!',
        ];

        if ($inviteToken) {
            $inviter = User::query()->where('invite_token', $inviteToken)->get();
            
            if (empty($inviter->first())) {
                throw new Exception('Invalid invite token', 404);
            }

            $data['invite_token'] = $inviteToken;
        }

        return Inertia::render('Home', $data);
    }

    public function loginPage(): \Inertia\Response
    {
        return Inertia::render('Login', [ 
            'title' => 'Login',
            'description' => 'Please login to continue.'
        ]);
    }

    public function register(RegisterRequest $request, ?string $inviteToken = null): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        $user = new User($validated);
        $newInviteToken = Str::uuid();
        $user->invite_token = $newInviteToken;
        $user->save();

        if ($inviteToken) {
            $inviter = User::query()->where('invite_token', $inviteToken)->get()->first();

            Friend::query()->create([
                'user_id_1' => $inviter->id,
                'user_id_2' => $user->id,
            ]);
        }

        return redirect()->route('login')->with('success', 'Registration successful!');
    }

    public function login(LoginRequest $request): \Illuminate\Http\RedirectResponse
    {
        // retrieve validated data from the request
        $validated = $request->validated();

        // Attempt to authenticate the user redirecting back with errors if authentication fails
        if (!Auth::attempt($validated)) {
            return redirect()->back()->withErrors(['username' => 'Invalid credentials.'])->withInput();
        }

        // Log in the user if they are not already logged in
        if (!Auth::check()) {
            $user = User::where('username', $validated['username'])->first();
            Auth::login($user);
        }

        // Redirect logged-in users to the home page
        return redirect()->route('chat')->with('success', 'Login successful!');
    }
}
