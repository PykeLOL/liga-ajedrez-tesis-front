<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DeportistasController extends Controller
{
    public function topelo()
    {
        return view('deportistas.topelo.index');
    }

    public function palmares()
    {
        return view('deportistas.palmares.index');
    }

    public function mielo()
    {
        return view('deportistas.mielo.index');
    }
}