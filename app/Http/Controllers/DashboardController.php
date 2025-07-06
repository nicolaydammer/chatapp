<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Dashboard', [
            'title' => 'Dashboard',
            'description' => 'Welcome to your dashboard!'
        ]);
    }
}
