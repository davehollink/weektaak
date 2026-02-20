// script.js - Volledige versie met herstelde dropdown-logica

// --- 1. CONFIGURATIE ---
const SUPABASE_URL = 'https://hdohxcwwhzblvxlfpked.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2h4Y3d3aHpibHZ4bGZwa2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1OTk3OTMsImV4cCI6MjA4NzE3NTc5M30._TZI-zUEK4iZiDiMrCYpx7Kl9shQDSe2vTor8RszSeM';
let supabase = null;

// --- 2. DATABASE ---
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

let huidigeGroep = '';
let huidigeGebruiker = '';
let globaleTaakId = 1;
const werkDagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];

// --- 3. DROP DOWN LOGICA (Eerst laden!) ---
function updateLoginDropdown() {
    const groepSelect = document.getElementById('kies-groep');
    const wieSelect = document.getElementById('wie-logt-in');
    if (!groepSelect || !wieSelect) return;

    huidigeGroep = groepSelect.value;
    const namen = scholenDatabase[huidigeGroep] || [];
    
    wieSelect.innerHTML = '<option value="Docent">Leerkracht (Beheerder)</option>';
    namen.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.innerText = `Leerling: ${l}`;
        wieSelect.appendChild(opt);
    });
}

// --- 4. LOGIN & INITIALISATIE ---
async function login() {
    const wieSelect = document.getElementById('wie-logt-in');
    const groepSelect = document.getElementById('kies-groep');
    
    huidigeGebruiker = wieSelect.value;
    huidigeGroep = groepSelect.value;
    
    document.getElementById('ingelogde-gebruiker-tekst').innerText = huidigeGebruiker;
    document.getElementById('ingelogde-groep-tekst').innerText = huidigeGroep;
    document.getElementById('login-scherm').style.display = 'none';
    document.getElementById('planbord').style.display = 'block';
    
    if (huidigeGebruiker === 'Docent') {
        document.getElementById('docent-paneel').style.display = 'flex';
        document.getElementById('docent-acties').style.display = 'flex';
        document.getElementById('docent-overzicht').style.display = 'block';
        vulDynamischeCheckboxes();
    } else {
        document.getElementById('voortgang-container').style.display = 'block'; 
        document.getElementById('klaartaken-container').style.display = 'block'; 
        document.getElementById('leerling-acties-container').style.display = 'flex'; 
        document.getElementById('reflectie-container').style.display = 'block'; 
        laadReflectieBord();
        await synchroniseerData();
    }
    laadStandaardInhoud();
    berekenVoortgang();
}

// --- 5. DATA SYNC (SUPABASE) ---
async function slaVinkjeOp(taak, klaar, aantal = 0, extra = false) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    try {
        await supabase.from('leerling_taken').upsert({
            leerling_naam: huidigeGebruiker, groep: huidigeGroep, taak_naam: taak,
            is_klaar: klaar, aantal_geklikt: aantal, is_klaartaak: extra
        }, { onConflict: 'leerling_naam,taak_naam' });
    } catch (e) { console.error("Fout bij opslaan:", e); }
}

async function slaReflectieOp(dag, type, waarde) {
    if (!supabase || huidigeGebruiker === 'Docent') return;
    let data = { leerling_naam: huidigeGebruiker, groep: huidigeGroep, dag: dag };
    data[type] = waarde;
    try {
        await supabase.from('leerling_reflecties').upsert(data, { onConflict: 'leerling_naam,dag' });
    } catch (e) { console.error("Fout bij reflectie opslaan:", e); }
}

async function synchroniseerData() {
    if (!supabase) return;
    const { data: taken } = await supabase.from('leerling_taken').select('*').eq('leerling_naam', huidigeGebruiker);
    if (taken) {
        taken.forEach(t => {
            const el = document.querySelector(`[data-taak-naam="${t.taak_naam}"]`);
            if (el) {
                if (t.is_klaar) el.classList.add('klaar');
                if (t.aantal_geklikt > 0) {
                    const count = el.querySelector('strong');
                    if (count) count.innerText = t.aantal_geklikt;
                }
            }
        });
    }
}

