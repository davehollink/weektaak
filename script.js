// script.js - Volledige Herstelde Versie (Inclusief alle functies)

// --- 1. CONFIGURATIE & DATABASE ---
const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase;

const scholenDatabase = {
    'Groep 1/2 donkerblauw': ['Testkind 1', 'Testkind 2'],
    'Groep 1/2 lichtblauw': ['Testkind 3', 'Testkind 4'],
    'Groep 1/2 oranje': ['Testkind 5', 'Testkind 6'],
    'Groep 1/2 paars': ['Testkind 7', 'Testkind 8'],
    'Groep 1/2 rood': ['Testkind 9', 'Testkind 10'],
    'Groep 3/4 oranje': ['Testkind 11', 'Testkind 12'],
    'Groep 3 rood': ['Testkind 13', 'Testkind 14'],
    'Groep 3 roze': ['Testkind 15', 'Testkind 16'],
    'Groep 4 groen': ['Testkind 17', 'Testkind 18'],
    'Groep 4 turquoise': ['Testkind 19', 'Testkind 20'],
    'Groep 5 donkerblauw': ['Sanne', 'Bram', 'Aisha'],
    'Groep 5 lichtblauw': ['Testkind 21', 'Testkind 22'],
    'Groep 5 roze': ['Testkind 23', 'Testkind 24'],
    'Groep 6 groen': ['Lars', 'Fleur', 'Mees'],
    'Groep 6 paars': ['Testkind 25', 'Testkind 26'],
    'Groep 7 blauw': ['Testkind 27', 'Testkind 28'],
    'Groep 7 paars': ['Testkind 29', 'Testkind 30'],
    'Groep 7 turquoise': ['Testkind 31', 'Testkind 32'],
    'Groep 8 geel': ['Testkind 33', 'Testkind 34'],
    'Groep 8 oranje': ['Testkind 35', 'Testkind 36'],
    'Groep 8 roze': ['Testkind 37', 'Testkind 38']
};

let huidigeGebruiker = '';
let huidigeGroep = '';
let globaleTaakId = 1;
const werkDagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

// --- 2. INITIALISATIE ---
window.addEventListener('load', () => {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    updateLoginDropdown();
    document.getElementById('kies-groep').addEventListener('change', updateLoginDropdown);
    document.getElementById('login-knop').addEventListener('click', login);
    document.getElementById('logout-knop').addEventListener('click', () => location.reload());
});

function updateLoginDropdown() {
    const groepSelect = document.getElementById('kies-groep');
    const wieLogtInSelect = document.getElementById('wie-logt-in');
    const namen = scholenDatabase[groepSelect.value] || [];
    
    wieLogtInSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.innerText = "Leerling: " + n;
        wieLogtInSelect.appendChild(opt);
    });
}

// --- 3. LOGIN & UI OPBOUW ---
async function login() {
    huidigeGebruiker = document.getElementById('wie-logt-in').value;
    huidigeGroep = document.getElementById('kies-groep').value;
    
    document.getElementById('ingelogde-gebruiker-tekst').innerText = huidigeGebruiker;
    document.getElementById('ingelogde-groep-tekst').innerText = huidigeGroep;
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';

    if (huidigeGebruiker === 'Docent') {
        document.getElementById('docent-paneel').style.display = 'flex';
        document.getElementById('docent-acties').style.display = 'flex';
        vulDynamischeCheckboxes();
    } else {
        document.getElementById('voortgang-container').style.display = 'block';
        document.getElementById('klaartaken-container').style.display = 'block';
        document.getElementById('reflectie-container').style.display = 'block';
        laadReflectieBord();
    }

    laadStandaardInhoud();
    await synchroniseerData();
    berekenVoortgang();
}

// --- 4. TAKEN BOUWEN & SLEPEN ---
function bouwTaakElement(taakNaam, leerling = 'Iedereen', isExtra = false, isDispenser = false) {
    const el = document.createElement('div');
    el.className = 'taak';
    if (isExtra) el.classList.add('extra-taak');
    if (isDispenser) el.classList.add('dispenser-taak');
    el.id = 'taak-' + globaleTaakId++;
    el.setAttribute('draggable', 'true');
    el.setAttribute('data-taak-naam', taakNaam);
    el.setAttribute('data-leerling', leerling);
    el.innerHTML = `<span>${taakNaam}</span>`;

    if (!isDispenser) {
        el.onclick = () => {
            if (huidigeGebruiker === 'Docent') return;
            el.classList.toggle('klaar');
            slaVinkjeOp(taakNaam, el.classList.contains('klaar'), parseInt(el.getAttribute('data-aantal') || 0));
            berekenVoortgang();
        };
    }

    el.ondragstart = (e) => e.dataTransfer.setData('text', el.id);
    return el;
}

