<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [ 
            'title' => 'Home',
            'description' => 'Welcome to our website!'
        ]);
    }

    public function loginPage() {
        return Inertia::render('Login', [ 
            'title' => 'Login',
            'description' => 'Please login to continue.'
        ]);
    }

    public function register(RegisterRequest $request) {
        $validated = $request->validated();

        $user = new User($validated);
        $user->save();

        return redirect()->route('home')->with('success', 'Registration successful!');
    }

    public function login(LoginRequest $request) {
        $validated = $request->validated();

        // Handle login logic here, e.g., authenticate the user

        // return redirect()->route('/test')->with('success', 'Login successful!');

        return redirect()->route('/')->with('success', 'Registration successful!');
    }
}
