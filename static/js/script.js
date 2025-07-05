let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('totalSlides').textContent = totalSlides;
    createSlideDots();
    showSlide(0);
    
    // Animación inicial
    setTimeout(() => {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            const title = activeSlide.querySelector('h1');
            if (title) {
                title.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    title.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }, 500);
});

// Crear indicadores de slides (dots)
function createSlideDots() {
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slide-dots';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    document.body.appendChild(dotsContainer);
}

// Actualizar barra de progreso
function updateProgressBar() {
    const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Actualizar indicadores
function updateIndicators() {
    document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
    
    // Actualizar dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlideIndex);
    });
    
    // Actualizar botones de navegación
    const prevBtn = document.querySelector('.nav-btn:first-child');
    const nextBtn = document.querySelector('.nav-btn:last-child');
    
    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;
}

// Mostrar slide específico
function showSlide(index) {
    // Remover clases de todos los slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev', 'next');
        
        if (i === index) {
            slide.classList.add('active');
        } else if (i < index) {
            slide.classList.add('prev');
        } else {
            slide.classList.add('next');
        }
    });
    
    updateIndicators();
    updateProgressBar();
}

// Ir a slide específico
function goToSlide(index) {
    if (index >= 0 && index < totalSlides && index !== currentSlideIndex) {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
    }
}

// Siguiente slide
function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }
}

// Slide anterior
function previousSlide() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }
}

// Navegación con teclado
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'PageUp':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(0);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides - 1);
            break;
        case 'Escape':
            // Cerrar modal de ayuda si está abierto
            const helpModal = document.getElementById('helpModal');
            if (helpModal && helpModal.style.display === 'block') {
                hideHelp();
            }
            // Salir de pantalla completa si está activo
            else if (document.fullscreenElement) {
                document.exitFullscreen();
            }
            break;
        default:
            // Navegación directa con números 1-6
            if (e.key >= '1' && e.key <= '9') {
                const slideNumber = parseInt(e.key) - 1;
                if (slideNumber < totalSlides) {
                    goToSlide(slideNumber);
                }
            }
            break;
    }
});

// Soporte para gestos táctiles
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - slide anterior
            previousSlide();
        } else {
            // Swipe left - siguiente slide
            nextSlide();
        }
    }
}

// Prevenir scroll accidental
document.addEventListener('wheel', function(e) {
    if (Math.abs(e.deltaY) > 50) {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
}, { passive: false });

// Auto-play opcional (deshabilitado por defecto)
let autoPlayInterval;
let isAutoPlaying = false;

function startAutoPlay(intervalMs = 15000) {
    if (!isAutoPlaying) {
        isAutoPlaying = true;
        autoPlayInterval = setInterval(() => {
            if (currentSlideIndex < totalSlides - 1) {
                nextSlide();
            } else {
                goToSlide(0); // Volver al inicio
            }
        }, intervalMs);
    }
}

function stopAutoPlay() {
    if (isAutoPlaying) {
        isAutoPlaying = false;
        clearInterval(autoPlayInterval);
    }
}

// Pausar auto-play cuando el usuario interactúa
document.addEventListener('keydown', stopAutoPlay);
document.addEventListener('click', stopAutoPlay);
document.addEventListener('touchstart', stopAutoPlay);

// Función para modo presentación (pantalla completa)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error al entrar en pantalla completa:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Tecla F para pantalla completa
document.addEventListener('keydown', function(e) {
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Mostrar modal de ayuda
function showHelp() {
    const helpModal = document.getElementById('helpModal');
    const helpBackdrop = document.getElementById('helpBackdrop');
    
    if (helpModal && helpBackdrop) {
        helpModal.style.display = 'block';
        helpBackdrop.style.display = 'block';
        
        // Animación de entrada
        setTimeout(() => {
            helpModal.style.opacity = '1';
            helpModal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }
}

// Ocultar modal de ayuda
function hideHelp() {
    const helpModal = document.getElementById('helpModal');
    const helpBackdrop = document.getElementById('helpBackdrop');
    
    if (helpModal && helpBackdrop) {
        helpModal.style.opacity = '0';
        helpModal.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            helpModal.style.display = 'none';
            helpBackdrop.style.display = 'none';
        }, 300);
    }
}

// Mostrar ayuda con tecla H
document.addEventListener('keydown', function(e) {
    if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        e.preventDefault();
        showHelp();
    }
    

});

// Cerrar modal haciendo clic en el backdrop
document.addEventListener('click', function(e) {
    const helpBackdrop = document.getElementById('helpBackdrop');
    if (e.target === helpBackdrop) {
        hideHelp();
    }
});

// Función para recargar la presentación
function restartPresentation() {
    goToSlide(0);
    stopAutoPlay();
}

// Tecla R para reiniciar
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        restartPresentation();
    }
});