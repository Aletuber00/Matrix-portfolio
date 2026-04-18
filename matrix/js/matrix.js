// --- 1. CARICAMENTO AUDIO PIOGGIA ---
const matrixAudio = new Audio();


matrixAudio.src = '../assets/sounds/Matrix_code.mp3'; 

matrixAudio.preload = 'auto';
matrixAudio.volume = 0.5;


var q = document.getElementById('matrix'),
    w = q.width = window.innerWidth,
    h = q.height = window.innerHeight,
    p = Array(256).join(1).split(''),
    c = q.getContext('2d'),
    m = Math,
    rainInterval;


function startMatrix() {
    q.style.opacity = 1;
    rainInterval = setInterval(function(){
        c.fillStyle = 'rgba(0,0,0,0.05)';
        c.fillRect(0, 0, w, h);
        c.fillStyle = 'rgba(0,255,0,1)';
        p = p.map(function(v, i){
            let r = m.random();
            var str = String.fromCharCode(m.floor(2720 + r * 33));
            c.fillText(str, i * 10, v);
            v += 10;
            var ret = v > h + r * 1e4 ? 0 : v; 
            return ret;
        });
    }, 33);
}

function choosePill(color) {
    const pillScreen = document.getElementById('pill-screen');
    const message = document.getElementById('pill-message');

    if (color === 'blue') {
        message.innerText = "> Fine della storia. Ti svegli in camera tua e credi a quello che vuoi.";
        document.querySelector('.pill-buttons').style.display = 'none'; 
        setTimeout(() => { window.location.href = "https://www.google.com"; }, 3000);

    } else if (color === 'red') {
        pillScreen.style.opacity = 0; 
        
        // --- RITARDO DI 1 SECONDO PER L'AUDIO ---
        setTimeout(() => {
            console.log("Avvio audio dopo 1 secondo...");
            matrixAudio.play().catch(function(err) {
                console.error("Errore audio:", err);
            });
        }, 1000); 
        
        setTimeout(() => {
            pillScreen.style.display = 'none';
            startMatrix();

            
            setTimeout(function() {
                const canvas = document.getElementById('matrix');
                const mainSite = document.getElementById('main-site');

                canvas.style.transition = "opacity 2s ease-in-out";
                canvas.style.opacity = "0"; 
                canvas.style.pointerEvents = "none"; 

                mainSite.classList.remove('hidden');
                mainSite.classList.add('visible');

                setTimeout(function() {
                    typeWriter('line1', '> Wake up, user...', 0, function() {
                        document.getElementById('line1').classList.remove('cursor');
                        document.getElementById('line2').classList.add('cursor');
                        typeWriter('line2', '> Inizializzazione portfolio in corso...', 0, null);
                    });
                }, 1000); 

                setTimeout(function() {
                    clearInterval(rainInterval); 
                    
                    const fadeAudio = setInterval(() => {
                        if (matrixAudio.volume > 0.05) {
                            matrixAudio.volume -= 0.05;
                        } else {
                            matrixAudio.pause();
                            clearInterval(fadeAudio);
                        }
                    }, 100);
                }, 2000);

            }, 10000); 
        }, 1000); 
    }
}

function typeWriter(elementId, text, i, callback) {
    if (i < text.length) {
        document.getElementById(elementId).innerHTML += text.charAt(i);
        let speed = Math.floor(Math.random() * 50) + 30; 
        setTimeout(function() {
            typeWriter(elementId, text, i + 1, callback);
        }, speed);
    } else if (callback) {
        setTimeout(callback, 500); 
    }
}

function openSection(sectionName) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById('section-' + sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// --- GENERATORE DI SUONI DEL TERMINALE (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep() {
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'square'; 
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime); // Frequenza a 200Hz

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1); 

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// --- SISTEMA DI NAVIGAZIONE DEL TERMINALE ---
function openSection(sectionName) {
    
    
    playBeep(); 

    const sections = document.querySelectorAll('.content-section');

    sections.forEach(function(section) {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById('section-' + sectionName);

    if (targetSection) {
        targetSection.classList.add('active');
    }
}