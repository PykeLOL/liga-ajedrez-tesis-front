<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function getUsuarios()
    {
        return view('admin.usuarios');
    }

    public function getRoles()
    {
        return view('admin.roles');
    }
}
