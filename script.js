// script.js - De motor van onze weektaak (GENADELOZE SCHOONMAAK UPDATE!)

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
const handmatigOpslaanKnop = document.getElementById('handmatig-opslaan-knop'); 

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
    'Groep 8 oranje': ['Louise Bergen', 'Tibbe Broekhuis', 'Tess Delsink', 'Kai Everdij', 'Jula Evers', 'Anne van Elk', 'Jasmijn Kok', 'Thalesia Koenen', 'Elli Kroon', 'Siem Lentjes', 'Jayda Lindeman', 'Luuk Megens', 'Dante van Rossum', 'Jake Schuring', 'Sepp Struijker Boudier', 'Bram van Steenoven', 'Mert Pasaoglu', 'Teun Peeters', 'Dex Schuil', 'Marly Ramsoedh', 'Nikki Zwart', 'Jolie van der Kreeft', 'Cas Esmeijer', 'Ivy Le'],
    'Groep 8 roze': ['Amber Beekman', 'Nine Benders', 'Ties van den Berg', 'Allison Mae Bosveld', 'Jaap Willem Hoogenhout', 'Jackie van den Oever', 'Maile Korstanje', 'Esmee van der Kreeft', 'Jasper Guijt', 'Summer Liu', 'Skyler Lucassen', 'Lola Mourelle Fernandez', 'Sophie Neijenhuis', 'Alissa Peelen', 'Rosa Walvius', 'Aiden Vaanholt', 'Senn van der Winkel', 'Vanity Hofs', 'Jelle Kersten', 'Bent Teunissen', 'Zonne Triemstra']
};

let huidigeGroep = '';
let huidigeGebruiker = '';
let actieveLeerlingenLijst = []; 
let groepenGeinitialiseerd = {}; 
let globaleTaakId = 1; 

const reflectieData = {};
const werkDagen = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'];
const wachtwoordenDatabase = {}; 
let opgeslagenBorden = {}; 

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlGroep = urlParams.get('groep');
    const urlNaam = urlParams.get('naam');

    if (urlGroep && scholenDatabase[urlGroep]) {
        kiesGroepSelect.value = urlGroep;
        kiesGroepSelect.dispatchEvent(new Event('change')); 
        
        if (urlNaam) {
            setTimeout(() => { 
                wieLogtInSelect.value = urlNaam; 
            }, 50);
        }
    }
});