// --- 6. UI ELEMENTEN ---
function bouwTaakElement(taakNaam, leerling = 'Iedereen', isExtra = false, isDispenser = false) {
    const el = document.createElement('div');
    el.className = 'taak' + (isExtra ? ' extra-taak' : '') + (isDispenser ? ' dispenser-taak' : '');
    el.id = 'taak-' + globaleTaakId++;
    el.setAttribute('draggable', 'true');
    el.setAttribute('data-taak-naam', taakNaam);
    el.setAttribute('data-leerling', leerling);
    el.innerHTML = `<span>${taakNaam}</span>`;

    if (!isDispenser) {
        el.onclick = () => {
            if (huidigeGebruiker === 'Docent') return;
            el.classList.toggle('klaar');
            slaVinkjeOp(taakNaam, el.classList.contains('klaar'), 0, isExtra);
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
        if (kol && kol.children.length <= 1) {
            kol.appendChild(bouwTaakElement('Rekenen (basistaak)'));
            kol.appendChild(bouwTaakElement('Spelling (basisles)'));
        }
    });
    const td = document.getElementById('te-doen');
    if (td && td.children.length <= 1) {
        td.appendChild(bouwTaakElement('Rekenen peiltaken'));
        td.appendChild(bouwTaakElement('Rekenen 5 eigen taken', 'Iedereen', false, true));
    }
    const kl = document.getElementById('klaartaken-lijst');
    if (kl && kl.children.length === 0) {
        ['Minecraft', 'Thema', 'Tekenen'].forEach(t => kl.appendChild(bouwTaakElement(t, 'Iedereen', true)));
    }
}

function laadReflectieBord() {
    const grid = document.getElementById('reflectie-dagen-grid');
    if (!grid) return;
    grid.innerHTML = '';
    werkDagen.forEach(dag => {
        const kaart = document.createElement('div');
        kaart.className = 'reflectie-dag';
        kaart.innerHTML = `<h4>${dag}</h4><div class="emotie-knoppen" id="emotie-container-${dag}"></div>`;
        const ec = kaart.querySelector('.emotie-knoppen');
        ['😄', '😐', '🙁'].forEach(emo => {
            const b = document.createElement('button'); b.className = 'emotie-knop'; b.innerText = emo;
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
    const taken = document.querySelectorAll('.taak:not(.extra-taak):not(.dispenser-taak):not(.kloon-taak)');
    let t = 0, k = 0;
    taken.forEach(taak => {
        if (taak.getAttribute('data-leerling') === 'Iedereen' || taak.getAttribute('data-leerling') === huidigeGebruiker) {
            t++; if (taak.classList.contains('klaar')) k++;
        }
    });
    const perc = t === 0 ? 0 : Math.round((k/t)*100);
    const vulling = document.getElementById('voortgang-balk-vulling');
    if (vulling) vulling.style.width = perc + '%';
    const txt = document.getElementById('voortgang-percentage');
    if (txt) txt.innerText = `${k}/${t} taken af (${perc}%)`;
}

function vulDynamischeCheckboxes() {
    const container = document.getElementById('dynamische-checkboxes');
    if (!container) return;
    container.innerHTML = '<span>Voor wie?</span><br><label><input type="checkbox" id="check-iedereen" checked> Iedereen</label>';
    actieveLeerlingenLijst.forEach(l => {
        container.innerHTML += `<label><input type="checkbox" class="leerling-check" value="${l}"> ${l}</label>`;
    });
}

// --- 7. STARTUP ---
window.onload = () => {
    // 1. Vul de dropdown direct
    updateLoginDropdown();
    document.getElementById('kies-groep').onchange = updateLoginDropdown;
    document.getElementById('login-knop').onclick = login;

    // 2. Start Supabase rustig op de achtergrond
    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
    } catch (e) { console.warn("Supabase start later."); }
};

// Sleep logica voor de kolommen
document.querySelectorAll('.kolom').forEach(kol => {
    kol.ondragover = (e) => e.preventDefault();
    kol.ondrop = (e) => {
        const id = e.dataTransfer.getData('text');
        const item = document.getElementById(id);
        if (!item) return;

        if (item.classList.contains('dispenser-taak') && kol.id !== 'te-doen') {
            const kloon = item.cloneNode(true);
            kloon.id = 'taak-' + globaleTaakId++;
            kloon.classList.replace('dispenser-taak', 'kloon-taak');
            kloon.innerHTML += ` <div class="taak-teller"><button class="t-plus">+</button> <strong>0</strong>x</div>`;
            const val = kloon.querySelector('strong');
            kloon.querySelector('.t-plus').onclick = (ev) => { 
                ev.stopPropagation(); let n = parseInt(val.innerText) + 1; val.innerText = n; 
                slaVinkjeOp(item.getAttribute('data-taak-naam'), true, n);
            };
            kol.appendChild(kloon);
        } else {
            kol.appendChild(item);
        }
        berekenVoortgang();
    };
});