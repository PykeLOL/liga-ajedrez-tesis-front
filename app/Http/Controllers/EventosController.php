<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EventosController extends Controller
{
    public function torneos()
    {
        return view('eventos.torneos.index');
    }

    public function reuniones()
    {
        return view('eventos.reuniones.index');
    }

    public function convocatorias()
    {
        return view('eventos.convocatorias.index');
    }
    public function index($id)
    {
        //dd("entro");
        $response = Http::get('http://127.0.0.1:8000/api/eventos/tipo-eventos');
        if ($response->successful()) {
            $tipoEventos = collect($response->json());
            $torneoId = $tipoEventos->firstWhere('nombre', 'Torneo')['id'] ?? null;
            $reunionId = $tipoEventos->firstWhere('nombre', 'Reunion')['id'] ?? null;
            $convocatoriaId = $tipoEventos->firstWhere('nombre', 'Convocatoria')['id'] ?? null;
        }
        //$response = Http::get('http://127.0.0.1:8000/api/eventos');
        if($id == $torneoId){
             return view('eventos.torneos.index');
        }else if($id==$reunionId){
            return view('eventos.reuniones.index');
        }else if($id==$convocatoriaId){
            return view('eventos.convocatorias.index');
        }else {
            return view('eventos.convocatorias.index');
        }
    }
}