// script.js - De motor van onze weektaak (Google Sheets Editie!)

// --- GOOGLE SHEETS INSTELLINGEN ---
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw36ZSn2dElXJDUrShUvVxiqGb1uJcULWsW29i68cRmXwhyg-7iH9-OmFpeiIcG2P4y/exec";

// --- Wachtwoord Instellingen ---
const DOCENT_WACHTWOORD = "Binnenstebuiten!";

// --- Elementen ---
const loginScherm = document.getElementById('login-scherm');
const planbord = document.getElementById('planbord');
const inlogKeuzeSectie = document.getElementById('inlog-keuze-sectie');
const wachtwoordSectie = document.getElementById('wachtwoord-sectie');

const kiesGroepSelect = document.getElementById('kies-groep');
const wieLogtInSelect = document.getElementById('wie-logt-in');
const naarWachtwoordKnop = document.getElementById('naar-wachtwoord-knop');
const terugNaarNaamKnop = document.getElementById('terug-naar-naam-knop');
const logoutKnop = document.getElementById('logout-knop');

const wachtwoordWelkom = document.getElementById('wachtwoord-welkom');
const docentWachtwoordSectie = document.getElementById('docent-wachtwoord-sectie');
const leerlingWachtwoordSectie = document.getElementById('leerling-wachtwoord-sectie');
const docentWachtwoordInput = document.getElementById('docent-wachtwoord-input');
const checkDocentWachtwoordKnop = document.getElementById('check-docent-wachtwoord');

const leerlingWachtwoordInput = document.getElementById('leerling-wachtwoord-input');
const checkLeerlingWachtwoordKnop = document.getElementById('check-leerling-wachtwoord');
const veranderWachtwoordKnop = document.getElementById('verander-wachtwoord-knop');
const wachtwoordModal = document.getElementById('wachtwoord-modal');
const sluitWachtwoordModal = document.getElementById('sluit-wachtwoord-modal');
const nieuwWachtwoordInput = document.getElementById('nieuw-wachtwoord-input');
const opslaanWachtwoordKnop = document.getElementById('opslaan-wachtwoord-knop');

const foutmeldingLogin = document.getElementById('foutmelding-login');
const bekijkWachtwoordenKnop = document.getElementById('bekijk-wachtwoorden-knop');

const docentPaneel = document.getElementById('docent-paneel');
const docentOverzicht = document.getElementById('docent-overzicht');
const docentActies = document.getElementById('docent-acties');
const voortgangContainer = document.getElementById('voortgang-container');
const klaartakenContainer = document.getElementById('klaartaken-container');
const prullenbak = document.getElementById('prullenbak');
const leerlingPrullenbakContainer = document.getElementById('leerling-acties-container');
const leerlingPrullenbak = document.getElementById('leerling-prullenbak');
const ingelogdeGebruikerTekst = document.getElementById('ingelogde-gebruiker-tekst');
const reflectieContainer = document.getElementById('reflectie-container');

const leerlingModal = document.getElementById('leerling-modal');
const modalInhoud = document.getElementById('modal-leerling-inhoud');
const sluitModalKnop = document.getElementById('sluit-modal');

// --- Database ---
const scholenDatabase = {
    'Groep 5 donkerblauw': ['William Ameen', 'Quintin Besselink', 'Levi Beumkes', 'Olivier Everdij', 'Jae Boxem', 'Luuk de Bruin', 'Stan Engelen', 'Tim Herms', 'Kiyaan Jagmohan', 'Nathan Kant', 'Carice Kok', 'Loë Korstanje', 'Fenna Lammers', 'Yvan Lapré', 'Vik van Ooijen', 'Roos Zeller', 'Vajen Goossens', 'Amy Borgers', 'Julian van Wachtendonk', 'Genova Nolten'],
    'Groep 5 lichtblauw': ['Tess Aagten', 'Yamour Bitar', 'Tim Bernink', 'Eslem Ekizkaya', 'Bram Flohil', 'Aimely Aimy Frenk', 'Job Gerver', 'Myla Jacobs', 'Duke Kudrya', 'Céline Harms', 'Lev van Lammerts Bueren', 'Lotte van Wezel', 'Stan Wijnveldt', 'Rheyven Tsang', 'Noah van den Toorn', 'Lucas Walvius', 'Sophie Rutgers', 'Sanne Zeller', 'Avin Yousef', 'Sev Hogenes'],
    'Groep 5 roze': ['Fay Bakker', 'Quinn Beumer', 'Dani Damen', 'Julian van Eekeren', 'Mille Eelvelt', 'Tess van Geelen', 'Zoey Hogerhuis', 'Sam ten Holder', 'Mare Jurjus', 'Liz Knipping', 'Roxeanne Van den Brink', 'Elsa Petit', 'Jolie Rasing', 'Tim Steenstra', 'Milou Peters', 'Maud Peeters', 'Gwen Sluiter', 'Owen Wolters', 'Luuk van der Winkel'],
    'Groep 6 groen': ['Lot van Baaren', 'Filip Bachusz', 'Sef Bergsma', 'Vienne Dauphin', 'Max Gerver', 'Faya van den Hoff', 'James de Jong', 'Jill Laurentzen', 'Suus van der Mark', 'Jip Mulders', 'Mees Mulders', 'Liv Sikkes', 'Evan Sluiter', 'Levi Sprong', 'Noud Teering', 'Jesse Teunissen', 'Fenne van der Velde', 'Sjors Vollebregt', 'Lars van Vorselen', 'Scott Wolters'],
    'Groep 6 paars': ['Jop van den Berg', 'Daley ten Berge', 'Melle Bosma', 'Jelte ten Dam', 'Jordan Derksen', 'Jace op de Dijk', 'Morris van Gendt', 'Jara Haaring', 'Marrit Hensen', 'Noud Hoekstra', 'Job van Horssen', 'Hugo Hullekes', 'Bo Kudrya', 'Davin Le', 'Marijn Tak', 'Tess van der Teems', 'Liam Truong', 'Niels de Vries', 'Luciano Wang', 'Emily Zhou', 'Pleun Zweerink', 'Gijs Schriever'],
    'Groep 7 blauw': ['Duuk van den Anker', 'Maelynn Berns', 'Noël Boers', 'Dex du Bois', 'Fayah Boxem', 'Sara ten Dam', 'Mick Derksen', 'Matz Drenth', 'Tara Engelen', 'Vuk Jankovic', 'Robin Janssen', 'Liv Kokke', 'Nova Lammerts van Bueren', 'Evi Lusing', 'Tijn van Mansom', 'Elin van Ooijen', 'Guusje Rikken', 'Jort Rikken', 'Lara Scheepers', 'Thom Smith', 'Kyliam Tsang'],
    'Groep 7 paars': ['Mattia Agus', 'Mila Blaauw', 'Rens Eestermans', 'Seth de Feber', 'Jens Flohil', 'Sam Janssen', 'Sam Kuster', 'Stijn Meijer', 'Giulia Oostenrijk', 'James Spruitenburg', 'Leo Vastert', 'Dylan Willemsen', 'Benjamin Woeltjes', 'Cas Zeller', 'Jill Klaassen', 'Siem van Mullem', 'Nicole Tovar Velasquez', 'Pim van Reem', 'Thomas Engels', 'Lola Evers'],
    'Groep 7 turquoise': ['Liliya Aartse Tuijn', 'Evi Arends', 'Fay Bouwmeister', 'Joe Derksen', 'Niki van Dongen', 'Emma van Eekeren', 'Finn Eelvelt', 'Jada Goossens', 'Guusje Hageraats', 'Valerie Jolink', 'Maeson Menke', 'Isa Nijs', 'Denise Orelio', 'Lucas Peters', 'Stijn Postma', 'Tijn Stienissen', 'Tim Visser', 'Joris Vleeming', 'Jasmijn van Wachtendonk', 'Roan Zwart', 'Milan Zweers', 'Noah van den Hoff', 'Omar Titi'],
    'Groep 8 geel': ['Mayla Bakker', 'Finn van de Belt', 'Jolie Benders', 'Liz Beumer', 'Jaylee de Boer', 'Mirthe Creemers', 'Féline Degen', 'Jack Eskes', 'Fenne Lentjes', 'Miles Lina', 'Kyona Lindeman', 'Matvey Maranov', 'Lucas Orelio', 'Timon Schmitz', 'Yannick Jacobs', 'Noor van Wely', 'Pleun Gerver', 'Sarah Kersten', 'Juul Zweerink', 'Mirthe Gerritsen', 'Jayben Vahlkamp'],
    'Groep 8 oranje': ['Louise Bergen', 'Tibbe Broekhuis', 'Tess Delsink', 'Kai Everdij', 'Jula Evers', 'Anne van Elk', 'Jasmijn Kok', 'Thalesia Koenen', 'Elli Kroon', 'Siem Lentjes', 'Jayda Lindeman', 'Luuk Megens', 'Dante van Rossum', 'Jake Schuring', 'Sepp Struijker Boudier', 'Bram van Steenoven', 'Mert Pasaoglu', 'Teun Peeters', 'Dex Schuil', 'Marly Ramsoedh', 'Nikki Zwart', 'Jolie van der Kreeft'],
    'Groep 8 roze': ['Amber Beekman', 'Nine Benders', 'Ties van den Berg', 'Allison Mae Bosveld', 'Jaap Willem Hoogenhout', 'Jackie van den Oever', 'Maile Korstanje', 'Esmee van der Kreeft', 'Jasper Guijt', 'Summer Liu', 'Skyler Lucassen', 'Lola Mourelle Fernandez', 'Sophie Neijenhuis', 'Alissa Peelen', 'Rosa Walvius', 'Aiden Vaanholt', 'Senn van der Winkel', 'Vanity Hofs', 'Jelle Kersten', 'Bent Teunissen', 'Zonne Triemstra']
};

