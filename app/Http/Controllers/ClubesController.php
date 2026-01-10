<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClubesController extends Controller
{
    public function index()
    {
        return view('clubes.index');
    }
}