async function haalDataUitGoogle(sheetNaam) {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?sheet=${sheetNaam}`);
        if (!response.ok) return null; 
        return await response.json();
    } catch (error) {
        return null; 
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
        console.error("Opslaan mislukt:", error);
    }
}

async function stuurBordNaarGoogle() {
    if (!huidigeGroep || !huidigeGebruiker) return;
    
    const takenData = [];
    document.querySelectorAll(`.taak[data-groep="${huidigeGroep}"]`).forEach(taak => {
        let attrObj = {};
        Array.from(taak.attributes).forEach(attr => {
            if(attr.name.startsWith('data-') || attr.name === 'draggable' || attr.name === 'id' || attr.name === 'class') {
                attrObj[attr.name] = attr.value;
            }
        });
        takenData.push({
            kolom: taak.parentElement.id,
            html: taak.innerHTML,
            attrs: attrObj
        });
    });
    
    let opslagSleutel = huidigeGebruiker === "Docent" ? huidigeGroep + "_Docent" : huidigeGroep + "_" + huidigeGebruiker;

    await stuurDataNaarGoogle({
        sheet: 'taken',
        row: {
            groep: opslagSleutel, 
            bord_data: JSON.stringify(takenData)
        }
    });
}

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
                reflectieData[leerling][dag] = { emotie: '', lastig: '', hulp: '', trots: '' }; 
            });
        });
    }
}
initLokaal();

async function syncMetGoogle() {
    const cloudWachtwoorden = await haalDataUitGoogle('wachtwoorden');
    if(cloudWachtwoorden) {
        cloudWachtwoorden.forEach(rij => {
            if (rij.leerling && rij.wachtwoord) wachtwoordenDatabase[rij.leerling] = String(rij.wachtwoord);
        });
    }

    const cloudReflecties = await haalDataUitGoogle('reflecties');
    if(cloudReflecties) {
        cloudReflecties.forEach(rij => {
            if (reflectieData[rij.leerling] && reflectieData[rij.leerling][rij.dag]) {
                reflectieData[rij.leerling][rij.dag] = { 
                    emotie: rij.emotie || '', 
                    lastig: rij.lastig || '', 
                    hulp: rij.hulp || '',
                    trots: rij.trots || '' 
                };
            }
        });
    }
}
syncMetGoogle(); 

kiesGroepSelect.addEventListener('change', () => {
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
});

function vulDynamischeCheckboxes() {
    const checkboxContainer = document.getElementById('dynamische-checkboxes');
    checkboxContainer.innerHTML = `<span class="checkbox-titel">Voor wie?</span><label><input type="checkbox" id="check-iedereen" value="Iedereen" checked> Hele groep</label>`;
    actieveLeerlingenLijst.forEach(leerling => {
        checkboxContainer.innerHTML += `<label><input type="checkbox" class="leerling-check" value="${leerling}"> ${leerling}</label>`;
    });

    const checkIedereen = document.getElementById('check-iedereen');
    const leerlingChecks = document.querySelectorAll('.leerling-check');

    checkIedereen.addEventListener('change', () => {
        if (checkIedereen.checked) leerlingChecks.forEach(box => box.checked = false);
    });

    leerlingChecks.forEach(box => {
        box.addEventListener('change', () => { if (box.checked) checkIedereen.checked = false; });
    });
}

naarWachtwoordKnop.addEventListener('click', () => {
    if (kiesGroepSelect.value === "" || wieLogtInSelect.value === "") return alert("Kies eerst een groep en een naam!");
    huidigeGebruiker = wieLogtInSelect.value;
    huidigeGroep = kiesGroepSelect.value;
    foutmeldingLogin.style.display = 'none';
    wachtwoordWelkom.innerText = `Hoi, ${huidigeGebruiker}!`;
    inlogKeuzeSectie.style.display = 'none';
    wachtwoordSectie.style.display = 'block';

    if (huidigeGebruiker === 'Docent') {
        docentWachtwoordSectie.style.display = 'block';
        leerlingWachtwoordSectie.style.display = 'none';
        docentWachtwoordInput.value = ''; docentWachtwoordInput.focus();
    } else {
        docentWachtwoordSectie.style.display = 'none';
        leerlingWachtwoordSectie.style.display = 'block';
        leerlingWachtwoordInput.value = ''; leerlingWachtwoordInput.focus();
    }
});

terugNaarNaamKnop.addEventListener('click', () => {
    wachtwoordSectie.style.display = 'none';
    inlogKeuzeSectie.style.display = 'block';
});

docentWachtwoordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkDocentWachtwoordKnop.click();
});

if(checkDocentWachtwoordKnop) {
    checkDocentWachtwoordKnop.addEventListener('click', () => {
        if (docentWachtwoordInput.value === DOCENT_WACHTWOORD) voerSuccesvolleLoginUit();
        else foutmeldingLogin.style.display = 'block';
    });
}

leerlingWachtwoordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkLeerlingWachtwoordKnop.click();
});

if(checkLeerlingWachtwoordKnop) {
    checkLeerlingWachtwoordKnop.addEventListener('click', () => {
        if (leerlingWachtwoordInput.value === wachtwoordenDatabase[huidigeGebruiker]) voerSuccesvolleLoginUit();
        else foutmeldingLogin.style.display = 'block';
    });
}

veranderWachtwoordKnop.addEventListener('click', () => {
    nieuwWachtwoordInput.value = wachtwoordenDatabase[huidigeGebruiker]; 
    wachtwoordModal.style.display = 'flex';
});

opslaanWachtwoordKnop.addEventListener('click', () => {
    const nieuwWw = nieuwWachtwoordInput.value.trim();
    if (nieuwWw !== '') {
        wachtwoordenDatabase[huidigeGebruiker] = nieuwWw;
        stuurDataNaarGoogle({ sheet: 'wachtwoorden', row: { leerling: huidigeGebruiker, wachtwoord: nieuwWw }});
        alert('Jouw wachtwoord is succesvol gewijzigd!');
        wachtwoordModal.style.display = 'none';
    }
});
sluitWachtwoordModal.addEventListener('click', () => { wachtwoordModal.style.display = 'none'; });

// --- Daadwerkelijke Inlog & BORD LADEN ---
async function voerSuccesvolleLoginUit() {
    const isD = (huidigeGebruiker === "Docent");
    
    if(isD && checkDocentWachtwoordKnop) checkDocentWachtwoordKnop.innerText = "Laden...";
    else if(checkLeerlingWachtwoordKnop) checkLeerlingWachtwoordKnop.innerText = "Laden...";

    const url = new URL(window.location);
    url.searchParams.set('groep', huidigeGroep);
    url.searchParams.set('naam', huidigeGebruiker);
    window.history.pushState({}, '', url);

    const cloudTaken = await haalDataUitGoogle('taken');
    if (cloudTaken === null) {
        alert("⚠️ Kan geen verbinding maken met de database. Probeer het opnieuw!");
        if(isD && checkDocentWachtwoordKnop) checkDocentWachtwoordKnop.innerText = "Inloggen";
        else if(checkLeerlingWachtwoordKnop) checkLeerlingWachtwoordKnop.innerText = "Inloggen";
        return; 
    }

    opgeslagenBorden = {}; 
    cloudTaken.forEach(rij => {
        if (rij.groep && rij.bord_data) {
            // FIX: Zonder "if" blok pakt hij nu áltijd de állerlaatste en meest actuele data
            try { opgeslagenBorden[rij.groep] = JSON.parse(rij.bord_data); } catch(e){}
        }
    });

    ingelogdeGebruikerTekst.innerText = huidigeGebruiker;
    wachtwoordSectie.style.display = 'none';
    loginScherm.style.display = 'none';
    planbord.style.display = 'block';
    if(handmatigOpslaanKnop) handmatigOpslaanKnop.style.display = 'inline-block';
    vulDynamischeCheckboxes();

    document.querySelectorAll('.kolom').forEach(k => {
        const h3 = k.querySelector('h3');
        k.innerHTML = '';
        k.appendChild(h3);
    });
    document.getElementById('klaartaken-lijst').innerHTML = '';

    let docentData = opgeslagenBorden[huidigeGroep + "_Docent"] || opgeslagenBorden[huidigeGroep] || [];
    
    if (isD) {
        veranderWachtwoordKnop.style.display = 'none'; 
        docentPaneel.style.display = 'flex';
        docentOverzicht.style.display = 'block';
        docentActies.style.display = 'flex'; 
        voortgangContainer.style.display = 'none'; 
        klaartakenContainer.style.display = 'block'; 
        klaartakenContainer.classList.remove('klaartaken-vergrendeld'); 
        klaartakenContainer.classList.add('ontgrendeld');
        document.querySelector('.klaarkaart-invoer').style.display = 'none'; 
        document.getElementById('klaartaken-slot-tekst').innerText = "Beheer hier de extra taken voor de klas."; 
        leerlingPrullenbakContainer.style.display = 'none';
        reflectieContainer.style.display = 'none'; 
        
        if (docentData.length > 0) laadBordVanafData(docentData);
        else laadStandaardInhoud();

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

        let studentData = opgeslagenBorden[huidigeGroep + "_" + huidigeGebruiker];

        if (!studentData || studentData.length === 0) {
            laadBordVanafData(docentData);
        } else {
            laadBordVanafData(studentData);
            
            // --- KEIHARDE EN SLIMME SYNC-LOGICA ---
            let actueleDocentNamen = [];
            let bordAangepast = false;

            // 1. Verzamel EXACT wat de docent NU op zijn bord heeft staan
            docentData.forEach(dTaak => {
                let dNaamAttr = dTaak.attrs['data-taak-naam'];
                
                // Valback: we lezen de keiharde tekst in het blokje af als de data-naam ontbreekt
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = dTaak.html;
                let dTxt = tempDiv.textContent.replace('Vaste Taak', '').replace('Klaartaak 🎮', '').replace(/[\n\r]+|[\s]{2,}/g, ' ').trim().toLowerCase();
                
                let finalNaam = (dNaamAttr ? dNaamAttr.trim().toLowerCase() : dTxt);
                if (finalNaam) actueleDocentNamen.push(finalNaam);
                
                // Kijken of we deze taak nog moeten TOEVOEGEN bij de leerling
                let taakBestaat = document.getElementById(dTaak.attrs.id);
                if (!taakBestaat) {
                    let alleTaken = document.querySelectorAll('.taak:not(.kloon-taak)');
                    taakBestaat = Array.from(alleTaken).find(t => {
                        let tAttr = (t.getAttribute('data-taak-naam') || '').trim().toLowerCase();
                        let tTxt = t.textContent.replace('Vaste Taak', '').replace('Klaartaak 🎮', '').replace(/[\n\r]+|[\s]{2,}/g, ' ').trim().toLowerCase();
                        return (tAttr === finalNaam) || (tTxt === finalNaam);
                    });
                }

                if (!taakBestaat) {
                    const nieuweTaak = document.createElement('div');
                    for (let key in dTaak.attrs) { nieuweTaak.setAttribute(key, dTaak.attrs[key]); }
                    if(dTaak.attrs['class']) nieuweTaak.className = dTaak.attrs['class'];
                    nieuweTaak.innerHTML = dTaak.html;
                    nieuweTaak.id = 'taak-' + globaleTaakId++; 
                    const doelKolom = document.getElementById(dTaak.kolom);
                    if (doelKolom) { doelKolom.appendChild(nieuweTaak); koppelTaakEvents(nieuweTaak); }
                    bordAangepast = true;
                }
            });

            // 2. Grote Schoonmaak: Vernietig alle spoken!
            document.querySelectorAll('.taak:not(.kloon-taak)').forEach(taak => {
                let maker = taak.getAttribute('data-maker');
                if (maker === 'leerling') return; // Blijf van eigen bedachte taken af

                let naamAttr = (taak.getAttribute('data-taak-naam') || '').trim().toLowerCase();
                let txtNaam = taak.textContent.replace('Vaste Taak', '').replace('Klaartaak 🎮', '').replace(/[\n\r]+|[\s]{2,}/g, ' ').trim().toLowerCase();

                // Controleer de actuele docentenlijst met zowel het labeltje als de kale tekst
                if (naamAttr && !actueleDocentNamen.includes(naamAttr) && !actueleDocentNamen.includes(txtNaam)) {
                    taak.remove(); // Staat hij nergens meer in de docentenlijst? WEG ERMEE!
                    bordAangepast = true;
                } else if (!naamAttr && !actueleDocentNamen.includes(txtNaam)) {
                    taak.remove(); // Zelfs een spook zónder labeltje wordt nu herkend en verwijderd
                    bordAangepast = true;
                }
            });

            // 3. Als we spoken hebben gewist, dwingen we het kinderklemmetje direct om de schone staat op te slaan
            if (bordAangepast) {
                stuurBordNaarGoogle(); 
            }
        }
    }

    updateTaakZichtbaarheid();
    updateKlaarWeergave(); 
    berekenVoortgang(); 

    if(isD && checkDocentWachtwoordKnop) checkDocentWachtwoordKnop.innerText = "Inloggen";
    else if(checkLeerlingWachtwoordKnop) checkLeerlingWachtwoordKnop.innerText = "Inloggen";
}

logoutKnop.addEventListener('click', () => {
    location.reload();
});

function laadBordVanafData(takenData) {
    let maxId = 0;
    takenData.forEach(data => {
        const taak = document.createElement('div');
        for (let key in data.attrs) { taak.setAttribute(key, data.attrs[key]); }
        if(data.attrs['class']) taak.className = data.attrs['class'];
        taak.innerHTML = data.html;
        
        if(data.attrs.id && data.attrs.id.startsWith('taak-')) {
            let num = parseInt(data.attrs.id.split('-')[1]);
            if(!isNaN(num) && num > maxId) maxId = num;
        }
        
        taak.style.position = 'relative';

        const doelKolom = document.getElementById(data.kolom);
        if(doelKolom) {
            doelKolom.appendChild(taak);
            koppelTaakEvents(taak); 
        }
    });
    globaleTaakId = maxId + 1;
    groepenGeinitialiseerd[huidigeGroep] = true;
}

// --- Wachtwoordenlijst Tonen ---
bekijkWachtwoordenKnop.addEventListener('click', () => {
    let wachtwoordHtml = `<div class="wachtwoorden-lijst">`;
    actieveLeerlingenLijst.forEach(leerling => {
        wachtwoordHtml += `<div class="wachtwoord-rij"><span>${leerling}</span><span style="font-weight: normal; font-family: monospace;">${wachtwoordenDatabase[leerling]}</span></div>`;
    });
    wachtwoordHtml += `</div>`;
    modalInhoud.innerHTML = `<h4>Wachtwoorden - ${huidigeGroep}</h4>${wachtwoordHtml}`;
    leerlingModal.style.display = 'flex';
});

// --- REFLECTIE BEHEREN ---
function laadReflectieBord() {
    const reflectieGrid = document.getElementById('reflectie-dagen-grid');
    if (reflectieGrid.children.length > 0) return; 
    const emoties = ['😄', '😐', '🙁']; 
    werkDagen.forEach(dag => {
        const dagKaart = document.createElement('div');
        dagKaart.classList.add('reflectie-dag');
        dagKaart.innerHTML = `<h4>${dag}</h4>`;
        
        const emotieContainer = document.createElement('div');
        emotieContainer.classList.add('emotie-knoppen');
        emotieContainer.id = `emotie-container-${dag}`;
        emoties.forEach(emotie => {
            const btn = document.createElement('button');
            btn.classList.add('emotie-knop');
            btn.innerText = emotie;
            btn.addEventListener('click', (e) => {
                e.preventDefault(); 
                emotieContainer.querySelectorAll('.emotie-knop').forEach(k => k.classList.remove('actief'));
                btn.classList.add('actief');
                if (huidigeGebruiker !== 'Docent') {
                    reflectieData[huidigeGebruiker][dag].emotie = emotie;
                    stuurDataNaarGoogle({ sheet: 'reflecties', row: { id: huidigeGebruiker+"_"+dag, leerling: huidigeGebruiker, dag: dag, emotie: emotie, lastig: reflectieData[huidigeGebruiker][dag].lastig, hulp: reflectieData[huidigeGebruiker][dag].hulp, trots: reflectieData[huidigeGebruiker][dag].trots }});
                }
            });
            emotieContainer.appendChild(btn);
        });
        dagKaart.appendChild(emotieContainer);
        
        const moeilijkInput = document.createElement('textarea');
        moeilijkInput.classList.add('reflectie-input');
        moeilijkInput.id = `input-lastig-${dag}`;
        moeilijkInput.placeholder = 'Wat vond je vandaag lastig?';
        moeilijkInput.addEventListener('change', (e) => {
            if (huidigeGebruiker !== 'Docent') {
                reflectieData[huidigeGebruiker][dag].lastig = e.target.value;
                stuurDataNaarGoogle({ sheet: 'reflecties', row: { id: huidigeGebruiker+"_"+dag, leerling: huidigeGebruiker, dag: dag, emotie: reflectieData[huidigeGebruiker][dag].emotie, lastig: e.target.value, hulp: reflectieData[huidigeGebruiker][dag].hulp, trots: reflectieData[huidigeGebruiker][dag].trots }});
            }
        });
        dagKaart.appendChild(moeilijkInput);

        const trotsInput = document.createElement('textarea');
        trotsInput.classList.add('reflectie-input');
        trotsInput.id = `input-trots-${dag}`;
        trotsInput.placeholder = 'Waar ben je trots op?';
        trotsInput.addEventListener('change', (e) => {
            if (huidigeGebruiker !== 'Docent') {
                reflectieData[huidigeGebruiker][dag].trots = e.target.value;
                stuurDataNaarGoogle({ sheet: 'reflecties', row: { id: huidigeGebruiker+"_"+dag, leerling: huidigeGebruiker, dag: dag, emotie: reflectieData[huidigeGebruiker][dag].emotie, lastig: reflectieData[huidigeGebruiker][dag].lastig, hulp: reflectieData[huidigeGebruiker][dag].hulp, trots: e.target.value }});
            }
        });
        dagKaart.appendChild(trotsInput);
        
        const hulpInput = document.createElement('textarea');
        hulpInput.classList.add('reflectie-input');
        hulpInput.id = `input-hulp-${dag}`;
        hulpInput.placeholder = 'Heb je nog een hulpvraag?';
        hulpInput.addEventListener('change', (e) => {
            if (huidigeGebruiker !== 'Docent') {
                reflectieData[huidigeGebruiker][dag].hulp = e.target.value;
                stuurDataNaarGoogle({ sheet: 'reflecties', row: { id: huidigeGebruiker+"_"+dag, leerling: huidigeGebruiker, dag: dag, emotie: reflectieData[huidigeGebruiker][dag].emotie, lastig: reflectieData[huidigeGebruiker][dag].lastig, hulp: e.target.value, trots: reflectieData[huidigeGebruiker][dag].trots }});
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
        document.getElementById(`input-trots-${dag}`).value = data.trots; 
        document.getElementById(`emotie-container-${dag}`).querySelectorAll('.emotie-knop').forEach(btn => {
            btn.classList.remove('actief');
            if (btn.innerText === data.emotie) btn.classList.add('actief');
        });
    });
}

function updateKlaarWeergave() {
    document.querySelectorAll('.taak').forEach(taak => {
        let klaarLijst = (taak.getAttribute('data-klaar-door') || '').split(',').filter(n => n);
        if (huidigeGebruiker === 'Docent') taak.classList.remove('klaar'); 
        else {
            if (klaarLijst.includes(huidigeGebruiker)) taak.classList.add('klaar');
            else taak.classList.remove('klaar');
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

    document.querySelectorAll('.taak').forEach(taak => {
        const doelgroep = taak.getAttribute('data-leerling');
        let hoortBijActieveGroep = (taak.getAttribute('data-groep') === huidigeGroep) && (doelgroep === 'Iedereen' || actieveLeerlingenLijst.includes(doelgroep));
        if (!hoortBijActieveGroep) { taak.style.display = 'none'; return; }

        if (huidigeGebruiker === 'Docent') {
            taak.style.display = (taak.classList.contains('kloon-taak') || (taak.classList.contains('extra-taak') && taak.getAttribute('data-maker') === 'leerling')) ? 'none' : 'flex'; 
        } else {
            if (taak.id && verborgenOriginelen.includes(taak.id)) taak.style.display = 'none';
            else if (doelgroep === 'Iedereen' || doelgroep === huidigeGebruiker) taak.style.display = 'flex'; 
            else taak.style.display = 'none'; 
        }
    });
}

function berekenVoortgang() {
    const alleOriginelen = Array.from(document.querySelectorAll('.taak:not(.extra-taak):not(.dispenser-taak):not(.kloon-taak)'))
                                .filter(t => t.getAttribute('data-groep') === huidigeGroep);

    if (huidigeGebruiker === 'Docent') {
        const overzichtLijst = document.getElementById('overzicht-lijst');
        if (!overzichtLijst) return;
        overzichtLijst.innerHTML = ''; 
        
        actieveLeerlingenLijst.forEach(leerling => {
            let totaal = 0;
            let klaar = 0;
            let afgerondeNamenLijst = [];
            
            let sBord = opgeslagenBorden[huidigeGroep + "_" + leerling] || [];
            
            alleOriginelen.forEach(origineel => {
                const doelgroep = origineel.getAttribute('data-leerling');
                if (doelgroep === 'Iedereen' || doelgroep === leerling) {
                    totaal++;
                    let isKlaar = false;

                    const sTaak = sBord.find(t => t.attrs && t.attrs.id === origineel.id);
                    if (sTaak && sTaak.attrs['data-klaar-door'] && sTaak.attrs['data-klaar-door'].includes(leerling)) {
                        isKlaar = true;
                    } else {
                        const sKloon = sBord.find(t => t.attrs && t.attrs['data-kloon-van'] === origineel.id && t.attrs['class'] && t.attrs['class'].includes('klaar'));
                        if (sKloon) isKlaar = true;
                    }

                    if (isKlaar) {
                        klaar++;
                        afgerondeNamenLijst.push(origineel.getAttribute('data-taak-naam'));
                    }
                }
            });
            
            sBord.forEach(t => {
                if (t.attrs && t.attrs['data-is-dispenser-kloon'] === 'true' && parseInt(t.attrs['data-aantal']||'0') > 0) {
                    afgerondeNamenLijst.push(`${t.attrs['data-aantal']}x ${t.attrs['data-taak-naam']}`);
                }
                if (t.attrs && t.attrs['class'] && t.attrs['class'].includes('extra-taak') && t.attrs['class'].includes('klaar')) {
                    afgerondeNamenLijst.push(t.attrs['data-taak-naam'] + ' 🎮');
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
        let flexibelTotaal = 0; 
        let flexibelKlaar = 0;  
        
        alleOriginelen.forEach(origineel => {
            const doelgroep = origineel.getAttribute('data-leerling');
            if (doelgroep === 'Iedereen' || doelgroep === huidigeGebruiker) {
                totaal++;
                const isVast = origineel.classList.contains('vaste-taak');
                if (!isVast) flexibelTotaal++;

                let isKlaar = false;
                let klaarDoor = origineel.getAttribute('data-klaar-door') || '';
                if (klaarDoor.split(',').includes(huidigeGebruiker)) isKlaar = true;
                else {
                    const kloon = document.querySelector(`.kloon-taak[data-kloon-van="${origineel.id}"][data-leerling="${huidigeGebruiker}"]`);
                    if (kloon && kloon.classList.contains('klaar')) isKlaar = true;
                }

                if (isKlaar) {
                    klaar++;
                    if (!isVast) flexibelKlaar++;
                }
            }
        });
        
        let percentage = totaal === 0 ? 0 : Math.round((klaar / totaal) * 100);
        
        document.getElementById('voortgang-percentage').innerText = `${klaar} van de ${totaal} taken af (${percentage}%)`;
        document.getElementById('voortgang-balk-vulling').style.width = `${percentage}%`;

        const klaartakenSlotTekst = document.getElementById('klaartaken-slot-tekst');

        let magKlaartakenDoen = false;
        if (flexibelTotaal > 0 && flexibelKlaar === flexibelTotaal) {
            magKlaartakenDoen = true;
        } else if (flexibelTotaal === 0 && totaal > 0) {
            magKlaartakenDoen = true;
        }

        if (magKlaartakenDoen) {
            klaartakenContainer.classList.remove('klaartaken-vergrendeld');
            klaartakenContainer.classList.add('ontgrendeld');
            klaartakenSlotTekst.innerText = "🎉 Kies een leuke extra taak of bedenk er zelf één!";
        } else {
            klaartakenContainer.classList.add('klaartaken-vergrendeld');
            klaartakenContainer.classList.remove('ontgrendeld');
            klaartakenSlotTekst.innerText = "Rond eerst je flexibele taken af."; 
        }
    }
}

function openLeerlingModal(leerling, afgerondeNamenLijst) {
    let takenHtml = afgerondeNamenLijst.length > 0 ? `<ul class="detail-taken-lijst">` + afgerondeNamenLijst.map(n => `<li>${n}</li>`).join('') + `</ul>` : `<p>Nog geen taken afgerond.</p>`;
    let reflectieHtml = '';
    werkDagen.forEach(dag => {
        const rData = reflectieData[leerling][dag];
        if (rData.emotie !== '' || rData.lastig !== '' || rData.trots !== '' || rData.hulp !== '') {
            reflectieHtml += `<div class="detail-dag-reflectie"><strong>${dag} ${rData.emotie}</strong>${rData.lastig ? `<p><em>Lastig:</em> ${rData.lastig}</p>` : ''}${rData.trots ? `<p><em>Trots op:</em> ${rData.trots}</p>` : ''}${rData.hulp ? `<p><em>Hulpvraag:</em> ${rData.hulp}</p>` : ''}</div>`;
        }
    });
    if (reflectieHtml === '') reflectieHtml = `<p>Nog geen reflecties ingevuld.</p>`;
    modalInhoud.innerHTML = `<h4>Overzicht van ${leerling}</h4><div class="detail-sectie"><h5>✅ Afgeronde taken</h5>${takenHtml}</div><div class="detail-sectie"><h5>📝 Reflecties</h5>${reflectieHtml}</div>`;
    leerlingModal.style.display = 'flex';
}

window.addEventListener('click', (e) => { if (e.target === leerlingModal) leerlingModal.style.display = 'none'; if (e.target === wachtwoordModal) wachtwoordModal.style.display = 'none'; });
sluitModalKnop.addEventListener('click', () => { leerlingModal.style.display = 'none'; });

// === TOUCH EN DRAG LOGICA (CHROMBOOKS/IPADS) ===
let activeTouchTaak = null;
let touchKloon = null;

function handleTouchStart(e) {
    if (this.getAttribute('draggable') === 'false' || e.target.closest('.teller-knop') || e.target.tagName.toLowerCase() === 'button') return;
    activeTouchTaak = this;
    gesleepteTaak = this;
    setTimeout(() => this.style.opacity = '0.5', 0);

    const touch = e.touches[0];
    touchKloon = this.cloneNode(true);
    touchKloon.style.position = 'fixed';
    touchKloon.style.zIndex = '9999';
    touchKloon.style.pointerEvents = 'none'; 
    touchKloon.style.width = this.offsetWidth + 'px';
    touchKloon.style.left = (touch.clientX - (this.offsetWidth/2)) + 'px';
    touchKloon.style.top = (touch.clientY - (this.offsetHeight/2)) + 'px';
    touchKloon.style.opacity = '0.8';
    document.body.appendChild(touchKloon);
}

function handleTouchMove(e) {
    if (!activeTouchTaak) return;
    e.preventDefault(); 
    const touch = e.touches[0];
    if (touchKloon) {
        touchKloon.style.left = (touch.clientX - (activeTouchTaak.offsetWidth/2)) + 'px';
        touchKloon.style.top = (touch.clientY - (activeTouchTaak.offsetHeight/2)) + 'px';
    }
}

function handleTouchEnd(e) {
    if (!activeTouchTaak) return;
    const touch = e.changedTouches ? e.changedTouches[0] : null;
    
    activeTouchTaak.style.opacity = '1';

    if (touchKloon) {
        touchKloon.remove();
        touchKloon = null;
    }

    if (touch) {
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        if (dropTarget) {
            const kolom = dropTarget.closest('.kolom');
            const pDocent = dropTarget.closest('#prullenbak');
            const pLeerling = dropTarget.closest('#leerling-prullenbak');

            if (kolom) verwerkDropActie(kolom);
            else if (pDocent) verwerkDocentPrullenbakDrop();
            else if (pLeerling) verwerkLeerlingPrullenbakDrop();
        }
    }

    activeTouchTaak = null;
    gesleepteTaak = null;
}

function verwerkDropActie(kolom) {
    if (!gesleepteTaak) return;
    if (gesleepteTaak.classList.contains('dispenser-taak') && kolom.id !== 'te-doen' && kolom.id !== 'prullenbak' && kolom.id !== 'leerling-prullenbak') {
        const kloon = gesleepteTaak.cloneNode(true);
        kloon.id = 'taak-' + globaleTaakId++;
        kloon.classList.remove('dispenser-taak'); kloon.classList.add('kloon-taak'); 
        kloon.setAttribute('data-is-dispenser-kloon', 'true'); kloon.setAttribute('data-aantal', '0'); kloon.setAttribute('data-groep', huidigeGroep); kloon.style.opacity = '1'; 
        if (huidigeGebruiker !== 'Docent') kloon.setAttribute('data-leerling', huidigeGebruiker);
        kloon.setAttribute('data-klaar-door', ''); kloon.classList.remove('klaar');
        const tellerDiv = document.createElement('div'); tellerDiv.classList.add('taak-teller');
        tellerDiv.innerHTML = `<button class="teller-knop min">-</button><span class="teller-waarde"><strong>0</strong> x gemaakt</span><button class="teller-knop plus">+</button>`;
        kloon.appendChild(tellerDiv);
        koppelTaakEvents(kloon);
        kolom.appendChild(kloon); updateTaakZichtbaarheid(); 
    } 
    else if (huidigeGebruiker !== 'Docent' && gesleepteTaak.getAttribute('data-leerling') === 'Iedereen' && !gesleepteTaak.classList.contains('vaste-taak') && kolom.id !== 'te-doen' && kolom.id !== 'prullenbak' && kolom.id !== 'leerling-prullenbak') {
        const kloon = gesleepteTaak.cloneNode(true);
        kloon.id = 'taak-' + globaleTaakId++; kloon.classList.add('kloon-taak'); kloon.setAttribute('data-kloon-van', gesleepteTaak.id); kloon.setAttribute('data-leerling', huidigeGebruiker); kloon.setAttribute('data-groep', huidigeGroep); kloon.style.opacity = '1'; kloon.setAttribute('data-klaar-door', ''); kloon.classList.remove('klaar');
        koppelTaakEvents(kloon);
        kolom.appendChild(kloon); updateTaakZichtbaarheid(); berekenVoortgang(); 
    } 
    else {
        kolom.appendChild(gesleepteTaak); updateTaakZichtbaarheid(); berekenVoortgang(); 
    }
}

function verwerkDocentPrullenbakDrop() {
    if (gesleepteTaak) { gesleepteTaak.remove(); berekenVoortgang(); }
}

function verwerkLeerlingPrullenbakDrop() {
    if (gesleepteTaak) {
        if (gesleepteTaak.classList.contains('vaste-taak') || gesleepteTaak.classList.contains('dispenser-taak')) return alert("Let op: Deze taak mag je niet wissen!");
        if (gesleepteTaak.classList.contains('extra-taak')) {
            if (gesleepteTaak.getAttribute('data-maker') === 'leerling') {
                gesleepteTaak.remove(); 
            } else {
                let klaarLijst = (gesleepteTaak.getAttribute('data-klaar-door') || '').split(',').filter(n => n !== huidigeGebruiker);
                gesleepteTaak.setAttribute('data-klaar-door', klaarLijst.join(',')); gesleepteTaak.classList.remove('klaar');
                document.getElementById('klaartaken-lijst').appendChild(gesleepteTaak); 
            }
            berekenVoortgang(); return;
        }
        if (gesleepteTaak.classList.contains('kloon-taak')) { gesleepteTaak.remove(); updateTaakZichtbaarheid(); berekenVoortgang(); return; }
        alert("Je mag alleen je klaartaken of eigen oefensoftware verwijderen.");
    }
}

function maakTaakSleepbaar(taak) {
    taak.addEventListener('dragstart', function(e) {
        if (taak.getAttribute('draggable') === 'false') return; 
        gesleepteTaak = taak; setTimeout(() => taak.style.opacity = '0.5', 0); 
    });
    taak.addEventListener('dragend', function() {
        setTimeout(() => {
            taak.style.opacity = '1'; 
            if(taak.classList.contains('extra-taak') && taak.getAttribute('draggable') === 'false') taak.style.opacity = '0.5';
            gesleepteTaak = null;
        }, 0);
    });
}

document.querySelectorAll('.kolom').forEach(kolom => {
    kolom.addEventListener('dragover', (e) => { e.preventDefault(); kolom.classList.add('drag-over'); });
    kolom.addEventListener('dragleave', () => kolom.classList.remove('drag-over'));
    kolom.addEventListener('drop', function() {
        kolom.classList.remove('drag-over'); 
        verwerkDropActie(kolom);
    });
});

prullenbak.addEventListener('dragover', (e) => { e.preventDefault(); prullenbak.classList.add('drag-over'); });
prullenbak.addEventListener('dragleave', () => prullenbak.classList.remove('drag-over'));
prullenbak.addEventListener('drop', function() {
    prullenbak.classList.remove('drag-over'); 
    verwerkDocentPrullenbakDrop();
});

leerlingPrullenbak.addEventListener('dragover', (e) => { e.preventDefault(); leerlingPrullenbak.classList.add('drag-over'); });
leerlingPrullenbak.addEventListener('dragleave', () => leerlingPrullenbak.classList.remove('drag-over'));
leerlingPrullenbak.addEventListener('drop', function() {
    leerlingPrullenbak.classList.remove('drag-over'); 
    verwerkLeerlingPrullenbakDrop();
});

// --- Taken Bouwen & Gebeurtenissen ---
function koppelTaakEvents(taak) {
    maakTaakSleepbaar(taak); 

    taak.addEventListener('touchstart', handleTouchStart, {passive: false});
    taak.addEventListener('touchmove', handleTouchMove, {passive: false});
    taak.addEventListener('touchend', handleTouchEnd);
    taak.addEventListener('touchcancel', handleTouchEnd); 

    if (!taak.classList.contains('dispenser-taak')) {
        taak.onclick = function(e) {
            if (huidigeGebruiker === 'Docent') return;
            if (e.target.closest('.teller-knop')) return; 
            let klaarLijst = (taak.getAttribute('data-klaar-door') || '').split(',').filter(n => n);
            if (klaarLijst.includes(huidigeGebruiker)) {
                klaarLijst = klaarLijst.filter(n => n !== huidigeGebruiker);
                taak.classList.remove('klaar');
            } else {
                klaarLijst.push(huidigeGebruiker);
                taak.classList.add('klaar');
            }
            taak.setAttribute('data-klaar-door', klaarLijst.join(','));
            berekenVoortgang();
        };
    }

    if (taak.classList.contains('kloon-taak') && taak.getAttribute('data-is-dispenser-kloon') === 'true') {
        const plusBtn = taak.querySelector('.plus');
        const minBtn = taak.querySelector('.min');
        const waardeSpan = taak.querySelector('.teller-waarde strong');
        if (plusBtn && minBtn && waardeSpan) {
            plusBtn.onclick = (e) => {
                e.stopPropagation(); 
                if (huidigeGebruiker === 'Docent') return;
                let aantal = parseInt(taak.getAttribute('data-aantal') || '0', 10);
                aantal++; waardeSpan.innerText = aantal; taak.setAttribute('data-aantal', aantal);
                berekenVoortgang();
            };
            minBtn.onclick = (e) => {
                e.stopPropagation();
                if (huidigeGebruiker === 'Docent') return;
                let aantal = parseInt(taak.getAttribute('data-aantal') || '0', 10);
                if (aantal > 0) aantal--;
                waardeSpan.innerText = aantal; taak.setAttribute('data-aantal', aantal);
                berekenVoortgang(); 
            };
        }
    }
}

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

    taakElement.style.position = 'relative';

    if (leerlingNaam !== 'Iedereen') {
        const label = document.createElement('div'); 
        label.classList.add('taak-leerling-label'); 
        label.style.cssText = "background-color: var(--oranje); color: white; font-size: 10px; padding: 2px 5px; border-radius: 3px; position: absolute; top: -10px; right: -10px; z-index: 10;";
        label.innerText = leerlingNaam; 
        taakElement.appendChild(label);
    }
    
    if (isExtra) {
        const extraIcoon = document.createElement('div'); 
        extraIcoon.classList.add('taak-leerling-label'); 
        extraIcoon.style.cssText = "background-color: #cca300; color: white; font-size: 10px; padding: 2px 5px; border-radius: 3px; position: absolute; top: -10px; right: -10px; z-index: 10;";
        extraIcoon.innerText = 'Klaartaak 🎮'; 
        taakElement.appendChild(extraIcoon);
    }
    
    const tekst = document.createElement('span'); 
    tekst.innerText = taakNaam; 
    taakElement.appendChild(tekst);
    
    koppelTaakEvents(taakElement);
    return taakElement;
}

function bouwVasteTaakElement(hoofdNaam, subNaam, taakGroep = huidigeGroep, leerlingNaam = 'Iedereen') {
    const taakElement = document.createElement('div');
    taakElement.classList.add('taak', 'vaste-taak'); 
    taakElement.id = 'taak-' + globaleTaakId++;
    taakElement.setAttribute('data-leerling', leerlingNaam); 
    taakElement.setAttribute('data-taak-naam', subNaam ? `${hoofdNaam} (${subNaam})` : hoofdNaam); 
    taakElement.setAttribute('data-klaar-door', '');
    taakElement.setAttribute('data-groep', taakGroep); 
    taakElement.setAttribute('data-maker', 'docent'); 
    taakElement.setAttribute('draggable', 'true'); 
    taakElement.style.position = 'relative';
    
    const labelElement = document.createElement('div');
    labelElement.classList.add('taak-leerling-label'); 
    labelElement.style.cssText = "background-color: var(--donkergroen); color: white; font-size: 10px; padding: 2px 5px; border-radius: 3px; position: absolute; top: -10px; right: -10px; z-index: 10;";
    labelElement.innerText = 'Vaste Taak'; 
    taakElement.appendChild(labelElement);

    if (leerlingNaam !== 'Iedereen') {
        const specLabel = document.createElement('div');
        specLabel.style.cssText = "background-color: var(--oranje); color: white; font-size: 10px; padding: 2px 5px; border-radius: 3px; position: absolute; top: -10px; right: 55px; z-index: 10;";
        specLabel.innerText = leerlingNaam;
        taakElement.appendChild(specLabel);
    }

    const tekstElement = document.createElement('span'); 
    tekstElement.innerHTML = subNaam ? `<strong>${hoofdNaam}</strong><br><span style="font-size: 0.85em; opacity: 0.8;">${subNaam}</span>` : `<strong>${hoofdNaam}</strong>`; 
    taakElement.appendChild(tekstElement);
    
    koppelTaakEvents(taakElement);
    return taakElement;
}

function laadStandaardInhoud() {
    if (!groepenGeinitialiseerd[huidigeGroep]) {
        groepenGeinitialiseerd[huidigeGroep] = true;
    }
}

document.getElementById('voeg-eigen-klaartaak-toe').addEventListener('click', () => {
    const invoerVeld = document.getElementById('eigen-klaarkaart');
    if(invoerVeld.value.trim() !== '') {
        document.getElementById('klaartaken-lijst').appendChild(bouwTaakElement(invoerVeld.value.trim(), huidigeGebruiker, true, false, huidigeGroep, 'leerling'));
        invoerVeld.value = ''; 
    }
});

// --- DOCENTEN PANEEL ---
document.getElementById('voeg-taak-toe-knop').addEventListener('click', voegNieuweTaakToe);
document.getElementById('nieuwe-taak-input').addEventListener('keypress', function(e) { if (e.key === 'Enter') voegNieuweTaakToe(); });

function voegNieuweTaakToe() {
    const nieuweTaakTekst = document.getElementById('nieuwe-taak-input').value.trim(); 
    const ondertitelTekst = document.getElementById('taak-ondertitel-input').value.trim(); 
    const taakType = document.getElementById('taak-type-select').value;
    let taakKolomId = taakType === 'klaartaak' ? 'klaartaken-lijst' : document.getElementById('taak-kolom-select').value;
    
    if (nieuweTaakTekst !== '') {
        const doelKolom = document.getElementById(taakKolomId);
        let gekozenLeerlingen = [];
        if (document.getElementById('check-iedereen').checked) gekozenLeerlingen.push('Iedereen');
        else {
            document.querySelectorAll('.leerling-check').forEach(box => { if (box.checked) gekozenLeerlingen.push(box.value); });
            if (gekozenLeerlingen.length === 0) gekozenLeerlingen.push('Iedereen');
        }

        gekozenLeerlingen.forEach(leerling => {
            let nieuweTaak;
            if (taakType === 'vast') { nieuweTaak = bouwVasteTaakElement(nieuweTaakTekst, ondertitelTekst, huidigeGroep, leerling); }
            else if (taakType === 'dispenser') nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, false, true, huidigeGroep, 'docent');
            else if (taakType === 'klaartaak') nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, true, false, huidigeGroep, 'docent');
            else { nieuweTaak = bouwTaakElement(nieuweTaakTekst, leerling, false, false, huidigeGroep, 'docent'); }
            doelKolom.appendChild(nieuweTaak);
        });

        document.getElementById('nieuwe-taak-input').value = ''; 
        document.getElementById('taak-ondertitel-input').value = ''; 
        updateTaakZichtbaarheid(); berekenVoortgang(); 
    }
}

// SLIM SCHOONMAKEN (Oude bescherming voor 'standaard taken' definitief verwijderd!)
document.getElementById('wis-bord-knop').addEventListener('click', async () => {
    if(confirm("Weet je zeker dat je alle flexibele taken wilt wissen? Ook de kluisjes en ingevulde reflecties van deze groep worden dan leeggemaakt!")) {
        
        const wisKnop = document.getElementById('wis-bord-knop');
        wisKnop.innerText = "Bezig met wissen... Even geduld! ⏳";
        wisKnop.style.opacity = "0.7";
        wisKnop.style.pointerEvents = "none";

        // De nuke: wist ALLES behalve Vaste en Klaartaken
        document.querySelectorAll('.taak:not(.vaste-taak):not(.extra-taak):not(.dispenser-taak)').forEach(t => { 
            if (t.getAttribute('data-groep') === huidigeGroep) t.remove(); 
        });
        
        const wisKlaar = (taak) => {
            let klaarLijst = (taak.getAttribute('data-klaar-door') || '').split(',').filter(n => !actieveLeerlingenLijst.includes(n));
            taak.setAttribute('data-klaar-door', klaarLijst.join(','));
            if (klaarLijst.length === 0) taak.classList.remove('klaar'); 
        };

        document.querySelectorAll('.vaste-taak').forEach(t => { if (t.getAttribute('data-groep') === huidigeGroep) wisKlaar(t); });
        document.querySelectorAll('.extra-taak').forEach(t => { if (t.getAttribute('data-groep') === huidigeGroep) { wisKlaar(t); document.getElementById('klaartaken-lijst').appendChild(t); }});

        for (let i = 0; i < actieveLeerlingenLijst.length; i++) {
            const leerling = actieveLeerlingenLijst[i];
            wisKnop.innerText = `Schoonmaken... ${i+1}/${actieveLeerlingenLijst.length} ⏳`;

            for (const dag of werkDagen) {
                const rData = reflectieData[leerling][dag];
                if (rData && (rData.emotie !== '' || rData.lastig !== '' || rData.hulp !== '' || rData.trots !== '')) {
                    reflectieData[leerling][dag] = { emotie: '', lastig: '', hulp: '', trots: '' };
                    await stuurDataNaarGoogle({ sheet: 'reflecties', row: { id: leerling + "_" + dag, leerling: leerling, dag: dag, emotie: '', lastig: '', hulp: '', trots: '' }});
                }
            }
            
            await stuurDataNaarGoogle({ sheet: 'taken', row: { groep: huidigeGroep + "_" + leerling, bord_data: "[]" }});
        }
        
        wisKnop.innerText = "Basis opslaan... ⏳";
        berekenVoortgang(); 
        await stuurBordNaarGoogle(); 
        
        wisKnop.innerText = "Hele Bord Wissen 🧹";
        wisKnop.style.opacity = "1";
        wisKnop.style.pointerEvents = "auto";

        alert("Klaar voor de nieuwe week! Alles is netjes leeggemaakt.");
    }
});

// --- HANDMATIGE OPSLAAN KNOP ---
if(handmatigOpslaanKnop) {
    handmatigOpslaanKnop.addEventListener('click', async () => {
        handmatigOpslaanKnop.innerText = "⏳ Opslaan...";
        handmatigOpslaanKnop.style.opacity = "0.7";
        handmatigOpslaanKnop.style.pointerEvents = "none";
        
        await stuurBordNaarGoogle();
        
        handmatigOpslaanKnop.innerText = "✅ Opgeslagen!";
        handmatigOpslaanKnop.style.opacity = "1";
        setTimeout(() => {
            handmatigOpslaanKnop.innerText = "💾 Opslaan";
            handmatigOpslaanKnop.style.pointerEvents = "auto";
        }, 2000);
    });
}

// --- WEEKTDOWNLOAD ---
const downloadOverzichtKnop = document.getElementById('download-overzicht-knop');
if(downloadOverzichtKnop) {
    downloadOverzichtKnop.addEventListener('click', () => {
        let csv = "Leerling;Taken Af;Totaal Taken;Percentage;Ma Emotie;Ma Lastig;Ma Trots;Ma Hulp;Di Emotie;Di Lastig;Di Trots;Di Hulp;Wo Emotie;Wo Lastig;Wo Trots;Wo Hulp;Do Emotie;Do Lastig;Do Trots;Do Hulp;Vr Emotie;Vr Lastig;Vr Trots;Vr Hulp\n";

        const baseTasks = Array.from(document.querySelectorAll('.taak:not(.extra-taak):not(.dispenser-taak):not(.kloon-taak)'))
                                    .filter(t => t.getAttribute('data-groep') === huidigeGroep);

        actieveLeerlingenLijst.forEach(leerling => {
            let totaal = 0;
            let klaar = 0;
            let sBord = opgeslagenBorden[huidigeGroep + "_" + leerling] || [];
            
            baseTasks.forEach(origineel => {
                const doelgroep = origineel.getAttribute('data-leerling');
                if (doelgroep === 'Iedereen' || doelgroep === leerling) {
                    totaal++;
                    let isKlaar = false;

                    const sTaak = sBord.find(t => t.attrs && t.attrs.id === origineel.id);
                    if (sTaak && sTaak.attrs['data-klaar-door'] && sTaak.attrs['data-klaar-door'].includes(leerling)) {
                        isKlaar = true;
                    } else {
                        const sKloon = sBord.find(t => t.attrs && t.attrs['data-kloon-van'] === origineel.id && t.attrs['class'].includes('klaar'));
                        if (sKloon) isKlaar = true;
                    }

                    if (isKlaar) klaar++;
                }
            });
            let percentage = totaal === 0 ? 0 : Math.round((klaar / totaal) * 100);

            let row = [leerling, klaar, totaal, percentage + "%"];
            
            werkDagen.forEach(dag => {
                const rData = reflectieData[leerling] && reflectieData[leerling][dag] ? reflectieData[leerling][dag] : {emotie: '', lastig: '', hulp: '', trots: ''};
                row.push(escapeCSV(rData.emotie));
                row.push(escapeCSV(rData.lastig));
                row.push(escapeCSV(rData.trots));
                row.push(escapeCSV(rData.hulp));
            });

            csv += row.join(";") + "\n";
        });

        const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' }); 
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        let datumVandaag = new Date().toISOString().split('T')[0];
        link.setAttribute("download", `Weekoverzicht_${huidigeGroep}_${datumVandaag}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function escapeCSV(str) {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""'); 
    return `"${s}"`; 
}