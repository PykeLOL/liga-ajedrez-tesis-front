<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClubesController extends Controller
{
    public function index()
    {
        return view('clubes.index');
    }

    public function show($id)
    {
        return view('clubes.show', ['id' => $id]);
    }
}
