// Volledig hersteld script voor IKC Binnenstebuiten

const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase = null;

const scholenDatabase = {
    'Groep 1/2 donkerblauw': ['Testkind 1', 'Testkind 2'],
    'Groep 5 donkerblauw': ['Sanne', 'Bram', 'Aisha'],
    'Groep 6 groen': ['Lars', 'Fleur', 'Mees'],
    'Groep 8 roze': ['Testkind 3', 'Testkind 4']
    // Voeg hier de rest van de groepen toe zoals eerder
};

let huidigeGebruiker = "";
let huidigeGroep = "";
let globaleTaakId = 100;

// --- INITIALISATIE ---
window.addEventListener('DOMContentLoaded', () => {
    // 1. Verbind met Supabase
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    // 2. Koppel de dropdowns
    const groepSelect = document.getElementById('kies-groep');
    const loginKnop = document.getElementById('login-knop');

    groepSelect.addEventListener('change', updateNamenLijst);
    loginKnop.addEventListener('click', startLogin);
    
    // Vul de namen direct voor de standaard geselecteerde groep
    updateNamenLijst();
});

function updateNamenLijst() {
    const groepSelect = document.getElementById('kies-groep');
    const wieSelect = document.getElementById('wie-logt-in');
    const namen = scholenDatabase[groepSelect.value] || [];
    
    wieSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(naam => {
        const opt = document.createElement('option');
        opt.value = naam;
        opt.innerText = "Leerling: " + naam;
        wieSelect.appendChild(opt);
    });
}

// --- LOGIN & DASHBOARD ---
async function startLogin() {
    huidigeGebruiker = document.getElementById('wie-logt-in').value;
    huidigeGroep = document.getElementById('kies-groep').value;
    
    document.getElementById('ingelogde-gebruiker-tekst').innerText = huidigeGebruiker;
    document.getElementById('ingelogde-groep-tekst').innerText = huidigeGroep;
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';

    if (huidigeGebruiker !== 'Docent') {
        document.getElementById('voortgang-container').style.display = 'block';
        document.getElementById('klaartaken-container').style.display = 'block';
        document.getElementById('reflectie-container').style.display = 'block';
        maakReflectieBord();
        await haalDataOp();
    }
    
    tekenBasisTaken();
    berekenVoortgang();
}

function tekenBasisTaken() {
    const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
    dagen.forEach(dag => {
        const kol = document.getElementById(dag);
        if (kol.querySelectorAll('.taak').length === 0) {
            kol.appendChild(maakTaakKaart('Rekenen (basis)'));
            kol.appendChild(maakTaakKaart('Spelling (les)'));
        }
    });

    const td = document.getElementById('te-doen');
    if (td.querySelectorAll('.taak').length === 0) {
        td.appendChild(maakTaakKaart('Taak 1'));
        td.appendChild(maakTaakKaart('Extra oefenen', false, true)); // Dispenser
    }
}

function maakTaakKaart(naam, extra = false, dispenser = false) {
    const kaart = document.createElement('div');
    kaart.className = 'taak' + (extra ? ' extra-taak' : '');
    kaart.setAttribute('data-naam', naam);
    kaart.id = 'taak-' + globaleTaakId++;
    kaart.innerHTML = `<span>${naam}</span>`;
    
    kaart.onclick = () => {
        if (huidigeGebruiker === 'Docent') return;
        kaart.classList.toggle('klaar');
        slaVinkjeOp(naam, kaart.classList.contains('klaar'));
        berekenVoortgang();
    };
    
    return kaart;
}

// --- DATABASE ACTIES ---
async function slaVinkjeOp(taak, klaar) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    await supabase.from('leerling_taken').upsert({
        leerling_naam: huidigeGebruiker, groep: huidigeGroep, taak_naam: taak, is_klaar: klaar
    }, { onConflict: 'leerling_naam,taak_naam' });
}

async function haalDataOp() {
    if (!supabase) return;
    const { data } = await supabase.from('leerling_taken').select('*').eq('leerling_naam', huidigeGebruiker);
    if (data) {
        data.forEach(d => {
            const kaart = document.querySelector(`[data-naam="${d.taak_naam}"]`);
            if (kaart && d.is_klaar) kaart.classList.add('klaar');
        });
    }
}

function berekenVoortgang() {
    const alle = document.querySelectorAll('.kolom .taak:not(.extra-taak)');
    let t = 0, k = 0;
    alle.forEach(taak => {
        t++; if (taak.classList.contains('klaar')) k++;
    });
    const perc = t === 0 ? 0 : Math.round((k/t)*100);
    document.getElementById('voortgang-balk-vulling').style.width = perc + '%';
    document.getElementById('voortgang-percentage').innerText = perc + '%';
}

function maakReflectieBord() {
    const grid = document.getElementById('reflectie-dagen-grid');
    grid.innerHTML = '';
    ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'].forEach(dag => {
        const kaart = document.createElement('div');
        kaart.className = 'reflectie-dag';
        kaart.innerHTML = `<h4>${dag}</h4><div class="emotie-knoppen">😄 😐 🙁</div><textarea placeholder="Hulpvraag?"></textarea>`;
        grid.appendChild(kaart);
    });
}