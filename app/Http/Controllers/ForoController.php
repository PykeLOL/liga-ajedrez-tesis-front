<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ForoController extends Controller
{
    public function index()
    {
        return view('foro.index');
    }

    public function show(int $id)
    {
        return view('foro.show', ['id' => $id]);
    }
}