const alleLeerlingen = Object.values(scholenDatabase).flat();
let huidigeGroep = '';
let huidigeGebruiker = '';
let actieveLeerlingenLijst = []; 
let groepenGeinitialiseerd = {}; 
let globaleTaakId = 1; 

const reflectieData = {};
const werkDagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const wachtwoordenDatabase = {}; 

// --- Google Sheets Functies ---
async function haalDataUitGoogle(sheetNaam) {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${sheetNaam}`);
        return await response.json();
    } catch (error) {
        console.error("Kon data niet laden uit Google Sheets:", error);
        return [];
    }
}

async function stuurDataNaarGoogle(payload) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
    } catch (error) {
        console.error("Kon niet opslaan in Google Sheets:", error);
    }
}

// --- Initialisatie Reflectie & Standaard Wachtwoorden ---
function initLokaal() {
    for (let groepNaam in scholenDatabase) {
        let delen = groepNaam.split(' ');
        let nummer = delen[1]; 
        let kleur = delen.slice(2).join('').toLowerCase(); 
        let standaardWachtwoord = kleur + nummer;

        scholenDatabase[groepNaam].forEach(leerling => {
            wachtwoordenDatabase[leerling] = standaardWachtwoord;
            reflectieData[leerling] = {};
            werkDagen.forEach(dag => {
                reflectieData[leerling][dag] = { emotie: '', lastig: '', hulp: '' };
            });
        });
    }
}
initLokaal();

// --- Sync met Google Sheets (op de achtergrond) ---
async function syncMetGoogle() {
    // Haal wachtwoorden op
    const cloudWachtwoorden = await haalDataUitGoogle('wachtwoorden');
    cloudWachtwoorden.forEach(rij => {
        if (rij.leerling && rij.wachtwoord) {
            wachtwoordenDatabase[rij.leerling] = String(rij.wachtwoord);
        }
    });

    // Haal reflecties op
    const cloudReflecties = await haalDataUitGoogle('reflecties');
    cloudReflecties.forEach(rij => {
        if (reflectieData[rij.leerling] && reflectieData[rij.leerling][rij.dag]) {
            reflectieData[rij.leerling][rij.dag] = { 
                emotie: rij.emotie || '', 
                lastig: rij.lastig || '', 
                hulp: rij.hulp || '' 
            };
        }
    });
}
syncMetGoogle(); // Direct starten bij openen website

// --- Menu's & Navigatie ---
function updateLoginDropdown() {
    huidigeGroep = kiesGroepSelect.value;
    wieLogtInSelect.innerHTML = '';
    
    if (huidigeGroep === "") {
        wieLogtInSelect.innerHTML = '<option value="">-- Kies eerst een groep --</option>';
        actieveLeerlingenLijst = [];
        return;
    }

    actieveLeerlingenLijst = scholenDatabase[huidigeGroep] || [];
    wieLogtInSelect.innerHTML = `<option value="Docent">Leerkracht (Beheerder)</option>`;
    
    actieveLeerlingenLijst.forEach(leerling => {
        const optie = document.createElement('option');
        optie.value = leerling;
        optie.innerText = `Leerling: ${leerling}`;
        wieLogtInSelect.appendChild(optie);
    });
}

kiesGroepSelect.addEventListener('change', updateLoginDropdown);

function vulDynamischeCheckboxes() {
    const checkboxContainer = document.getElementById('dynamische-checkboxes');
    checkboxContainer.innerHTML = `<span class="checkbox-titel">Voor wie?</span>
                                   <label><input type="checkbox" id="check-iedereen" value="Iedereen" checked> Hele groep</label>`;
    
    actieveLeerlingenLijst.forEach(leerling => {
        checkboxContainer.innerHTML += `<label><input type="checkbox" class="leerling-check" value="${leerling}"> ${leerling}</label>`;
    });

    const checkIedereen = document.getElementById('check-iedereen');
    const leerlingChecks = document.querySelectorAll('.leerling-check');

    checkIedereen.addEventListener('change', () => {
        if (checkIedereen.checked) leerlingChecks.forEach(box => box.checked = false);
    });

    leerlingChecks.forEach(box => {
        box.addEventListener('change', () => {
            if (box.checked) checkIedereen.checked = false;
        });
    });
}

// --- Wachtwoord Flow ---
naarWachtwoordKnop.addEventListener('click', () => {
    if (kiesGroepSelect.value === "" || wieLogtInSelect.value === "") {
        alert("Kies eerst een groep en een naam!");
        return;
    }

    huidigeGebruiker = wieLogtInSelect.value;
    huidigeGroep = kiesGroepSelect.value;
    foutmeldingLogin.style.display = 'none';
    
    wachtwoordWelkom.innerText = `Hoi, ${huidigeGebruiker}!`;
    inlogKeuzeSectie.style.display = 'none';
    wachtwoordSectie.style.display = 'block';

    if (huidigeGebruiker === 'Docent') {
        docentWachtwoordSectie.style.display = 'block';
        leerlingWachtwoordSectie.style.display = 'none';
        docentWachtwoordInput.value = '';
        docentWachtwoordInput.focus();
    } else {
        docentWachtwoordSectie.style.display = 'none';
        leerlingWachtwoordSectie.style.display = 'block';
        leerlingWachtwoordInput.value = '';
        leerlingWachtwoordInput.focus();
    }
});

terugNaarNaamKnop.addEventListener('click', () => {
    wachtwoordSectie.style.display = 'none';
    inlogKeuzeSectie.style.display = 'block';
});

// Controleer Wachtwoord Docent
checkDocentWachtwoordKnop.addEventListener('click', controleerDocentWachtwoord);
docentWachtwoordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') controleerDocentWachtwoord();
});

function controleerDocentWachtwoord() {
    if (docentWachtwoordInput.value === DOCENT_WACHTWOORD) {
        voerSuccesvolleLoginUit();
    } else {
        foutmeldingLogin.style.display = 'block';
    }
}

// Controleer Wachtwoord Leerling
checkLeerlingWachtwoordKnop.addEventListener('click', controleerLeerlingWachtwoord);
leerlingWachtwoordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') controleerLeerlingWachtwoord();
});

function controleerLeerlingWachtwoord() {
    // Wachtwoord controleren als string (zodat 08 en 8 matchen indien nodig, maar hier is het exact)
    if (leerlingWachtwoordInput.value === wachtwoordenDatabase[huidigeGebruiker]) {
        voerSuccesvolleLoginUit();
    } else {
        foutmeldingLogin.style.display = 'block';
    }
}

// --- Wachtwoord Wijzigen (Door leerling) ---
veranderWachtwoordKnop.addEventListener('click', () => {
    nieuwWachtwoordInput.value = wachtwoordenDatabase[huidigeGebruiker]; 
    wachtwoordModal.style.display = 'flex';
});

sluitWachtwoordModal.addEventListener('click', () => {
    wachtwoordModal.style.display = 'none';
});

opslaanWachtwoordKnop.addEventListener('click', () => {
    const nieuwWw = nieuwWachtwoordInput.value.trim();
    if (nieuwWw !== '') {
        wachtwoordenDatabase[huidigeGebruiker] = nieuwWw;
        
        // Opslaan in Google Sheets
        stuurDataNaarGoogle({ 
            sheet: 'wachtwoorden', 
            action: 'updateWachtwoord', 
            row: { leerling: huidigeGebruiker, wachtwoord: nieuwWw }
        });
        
        alert('Jouw wachtwoord is succesvol gewijzigd!');
        wachtwoordModal.style.display = 'none';
    } else {
        alert('Je wachtwoord mag niet leeg zijn!');
    }
});


// --- Daadwerkelijke Inlog ---
function voerSuccesvolleLoginUit() {
    ingelogdeGebruikerTekst.innerText = huidigeGebruiker;
    wachtwoordSectie.style.display = 'none';
    loginScherm.style.display = 'none';
    planbord.style.display = 'block';
    
    vulDynamischeCheckboxes();

    if (huidigeGebruiker === 'Docent') {
        veranderWachtwoordKnop.style.display = 'none'; 
        docentPaneel.style.display = 'flex';
        docentOverzicht.style.display = 'block';
        docentActies.style.display = 'flex'; 
        voortgangContainer.style.display = 'none'; 
        
        klaartakenContainer.style.display = 'block'; 
        klaartakenContainer.classList.remove('klaartaken-vergrendeld'); 
        klaartakenContainer.classList.add('ontgrendeld');
        document.querySelector('.klaarkaart-invoer').style.display = 'none'; 
        
        const klaartakenSlotTekst = document.getElementById('klaartaken-slot-tekst');
        klaartakenSlotTekst.innerText = "Beheer hier de extra taken voor de klas."; 
        
        leerlingPrullenbakContainer.style.display = 'none';
        reflectieContainer.style.display = 'none'; 
    } else {
        veranderWachtwoordKnop.style.display = 'inline-block'; 
        docentPaneel.style.display = 'none';
        docentOverzicht.style.display = 'none';
        docentActies.style.display = 'none';
        voortgangContainer.style.display = 'block'; 
        klaartakenContainer.style.display = 'block'; 
        document.querySelector('.klaarkaart-invoer').style.display = 'flex';
        leerlingPrullenbakContainer.style.display = 'flex'; 
        reflectieContainer.style.display = 'block'; 
        laadReflectieBord(); 
        vulReflectieSchermVoorLeerling(); 
    }

    laadStandaardInhoud();
    updateTaakZichtbaarheid();
    updateKlaarWeergave(); 
    berekenVoortgang(); 
}

logoutKnop.addEventListener('click', () => {
    planbord.style.display = 'none';
    loginScherm.style.display = 'block';
    inlogKeuzeSectie.style.display = 'block';
    wachtwoordSectie.style.display = 'none';
});

// --- Wachtwoordenlijst Tonen (Voor docent) ---
bekijkWachtwoordenKnop.addEventListener('click', () => {
    let wachtwoordHtml = `<div class="wachtwoorden-lijst">`;
    actieveLeerlingenLijst.forEach(leerling => {
        const ww = wachtwoordenDatabase[leerling];
        wachtwoordHtml += `
            <div class="wachtwoord-rij">
                <span>${leerling}</span>
                <span style="font-weight: normal; font-family: monospace;">${ww}</span>
            </div>
        `;
    });
    wachtwoordHtml += `</div>`;

    modalInhoud.innerHTML = `
        <h4>Wachtwoorden - ${huidigeGroep}</h4>
        ${wachtwoordHtml}
    `;
    leerlingModal.style.display = 'flex';
});

// --- REFLECTIE BEHEREN & OPSLAAN ---
function laadReflectieBord() {
    const reflectieGrid = document.getElementById('reflectie-dagen-grid');
    if (reflectieGrid.children.length > 0) return; 
    const emoties = ['😄', '😐', '🙁']; 
    werkDagen.forEach(dag => {
        const dagKaart = document.createElement('div');
        dagKaart.classList.add('reflectie-dag');
        const titel = document.createElement('h4');
        titel.innerText = dag;
        dagKaart.appendChild(titel);
        
        const emotieContainer = document.createElement('div');
        emotieContainer.classList.add('emotie-knoppen');
        emotieContainer.id = `emotie-container-${dag}`;
        emoties.forEach(emotie => {
            const btn = document.createElement('button');
            btn.classList.add('emotie-knop');
            btn.innerText = emotie;
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                const alleKnoppen = emotieContainer.querySelectorAll('.emotie-knop');
                alleKnoppen.forEach(k => k.classList.remove('actief'));
                btn.classList.add('actief');
                if (huidigeGebruiker !== 'Docent') {
                    reflectieData[huidigeGebruiker][dag].emotie = emotie;
                    // Opslaan in Google!
                    stuurDataNaarGoogle({ 
                        sheet: 'reflecties', 
                        action: 'updateReflectie', 
                        row: { 
                            id: huidigeGebruiker + "_" + dag,
                            leerling: huidigeGebruiker, 
                            dag: dag, 
                            emotie: emotie, 
                            lastig: reflectieData[huidigeGebruiker][dag].lastig,
                            hulp: reflectieData[huidigeGebruiker][dag].hulp
                        }
                    });
                }
            });
            emotieContainer.appendChild(btn);
        });
        dagKaart.appendChild(emotieContainer);
        
        // LASTIG TEKSTVAK (Gebruikt 'change' ipv 'input' om niet te spammen)
        const moeilijkInput = document.createElement('textarea');
        moeilijkInput.classList.add('reflectie-input');
        moeilijkInput.id = `input-lastig-${dag}`;
        moeilijkInput.placeholder = 'Wat vond je vandaag lastig?';
        moeilijkInput.addEventListener('change', (e) => {
            if (huidigeGebruiker !== 'Docent') {
                reflectieData[huidigeGebruiker][dag].lastig = e.target.value;
                stuurDataNaarGoogle({ 
                    sheet: 'reflecties', action: 'updateReflectie', 
                    row: { id: huidigeGebruiker + "_" + dag, leerling: huidigeGebruiker, dag: dag, emotie: reflectieData[huidigeGebruiker][dag].emotie, lastig: e.target.value, hulp: reflectieData[huidigeGebruiker][dag].hulp }
                });
            }
        });
        dagKaart.appendChild(moeilijkInput);
        
        // HULP TEKSTVAK
        const hulpInput = document.createElement('textarea');
        hulpInput.classList.add('reflectie-input');
        hulpInput.id = `input-hulp-${dag}`;
        hulpInput.placeholder = 'Heb je nog een hulpvraag?';
        hulpInput.addEventListener('change', (e) => {
            if (huidigeGebruiker !== 'Docent') {
                reflectieData[huidigeGebruiker][dag].hulp = e.target.value;
                stuurDataNaarGoogle({ 
                    sheet: 'reflecties', action: 'updateReflectie', 
                    row: { id: huidigeGebruiker + "_" + dag, leerling: huidigeGebruiker, dag: dag, emotie: reflectieData[huidigeGebruiker][dag].emotie, lastig: reflectieData[huidigeGebruiker][dag].lastig, hulp: e.target.value }
                });
            }
        });
        dagKaart.appendChild(hulpInput);
        reflectieGrid.appendChild(dagKaart);
    });
}

function vulReflectieSchermVoorLeerling() {
    if (huidigeGebruiker === 'Docent') return;
    werkDagen.forEach(dag => {
        const data = reflectieData[huidigeGebruiker][dag];
        document.getElementById(`input-lastig-${dag}`).value = data.lastig;
        document.getElementById(`input-hulp-${dag}`).value = data.hulp;
        const knoppen = document.getElementById(`emotie-container-${dag}`).querySelectorAll('.emotie-knop');
        knoppen.forEach(btn => {
            btn.classList.remove('actief');
            if (btn.innerText === data.emotie) {
                btn.classList.add('actief');
            }
        });
    });
}

function updateKlaarWeergave() {
    const alleTaken = document.querySelectorAll('.taak');
    alleTaken.forEach(taak => {
        let klaarDoor = taak.getAttribute('data-klaar-door') || '';
        let klaarLijst = klaarDoor.split(',').filter(n => n);
        if (huidigeGebruiker === 'Docent') {
            taak.classList.remove('klaar'); 
        } else {
            if (klaarLijst.includes(huidigeGebruiker)) {
                taak.classList.add('klaar');
            } else {
                taak.classList.remove('klaar');
            }
        }
    });
}

function updateTaakZichtbaarheid() {
    let verborgenOriginelen = [];
    if (huidigeGebruiker !== 'Docent') {
        document.querySelectorAll('.kloon-taak').forEach(k => {
            if (k.getAttribute('data-leerling') === huidigeGebruiker && k.getAttribute('data-groep') === huidigeGroep) {
                let bronId = k.getAttribute('data-kloon-van');
                if (bronId) verborgenOriginelen.push(bronId);
            }
        });
    }

    const alleTaken = document.querySelectorAll('.taak');
    alleTaken.forEach(taak => {
        const doelgroep = taak.getAttribute('data-leerling');
        const taakGroep = taak.getAttribute('data-groep'); 
        
        let hoortBijActieveGroep = (taakGroep === huidigeGroep) && 
                                   (doelgroep === 'Iedereen' || actieveLeerlingenLijst.includes(doelgroep));

        const isKloon = taak.classList.contains('kloon-taak');
        const isEigenKlaartaak = taak.classList.contains('extra-taak') && taak.getAttribute('data-maker') === 'leerling';
        
        if (!hoortBijActieveGroep) {
            taak.style.display = 'none';
            return;
        }

        if (huidigeGebruiker === 'Docent') {
            if (isKloon || isEigenKlaartaak) {
                taak.style.display = 'none'; 
            } else {
                taak.style.display = 'flex'; 
            }
        } else {
            if (taak.id && verborgenOriginelen.includes(taak.id)) {
                taak.style.display = 'none';
            }
            else if (doelgroep === 'Iedereen' || doelgroep === huidigeGebruiker) {
                taak.style.display = 'flex'; 
            } else {
                taak.style.display = 'none'; 
            }
        }
    });
}

function berekenVoortgang() {
    const alleOriginelen = Array.from(document.querySelectorAll('.taak:not(.extra-taak):not(.dispenser-taak):not(.kloon-taak)'))
                                .filter(t => t.getAttribute('data-groep') === huidigeGroep);

    if (huidigeGebruiker === 'Docent') {
        const overzichtLijst = document.getElementById('overzicht-lijst');
        overzichtLijst.innerHTML = ''; 
        
        actieveLeerlingenLijst.forEach(leerling => {
            let totaal = 0;
            let klaar = 0;
            let afgerondeNamenLijst = [];
            let dispenserCounts = {}; 
            
            alleOriginelen.forEach(origineel => {
                const doelgroep = origineel.getAttribute('data-leerling');
                if (doelgroep === 'Iedereen' || doelgroep === leerling) {
                    totaal++;
                    
                    let isKlaar = false;
                    let klaarDoor = origineel.getAttribute('data-klaar-door') || '';
                    if (klaarDoor.split(',').includes(leerling)) {
                        isKlaar = true;
                    } else {
                        const kloon = document.querySelector(`.kloon-taak[data-kloon-van="${origineel.id}"][data-leerling="${leerling}"]`);
                        if (kloon && kloon.classList.contains('klaar')) {
                            isKlaar = true;
                        }
                    }

                    if (isKlaar) {
                        klaar++;
                        afgerondeNamenLijst.push(origineel.getAttribute('data-taak-naam'));
                    }
                }
            });
            
            document.querySelectorAll(`.kloon-taak[data-is-dispenser-kloon="true"][data-leerling="${leerling}"][data-groep="${huidigeGroep}"]`).forEach(kloon => {
                let taakNaam = kloon.getAttribute('data-taak-naam');
                let count = parseInt(kloon.getAttribute('data-aantal') || '0', 10);
                if (count > 0) {
                    if (!dispenserCounts[taakNaam]) dispenserCounts[taakNaam] = 0;
                    dispenserCounts[taakNaam] += count; 
                }
            });

            Object.keys(dispenserCounts).forEach(naam => {
                afgerondeNamenLijst.push(`${dispenserCounts[naam]}x ${naam}`);
            });

            document.querySelectorAll(`.extra-taak[data-groep="${huidigeGroep}"]`).forEach(taak => {
                const doelgroep = taak.getAttribute('data-leerling');
                let isKlaar = false;
                if (doelgroep === leerling && taak.classList.contains('klaar')) isKlaar = true;
                if (doelgroep === 'Iedereen') {
                    let klaarDoor = taak.getAttribute('data-klaar-door') || '';
                    if (klaarDoor.split(',').includes(leerling)) isKlaar = true;
                }
                if (isKlaar) {
                    afgerondeNamenLijst.push(taak.getAttribute('data-taak-naam') + ' 🎮');
                }
            });
            
            let percentage = totaal === 0 ? 0 : Math.round((klaar / totaal) * 100);
            
            const rij = document.createElement('div');
            rij.classList.add('leerling-voortgang-rij');
            rij.innerHTML = `<span class="leerling-naam-klikbaar"><strong>${leerling} 🔍</strong></span> <span>${klaar} / ${totaal} af (${percentage}%)</span>`;
            
            rij.querySelector('.leerling-naam-klikbaar').addEventListener('click', () => {
                openLeerlingModal(leerling, afgerondeNamenLijst);
            });

            overzichtLijst.appendChild(rij);
        });
        
    } else {
        let totaal = 0;
        let klaar = 0;
        
        alleOriginelen.forEach(origineel => {
            const doelgroep = origineel.getAttribute('data-leerling');
            if (doelgroep === 'Iedereen' || doelgroep === huidigeGebruiker) {
                totaal++;

                let isKlaar = false;
                let klaarDoor = origineel.getAttribute('data-klaar-door') || '';
                if (klaarDoor.split(',').includes(huidigeGebruiker)) {
                    isKlaar = true;
                } else {
                    const kloon = document.querySelector(`.kloon-taak[data-kloon-van="${origineel.id}"][data-leerling="${huidigeGebruiker}"]`);
                    if (kloon && kloon.classList.contains('klaar')) {
                        isKlaar = true;
                    }
                }

                if (isKlaar) klaar++;
            }
        });
        
        let percentage = totaal === 0 ? 0 : Math.round((klaar / totaal) * 100);
        
        document.getElementById('voortgang-percentage').innerText = `${klaar} van de ${totaal} taken af (${percentage}%)`;
        document.getElementById('voortgang-balk-vulling').style.width = `${percentage}%`;

        const klaartakenSlotTekst = document.getElementById('klaartaken-slot-tekst');

        if (percentage === 100 && totaal > 0) {
            klaartakenContainer.classList.remove('klaartaken-vergrendeld');
            klaartakenContainer.classList.add('ontgrendeld');
            klaartakenSlotTekst.innerText = "🎉 Kies een leuke extra taak of bedenk er zelf één!";
        } else {
            klaartakenContainer.classList.add('klaartaken-vergrendeld');
            klaartakenContainer.classList.remove('ontgrendeld');
            klaartakenSlotTekst.innerText = "Rond eerst je weektaak af."; 
        }
    }
}

function openLeerlingModal(leerling, afgerondeNamenLijst) {
    let takenHtml = afgerondeNamenLijst.length > 0 
        ? `<ul class="detail-taken-lijst">` + afgerondeNamenLijst.map(n => `<li>${n}</li>`).join('') + `</ul>`
        : `<p style="font-size: 14px; color: var(--lichtbruin); margin-top: 5px;">Nog geen taken afgerond.</p>`;
    
    let reflectieHtml = '';
    werkDagen.forEach(dag => {
        const rData = reflectieData[leerling][dag];
        if (rData.emotie !== '' || rData.lastig !== '' || rData.hulp !== '') {
            reflectieHtml += `
                <div class="detail-dag-reflectie">
                    <strong>${dag} ${rData.emotie}</strong>
                    ${rData.lastig ? `<p><em>Lastig:</em> ${rData.lastig}</p>` : ''}
                    ${rData.hulp ? `<p><em>Hulpvraag:</em> ${rData.hulp}</p>` : ''}
                </div>
            `;
        }
    });
    if (reflectieHtml === '') reflectieHtml = `<p style="font-size: 14px; color: var(--lichtbruin); margin-top: 5px;">Nog geen reflecties ingevuld.</p>`;

    modalInhoud.innerHTML = `
        <h4>Overzicht van ${leerling}</h4>
        <div class="detail-sectie">
            <h5>✅ Afgeronde taken</h5>
            ${takenHtml}
        </div>
        <div class="detail-sectie">
            <h5>📝 Reflecties</h5>
            ${reflectieHtml}
        </div>
    `;
    leerlingModal.style.display = 'flex';
}

window.addEventListener('click', (e) => { 
    if (e.target === leerlingModal) leerlingModal.style.display = 'none'; 
    if (e.target === wachtwoordModal) wachtwoordModal.style.display = 'none'; 
});
sluitModalKnop.addEventListener('click', () => { leerlingModal.style.display = 'none'; });

// --- Taken Bouwen ---
function bouwTaakElement(taakNaam, leerlingNaam = 'Iedereen', isExtra = false, isDispenser = false, taakGroep = huidigeGroep, maker = 'docent') {
    const taakElement = document.createElement('div');
    taakElement.classList.add('taak');
    taakElement.id = 'taak-' + globaleTaakId++; 
    if (isExtra) taakElement.classList.add('extra-taak');
    if (isDispenser) taakElement.classList.add('dispenser-taak'); 
    
    taakElement.setAttribute('draggable', 'true'); 
    taakElement.setAttribute('data-leerling', leerlingNaam);
    taakElement.setAttribute('data-taak-naam', taakNaam); 
    taakElement.setAttribute('data-klaar-door', '');
    taakElement.setAttribute('data-groep', taakGroep); 
    taakElement.setAttribute('data-maker', maker);

    if (leerlingNaam !== 'Iedereen') {
        const labelElement = document.createElement('div');
        labelElement.classList.add('taak-leerling-label');
        labelElement.innerText = leerlingNaam;
        taakElement.appendChild(labelElement);
    }
    if (isExtra) {
        const extraIcoon = document.createElement('div');
        extraIcoon.classList.add('taak-leerling-label');
        extraIcoon.style.backgroundColor = '#cca300';
        extraIcoon.innerText = 'Klaartaak 🎮';
        taakElement.appendChild(extraIcoon);
    }
    const tekstElement = document.createElement('span');
    tekstElement.innerText = taakNaam;
    taakElement.appendChild(tekstElement);
    
    if (!isDispenser) {
        taakElement.addEventListener('click', function() {
            if (huidigeGebruiker === 'Docent') return;
            let klaarDoor = taakElement.getAttribute('data-klaar-door') || '';
            let klaarLijst = klaarDoor.split(',').filter(n => n);
            if (klaarLijst.includes(huidigeGebruiker)) {
                klaarLijst = klaarLijst.filter(n => n !== huidigeGebruiker);
                taakElement.classList.remove('klaar');
            } else {
                klaarLijst.push(huidigeGebruiker);
                taakElement.classList.add('klaar');
            }
            taakElement.setAttribute('data-klaar-door', klaarLijst.join(','));
            berekenVoortgang();
        });
    }
    maakTaakSleepbaar(taakElement);
    return taakElement;
}

function bouwVasteTaakElement(hoofdNaam, subNaam, taakGroep = huidigeGroep) {
    const taakElement = document.createElement('div');
    taakElement.classList.add('taak', 'vaste-taak'); 
    taakElement.id = 'taak-' + globaleTaakId++;
    taakElement.setAttribute('data-leerling', 'Iedereen'); 
    taakElement.setAttribute('data-taak-naam', subNaam ? `${hoofdNaam} (${subNaam})` : hoofdNaam); 
    taakElement.setAttribute('data-klaar-door', '');
    taakElement.setAttribute('data-groep', taakGroep); 
    taakElement.setAttribute('draggable', 'true'); 
    
    const labelElement = document.createElement('div');
    labelElement.classList.add('taak-leerling-label');
    labelElement.style.backgroundColor = 'var(--donkergroen)';
    labelElement.innerText = 'Vaste Taak';
    taakElement.appendChild(labelElement);
    
    const tekstElement = document.createElement('span');
    if (subNaam) {
        tekstElement.innerHTML = `<strong>${hoofdNaam}</strong><br><span style="font-size: 0.85em; opacity: 0.8;">${subNaam}</span>`;
    } else {
        tekstElement.innerHTML = `<strong>${hoofdNaam}</strong>`;
    }
    taakElement.appendChild(tekstElement);
    
    taakElement.addEventListener('click', function() {
        if (huidigeGebruiker === 'Docent') return;
        let klaarDoor = taakElement.getAttribute('data-klaar-door') || '';
        let klaarLijst = klaarDoor.split(',').filter(n => n);
        if (klaarLijst.includes(huidigeGebruiker)) {
            klaarLijst = klaarLijst.filter(n => n !== huidigeGebruiker);
            taakElement.classList.remove('klaar');
        } else {
            klaarLijst.push(huidigeGebruiker);
            taakElement.classList.add('klaar');
        }
        taakElement.setAttribute('data-klaar-door', klaarLijst.join(','));
        berekenVoortgang(); 
    });
    
    maakTaakSleepbaar(taakElement);
    return taakElement;
}

function laadStandaardInhoud() {
    if (!groepenGeinitialiseerd[huidigeGroep]) {
        
        if (huidigeGroep === 'Groep 8 oranje') {
            const dagen = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
            const vasteVakken = [
                { naam: 'Rekenen', sub: 'basistaak' },
                { naam: 'Spelling', sub: 'basisles' }
            ];
            dagen.forEach(dagNaam => {
                const dagKolom = document.getElementById(dagNaam);
                vasteVakken.forEach(vak => {
                    const taak = bouwVasteTaakElement(vak.naam, vak.sub, huidigeGroep);
                    dagKolom.appendChild(taak);
                });
            });

            const teDoenKolom = document.getElementById('te-doen');
            
            const normaleTaken = ['Rekenen peiltaken', 'Woordzoeker Staal'];
            normaleTaken.forEach(taakNaam => {
                const nieuweTaak = bouwTaakElement(taakNaam, 'Iedereen', false, false, huidigeGroep, 'docent');
                nieuweTaak.classList.add('standaard-te-doen'); 
                teDoenKolom.appendChild(nieuweTaak);
            });
            
            const dispenserTaken = ['Rekenen eigen taken', 'Staal oefensoftware'];
            dispenserTaken.forEach(taakNaam => {
                teDoenKolom.appendChild(bouwTaakElement(taakNaam, 'Iedereen', false, true, huidigeGroep, 'docent'));
            });

            const klaartakenLijst = document.getElementById('klaartaken-lijst');
            const deKlaarTaken = ['Minecraft Education', 'Thema onderzoek', 'Tekenen'];
            deKlaarTaken.forEach(taakNaam => {
                const taak = bouwTaakElement(taakNaam, 'Iedereen', true, false, huidigeGroep, 'docent');
                klaartakenLijst.appendChild(taak);
            });
        }
        
        groepenGeinitialiseerd[huidigeGroep] = true;
    }
}

document.getElementById('voeg-eigen-klaartaak-toe').addEventListener('click', () => {
    const invoerVeld = document.getElementById('eigen-klaarkaart');
    const eigenTaakTekst = invoerVeld.value.trim();
    if(eigenTaakTekst !== '') {
        const klaartakenLijst = document.getElementById('klaartaken-lijst');
        const nieuweKaart = bouwTaakElement(eigenTaakTekst, huidigeGebruiker, true, false, huidigeGroep, 'leerling');
        klaartakenLijst.appendChild(nieuweKaart);
        invoerVeld.value = ''; 
    }
});

// --- UITGEBREID DOCENTEN PANEEL ---
const taakInput = document.getElementById('nieuwe-taak-input');
const voegTaakToeKnop = document.getElementById('voeg-taak-toe-knop');

function voegNieuweTaakToe() {
    const nieuweTaakTekst = taakInput.value.trim(); 
    const taakType = document.getElementById('taak-type-select').value;
    let taakKolomId = document.getElementById('taak-kolom-select').value;
    
    if (taakType === 'klaartaak') {
        taakKolomId = 'klaartaken-lijst';
    }
    
    if (nieuweTaakTekst !== '') {
        const doelKolom = document.getElementById(taakKolomId);
        const checkIedereen = document.getElementById('check-iedereen');
        const leerlingChecks = document.querySelectorAll('.leerling-check');
        
        let gekozenLeerlingen = [];
        if (checkIedereen && checkIedereen.checked) {
            gekozenLeerlingen.push('Iedereen');
        } else {
            leerlingChecks.forEach(box => {
                if (box.checked) gekozenLeerlingen.push(box.value);
            });
            if (gekozenLeerlingen.length === 0) gekozenLeerlingen.push('Iedereen');
        }

        gekozenLeerlingen.forEach(leerling => {
            let nieuweTaak;
            if (taakType === 'vast') {
                nieuweTaak = bouwVasteTaakElement(nieuweTaakTekst, '', huidigeGroep);
                nieuweTaak.setAttribute('data-leerling', leerling);
                if(leerling !== 'Iedereen') {
                     const label = nieuweTaak.querySelector('.taak-leerling-label');
                     if(label) label.innerText = 'Vaste Taak: ' + leerling;
                }
            } else if (taakType === 'dispenser') {
                nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, false, true, huidigeGroep, 'docent');
            } else if (taakType === 'klaartaak') {
                nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, true, false, huidigeGroep, 'docent');
            } else {
                nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, false, false, huidigeGroep, 'docent');
                if(taakKolomId === 'te-doen') nieuweTaak.classList.add('standaard-te-doen'); 
            }
            doelKolom.appendChild(nieuweTaak);
        });

        taakInput.value = ''; 
        updateTaakZichtbaarheid(); 
        berekenVoortgang(); 
    }
}

voegTaakToeKnop.addEventListener('click', voegNieuweTaakToe);
taakInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') voegNieuweTaakToe(); });

document.getElementById('wis-bord-knop').addEventListener('click', () => {
    if(confirm("Weet je zeker dat je alle flexibele taken wilt wissen? (De vaste lessen en klaartaken blijven bewaard).")) {
        
        const alleFlexibeleTaken = document.querySelectorAll('.taak:not(.vaste-taak):not(.extra-taak):not(.dispenser-taak):not(.standaard-te-doen)');
        alleFlexibeleTaken.forEach(taak => {
            if (taak.getAttribute('data-groep') === huidigeGroep) taak.remove();
        });
        
        const wisKlaarVoorGroep = (taak) => {
            let klaarDoor = taak.getAttribute('data-klaar-door') || '';
            let klaarLijst = klaarDoor.split(',').filter(n => !actieveLeerlingenLijst.includes(n));
            taak.setAttribute('data-klaar-door', klaarLijst.join(','));
            if (klaarLijst.length === 0) taak.classList.remove('klaar'); 
        };

        const alleStandaardTaken = document.querySelectorAll('.standaard-te-doen');
        const teDoenKolom = document.getElementById('te-doen');
        alleStandaardTaken.forEach(taak => {
            if (taak.getAttribute('data-groep') === huidigeGroep) {
                wisKlaarVoorGroep(taak);
                teDoenKolom.appendChild(taak); 
            }
        });
        
        const alleVasteTaken = document.querySelectorAll('.vaste-taak');
        alleVasteTaken.forEach(taak => {
            if (taak.getAttribute('data-groep') === huidigeGroep) {
                wisKlaarVoorGroep(taak);
            }
        });

        const alleKlaarTaken = document.querySelectorAll('.extra-taak');
        const klaartakenLijst = document.getElementById('klaartaken-lijst');
        alleKlaarTaken.forEach(taak => {
            if (taak.getAttribute('data-groep') === huidigeGroep) {
                wisKlaarVoorGroep(taak);
                klaartakenLijst.appendChild(taak); 
            }
        });

        const alleReflectieVelden = document.querySelectorAll('.reflectie-input');
        alleReflectieVelden.forEach(veld => veld.value = '');
        const alleReflectieSmileys = document.querySelectorAll('.emotie-knop');
        alleReflectieSmileys.forEach(smiley => smiley.classList.remove('actief'));
        
        actieveLeerlingenLijst.forEach(leerling => {
            werkDagen.forEach(dag => {
                reflectieData[leerling][dag] = { emotie: '', lastig: '', hulp: '' };
            });
        });
        
        berekenVoortgang(); 
    }
});

let gesleepteTaak = null;

function maakTaakSleepbaar(taak) {
    taak.addEventListener('dragstart', function() {
        if (taak.getAttribute('draggable') === 'false') return; 
        gesleepteTaak = taak;
        setTimeout(() => taak.style.opacity = '0.5', 0); 
    });
    taak.addEventListener('dragend', function() {
        setTimeout(() => {
            if (taak.classList.contains('extra-taak') && taak.getAttribute('draggable') === 'false') {
                taak.style.opacity = '0.5';
            } else {
                taak.style.opacity = '1'; 
            }
            gesleepteTaak = null;
        }, 0);
    });
}

const alleKolommen = document.querySelectorAll('.kolom');

alleKolommen.forEach(kolom => {
    kolom.addEventListener('dragover', function(e) {
        e.preventDefault(); 
        kolom.classList.add('drag-over'); 
    });
    kolom.addEventListener('dragleave', function() {
        kolom.classList.remove('drag-over');
    });
    kolom.addEventListener('drop', function() {
        kolom.classList.remove('drag-over'); 
        if (gesleepteTaak) {
            if (gesleepteTaak.classList.contains('dispenser-taak') && kolom.id !== 'te-doen' && kolom.id !== 'prullenbak' && kolom.id !== 'leerling-prullenbak') {
                const kloon = gesleepteTaak.cloneNode(true);
                kloon.id = 'taak-' + globaleTaakId++;
                kloon.classList.remove('dispenser-taak'); 
                kloon.classList.add('kloon-taak'); 
                kloon.setAttribute('data-is-dispenser-kloon', 'true');
                kloon.setAttribute('data-aantal', '0');
                kloon.setAttribute('data-groep', huidigeGroep); 
                kloon.style.opacity = '1'; 
                if (huidigeGebruiker !== 'Docent') {
                    kloon.setAttribute('data-leerling', huidigeGebruiker);
                }
                kloon.setAttribute('data-klaar-door', '');
                kloon.classList.remove('klaar');
                const tellerDiv = document.createElement('div');
                tellerDiv.classList.add('taak-teller');
                tellerDiv.innerHTML = `
                    <button class="teller-knop min">-</button>
                    <span class="teller-waarde"><strong>0</strong> x gemaakt</span>
                    <button class="teller-knop plus">+</button>
                `;
                let aantal = 0;
                const waardeSpan = tellerDiv.querySelector('.teller-waarde strong');
                tellerDiv.querySelector('.plus').addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    aantal++;
                    waardeSpan.innerText = aantal;
                    kloon.setAttribute('data-aantal', aantal);
                    berekenVoortgang();
                });
                tellerDiv.querySelector('.min').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (aantal > 0) aantal--;
                    waardeSpan.innerText = aantal;
                    kloon.setAttribute('data-aantal', aantal);
                    berekenVoortgang();
                });
                kloon.appendChild(tellerDiv);
                kloon.addEventListener('click', function() {
                    if (huidigeGebruiker === 'Docent') return;
                    kloon.classList.toggle('klaar');
                    berekenVoortgang();
                });
                maakTaakSleepbaar(kloon);
                kolom.appendChild(kloon); 
                updateTaakZichtbaarheid(); 
            } 
            else if (huidigeGebruiker !== 'Docent' && gesleepteTaak.getAttribute('data-leerling') === 'Iedereen' && !gesleepteTaak.classList.contains('vaste-taak') && kolom.id !== 'te-doen' && kolom.id !== 'prullenbak' && kolom.id !== 'leerling-prullenbak') {
                const kloon = gesleepteTaak.cloneNode(true);
                kloon.id = 'taak-' + globaleTaakId++;
                kloon.classList.add('kloon-taak');
                kloon.setAttribute('data-kloon-van', gesleepteTaak.id);
                kloon.setAttribute('data-leerling', huidigeGebruiker);
                kloon.setAttribute('data-groep', huidigeGroep);
                kloon.style.opacity = '1';
                kloon.setAttribute('data-klaar-door', '');
                kloon.classList.remove('klaar');
                kloon.addEventListener('click', function() {
                    kloon.classList.toggle('klaar');
                    berekenVoortgang();
                });
                maakTaakSleepbaar(kloon);
                kolom.appendChild(kloon);
                updateTaakZichtbaarheid();
                berekenVoortgang();
            } 
            else {
                kolom.appendChild(gesleepteTaak); 
                updateTaakZichtbaarheid();
                berekenVoortgang();
            }
        }
    });
});

prullenbak.addEventListener('dragover', function(e) { e.preventDefault(); prullenbak.classList.add('drag-over'); });
prullenbak.addEventListener('dragleave', function() { prullenbak.classList.remove('drag-over'); });
prullenbak.addEventListener('drop', function() {
    prullenbak.classList.remove('drag-over'); 
    if (gesleepteTaak) {
        gesleepteTaak.remove(); 
        berekenVoortgang(); 
    }
});

leerlingPrullenbak.addEventListener('dragover', function(e) { e.preventDefault(); leerlingPrullenbak.classList.add('drag-over'); });
leerlingPrullenbak.addEventListener('dragleave', function() { leerlingPrullenbak.classList.remove('drag-over'); });
leerlingPrullenbak.addEventListener('drop', function() {
    leerlingPrullenbak.classList.remove('drag-over'); 
    if (gesleepteTaak) {
        if (gesleepteTaak.classList.contains('vaste-taak')) {
            alert("Let op: Deze basistaak hoort standaard bij je dag, die mag je niet wissen!");
            return;
        }
        if (gesleepteTaak.classList.contains('dispenser-taak')) {
            alert("Let op: Dit is de hoofdtitel, deze moet in de voorraadkast blijven staan.");
            return;
        }
        if (gesleepteTaak.classList.contains('extra-taak')) {
            let klaarDoor = gesleepteTaak.getAttribute('data-klaar-door') || '';
            let klaarLijst = klaarDoor.split(',').filter(n => n !== huidigeGebruiker);
            gesleepteTaak.setAttribute('data-klaar-door', klaarLijst.join(','));
            gesleepteTaak.classList.remove('klaar');
            document.getElementById('klaartaken-lijst').appendChild(gesleepteTaak);
            berekenVoortgang();
            return;
        }
        if (gesleepteTaak.classList.contains('kloon-taak')) {
            gesleepteTaak.remove(); 
            updateTaakZichtbaarheid(); 
            berekenVoortgang(); 
            return;
        }
        alert("Je mag alleen je klaartaken of de gesplitste eigen taken en oefensoftware verwijderen.");
    }
});