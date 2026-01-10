{{-- resources/views/components/news-card.blade.php --}}
@props(['image', 'category', 'title', 'date', 'badgeColor' => 'primary'])

<div class="card border-0 shadow-sm bg-dark-card text-white card-hover">
    <div class="row g-0 align-items-center">
        <div class="col-4">
            {{-- Usamos h-100 y object-fit-cover para evitar deformaciones --}}
            <img src="{{ $image }}" class="img-fluid rounded-start h-100 object-fit-cover" alt="{{ $title }}" style="min-height: 100px;">
        </div>
        <div class="col-8">
            <div class="card-body py-2">
                {{-- Badge con color dinámico --}}
                <span class="badge bg-{{ $badgeColor }} mb-1" style="font-size: 0.65rem;">{{ $category }}</span>
                
                <h6 class="card-title fw-bold mb-1 clamp-text">{{ $title }}</h6>
                
                <small class="text-muted d-block mb-1" style="font-size: 0.8rem">{{ $date }}</small>
                
                {{-- Enlace extendido para hacer clic en toda la tarjeta --}}
                <a href="#" class="stretched-link"></a>
            </div>
        </div>
    </div>
</div>