<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Home', [
            'title' => 'Home',
            'description' => 'Welcome to our website!'
        ]);
    }

    public function loginPage(): \Inertia\Response
    {
        return Inertia::render('Login', [ 
            'title' => 'Login',
            'description' => 'Please login to continue.'
        ]);
    }

    public function register(RegisterRequest $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        $user = new User($validated);
        $user->save();

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
        return redirect()->route('dashboard')->with('success', 'Login successful!');
    }
}
