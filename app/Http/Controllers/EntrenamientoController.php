<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EntrenamientoController extends Controller
{
    public function index()
    {
        return view('entrenamientos.index');
    }

    public function foro()
    {
        return view('entrenamientos.foro.index');
    }
}
