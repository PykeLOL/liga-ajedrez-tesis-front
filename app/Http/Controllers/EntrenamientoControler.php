<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EntrenamientoControler extends Controller
{
    public function index()
    {
        return view('entrenamientos.index');
    }

    public function misEntrenamientos()
    {
        return view('entrenamientos.misEntrenamientos');
    }
}
