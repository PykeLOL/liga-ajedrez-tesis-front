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

    public function index($slug)
    {
        $tipoResponse = Http::get(env('API_URL') . '/select/tipos-evento');

        if (!$tipoResponse->successful()) return redirect()->route('home');

        $tipos = collect($tipoResponse->json());
        $tipo = $tipos->firstWhere('slug', $slug);

        if (!$tipo) return redirect()->route('home');

        if ($tipo['slug'] === 'torneo') {
            return view('eventos.torneos.index', [
                'tipoEventoId' => $tipo['id'],
                'tipoEventoNombre' => $tipo['nombre'],
                'tipoEventoSlug' => $tipo['slug']
            ]);
        }

        return view('eventos.generico.index', [
            'tipoEventoId' => $tipo['id'],
            'tipoEventoNombre' => $tipo['nombre'],
            'tipoEventoSlug' => $tipo['slug']
        ]);
    }

    public function show($slug, $id)
    {
        $tipoResponse = Http::get(env('API_URL') . '/select/tipos-evento');

        if (!$tipoResponse->successful()) return redirect()->route('home');

        $tipos = collect($tipoResponse->json());
        $tipo = $tipos->firstWhere('slug', $slug);

        if (!$tipo) return redirect()->route('home');

        if ($tipo['slug'] === 'torneo') {
            return view('eventos.torneos.show', [
                'eventoId' => $id,
                'tipoEventoId' => $tipo['id'],
                'tipoEventoNombre' => $tipo['nombre'],
                'tipoEventoSlug' => $tipo['slug'],
            ]);
        }

        return view('eventos.generico.index', [
            'eventoId' => $id,
            'tipoEventoId' => $tipo['id'],
            'tipoEventoNombre' => $tipo['nombre'],
            'tipoEventoSlug' => $tipo['slug'],
        ]);
    }
}