function laadStandaardInhoud() {
    const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
    dagen.forEach(dag => {
        const kol = document.getElementById(dag);
        kol.appendChild(bouwTaakElement('Rekenen (basistaak)'));
        kol.appendChild(bouwTaakElement('Spelling (basisles)'));
    });

    const td = document.getElementById('te-doen');
    td.appendChild(bouwTaakElement('Rekenen peiltaken'));
    td.appendChild(bouwTaakElement('Rekenen 5 eigen taken', 'Iedereen', false, true));
    td.appendChild(bouwTaakElement('Staal oefensoftware week', 'Iedereen', false, true));

    const kl = document.getElementById('klaartaken-lijst');
    ['Minecraft', 'Thema', 'Tekenen'].forEach(t => kl.appendChild(bouwTaakElement(t, 'Iedereen', true)));
}

// --- 5. REFLECTIE & VOORTGANG ---
function laadReflectieBord() {
    const grid = document.getElementById('reflectie-dagen-grid');
    grid.innerHTML = '';
    werkDagen.forEach(dag => {
        const kaart = document.createElement('div');
        kaart.className = 'reflectie-dag';
        kaart.innerHTML = `<h4>${dag}</h4><div class="emotie-knoppen"></div>`;
        const ec = kaart.querySelector('.emotie-knoppen');
        ['😄', '😐', '🙁'].forEach(emo => {
            const b = document.createElement('button');
            b.className = 'emotie-knop'; b.innerText = emo;
            b.onclick = () => {
                ec.querySelectorAll('.emotie-knop').forEach(x => x.classList.remove('actief'));
                b.classList.add('actief');
                slaReflectieOp(dag, 'emotie', emo);
            };
            ec.appendChild(b);
        });
        const lIn = document.createElement('textarea'); lIn.className='reflectie-input'; lIn.placeholder='Hulpvraag?';
        lIn.onblur = () => slaReflectieOp(dag, 'hulpvraag', lIn.value);
        kaart.append(lIn);
        grid.appendChild(kaart);
    });
}

function berekenVoortgang() {
    const taken = document.querySelectorAll('.taak:not(.extra-taak):not(.dispenser-taak)');
    let t = 0, k = 0;
    taken.forEach(taak => {
        t++; if (taak.classList.contains('klaar')) k++;
    });
    const perc = t === 0 ? 0 : Math.round((k/t)*100);
    document.getElementById('voortgang-balk-vulling').style.width = perc + '%';
    document.getElementById('voortgang-percentage').innerText = `${k}/${t} taken af (${perc}%)`;
}

// --- 6. DATABASE OPSLAG ---
async function slaVinkjeOp(taak, klaar, aantal) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    await supabase.from('leerling_taken').upsert({
        leerling_naam: huidigeGebruiker, groep: huidigeGroep, taak_naam: taak, is_klaar: klaar, aantal_geklikt: aantal
    }, { onConflict: 'leerling_naam,taak_naam' });
}

async function slaReflectieOp(dag, type, waarde) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    let update = { leerling_naam: huidigeGebruiker, groep: huidigeGroep, dag: dag };
    update[type] = waarde;
    await supabase.from('leerling_reflecties').upsert(update, { onConflict: 'leerling_naam,dag' });
}

async function synchroniseerData() {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    const { data } = await supabase.from('leerling_taken').select('*').eq('leerling_naam', huidigeGebruiker);
    if (data) {
        data.forEach(d => {
            const el = document.querySelector(`[data-taak-naam="${d.taak_naam}"]`);
            if (el && d.is_klaar) el.classList.add('klaar');
        });
    }
}

// Kolom drop functionaliteit
document.querySelectorAll('.kolom').forEach(kol => {
    kol.ondragover = (e) => e.preventDefault();
    kol.ondrop = (e) => {
        const id = e.dataTransfer.getData('text');
        const item = document.getElementById(id);
        if (item) {
            if (item.classList.contains('dispenser-taak') && kol.id !== 'te-doen') {
                const kloon = item.cloneNode(true);
                kloon.id = 'taak-' + globaleTaakId++;
                kloon.classList.replace('dispenser-taak', 'kloon-taak');
                kloon.innerHTML += ` <button onclick="this.parentElement.setAttribute('data-aantal', (parseInt(this.parentElement.getAttribute('data-aantal')||0)+1)); this.nextSibling.innerText = this.parentElement.getAttribute('data-aantal') + 'x'">+</button> <span>0x</span>`;
                kol.appendChild(kloon);
            } else {
                kol.appendChild(item);
            }
        }
        berekenVoortgang();
    };
});