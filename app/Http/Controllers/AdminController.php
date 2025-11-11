<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return view('admin.index');
    }

    public function perfil()
    {
        return view('admin.perfil');
    }

    public function getUsuarios()
    {
        return view('admin.usuarios');
    }

    public function getRoles()
    {
        return view('admin.roles');
    }

    public function getPermisos()
    {
        return view('admin.permisos');
    }
}
