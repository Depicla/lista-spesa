/* SHOPPING_LIST_REV.22_SCROLL_STYLE_FIX */

// --- 1. CONFIGURAZIONE FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyB6NWJUGq8Zr7WPawZyIw9l3IA6sE6dUw0",
    authDomain: "spesafamiglia-d0fb6.firebaseapp.com",
    databaseURL: "https://spesafamiglia-d0fb6-default-rtdb.firebaseio.com",
    projectId: "spesafamiglia-d0fb6",
    storageBucket: "spesafamiglia-d0fb6.firebasestorage.app",
    messagingSenderId: "1093770708174",
    appId: "1:1093770708174:web:f022b2d6d4dc007bcbbc9f"
};
// ---------------------------------------------------

// Inizializza Firebase
let db = null;
try {
    if(typeof firebase !== 'undefined' && firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
    } else if(typeof firebase !== 'undefined') {
        db = firebase.database();
    }
} catch (e) { console.error("Firebase Error:", e); }

let isDataLoaded = false;
let isReconnecting = false; 

// --- DATI DEFAULT ---
const fullSeasonalData = {
    Frutta: {
        0: ["Arance", "Cachi", "Cedri", "Clementine", "Kiwi", "Limoni", "Mandarini", "Mandaranci", "Mele", "Pere", "Pompelmo"],
        1: ["Arance", "Cedri", "Clementine", "Kiwi", "Limoni", "Mandarini", "Mandaranci", "Mele", "Pere", "Pompelmi"],
        2: ["Arance", "Bergamotto", "Clementine", "Kiwi", "Limoni", "Mandarini", "Mandaranci", "Mele", "Pere", "Pompelmi"],
        3: ["Cedri", "Fragole", "Kiwi", "Limoni", "Mele", "Nespole", "Pere", "Pompelmi"],
        4: ["Albicocche", "Ciliegie", "Fragole", "Limoni", "Mele", "Nespole", "Pere", "Pesche"],
        5: ["Albicocche", "Ciliegie", "Fragole", "Kiwi", "Limoni", "Mirtilli", "Nespole", "Pesche", "Susine"],
        6: ["Albicocche", "Amarene", "Anguria", "Ciliegie", "Fichi", "Lamponi", "Limoni", "Meloni", "Mirtilli", "Nespole", "Pere", "Pesche", "Ribes", "Susine"],
        7: ["Albicocche", "Anguria", "Fichi", "Lamponi", "Meloni", "Mirtilli", "More", "Pere", "Pesche", "Ribes", "Susine", "Uva"],
        8: ["Angurie", "Fichi", "Fichi d'India", "Lamponi", "Limoni", "Mandorle", "Melagrane", "Mele", "Meloni", "More", "Pere", "Pesche", "Prugne", "Susine", "Uva"],
        9: ["Cachi", "Castagne", "Fichi d'India", "Giuggiole", "Kiwi", "Mandorle", "Melagrane", "Mele", "Nocciole", "Noci", "Olive", "Pere", "Pinoli", "Prugne", "Pompelmi", "Uva"],
        10: ["Arance", "Bergamotto", "Cachi", "Castagne", "Cedri", "Clementine", "Fichi d'India", "Kiwi", "Limoni", "Mandarini", "Mandaranci", "Melagrane", "Mele", "Pere", "Pompelmo", "Uva"],
        11: ["Arance", "Bergamotto", "Cachi", "Castagne", "Cedri", "Clementine", "Fichi d'India", "Kiwi", "Limoni", "Mandarini", "Mandaranci", "Melagrane", "Mele", "Pere", "Pompelmo", "Uva"]
    },
    Verdura: {
        0: ["Aglio", "Bietole", "Broccoli", "Cavolfiori", "Cavolo cappuccio", "Verza", "Carciofi", "Carote", "Cicoria", "Finocchi", "Lattuga", "Patate", "Porri", "Radicchio", "Spinaci", "Zucca"],
        1: ["Aglio", "Bietole", "Broccoli", "Cavolfiori", "Verza", "Carciofi", "Carote", "Cicoria", "Finocchi", "Lattuga", "Patate", "Porri", "Radicchio", "Spinaci", "Zucca"],
        2: ["Agretti", "Asparagi", "Bietole", "Broccoli", "Carciofi", "Carote", "Cavoli", "Cicoria", "Cipollotti", "Finocchi", "Lattuga", "Patate", "Piselli", "Porri", "Ravanelli", "Sedano", "Spinaci"],
        3: ["Agretti", "Asparagi", "Bietole", "Carciofi", "Carote", "Cavoli", "Cipollotti", "Fave", "Finocchi", "Lattuga", "Piselli", "Radicchio", "Spinaci"],
        4: ["Aglio", "Agretti", "Asparagi", "Bietole", "Carciofi", "Carote", "Cavolfiori", "Broccoli", "Cetrioli", "Cicoria", "Cipolle", "Fagiolini", "Fave", "Finocchi", "Indivia", "Lattuga", "Patate", "Piselli", "Ravanelli", "Spinaci", "Zucchine"],
        5: ["Bietole", "Carote", "Cetrioli", "Cipolle", "Cipollotti", "Fagiolini", "Fave", "Lattuga", "Melanzane", "Peperoni", "Piselli", "Pomodori", "Ravanelli", "Spinaci", "Zucchine"],
        6: ["Bietole", "Carote", "Cetrioli", "Cipolle", "Cipollotti", "Fagiolini", "Fave", "Lattuga", "Melanzane", "Peperoni", "Piselli", "Pomodori", "Ravanelli", "Zucchine", "Fagioli freschi"],
        7: ["Bietole", "Carote", "Cetrioli", "Cipolle", "Cipollotti", "Fagiolini", "Fave", "Lattuga", "Melanzane", "Peperoni", "Pomodori", "Ravanelli", "Zucchine"],
        8: ["Bietole", "Carote", "Cetrioli", "Fagiolini", "Lattuga", "Melanzane", "Peperoni", "Pomodori", "Radicchio", "Spinaci", "Zucca", "Zucchine"],
        9: ["Bietole", "Broccoli", "Carote", "Cavolfiori", "Cavoli", "Cicoria", "Finocchi", "Patate", "Porri", "Radicchio", "Spinaci", "Zucca"],
        10: ["Bietole", "Broccoli", "Carote", "Cavolfiori", "Cavoli", "Cicoria", "Finocchi", "Patate", "Porri", "Radicchio", "Sedano", "Spinaci", "Zucca"],
        11: ["Aglio secco", "Bietole", "Broccoli", "Cavolfiori", "Cavolini di Bruxelles", "Cavolo cappuccio", "Verza", "Carciofi", "Carote", "Cicoria", "Cime di rapa", "Cipolle", "Finocchi", "Indivia", "Lattuga", "Patate", "Porri", "Radicchio", "Sedano", "Spinaci", "Zucca"]
    }
};

const defaultData = {
    lists: { "Shopping List": [] },
    currentList: "Shopping List",
    stores: ["Supermercato", "Frutteto"],
    inventory: {
        frutta: [], verdura: [],
        latticini: ["Latte", "Burro", "Yogurt", "Formaggio", "Mozzarella", "Panna", "Parmigiano", "Ricotta"],
        altro: ["Pane", "Acqua", "Pasta", "Riso", "Olio", "Sale", "Zucchero", "Caffè", "Detersivo"]
    },
    seasonalData: fullSeasonalData,
    settings: { theme: "light", defaultStores: { frutta: "Frutteto", verdura: "Frutteto", latticini: "Supermercato", altro: "Supermercato" } }
};

let appState = JSON.parse(JSON.stringify(defaultData));
let itemToDelete = null;
let itemToEdit = null;
let currentSearchTerm = "";

// --- AVVIO E SYNC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Timer sicurezza per sblocco UI
    setTimeout(() => {
        const loader = document.getElementById('loading-overlay');
        if(loader && loader.style.display !== 'none') {
            loader.style.display = 'none';
            isDataLoaded = true; // Permetti uso locale
        }
    }, 2000);

    if(db) {
        // 2. Monitoraggio Stato Connessione (Pallino)
        db.ref(".info/connected").on("value", (snap) => {
            const title = document.getElementById('page-title');
            const isConnected = snap.val() === true;
            const color = isConnected ? "#34c759" : "#ff3b30";
            if(title) title.innerHTML = `Shopping List <span onclick="triggerManualSync()" style="color:${color}; font-size:14px; cursor:pointer;">●</span>`;
        });

        // 3. EVENTO: Il telefono torna online
        window.addEventListener('online', () => {
            performDoubleSync("Rete rilevata");
        });

        // 4. EVENTO: L'app torna in primo piano
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') {
                performDoubleSync("App attiva");
            }
        });

        // 5. Listener Dati (Sincronizzazione)
        db.ref('shoppingApp_V12').on('value', (snapshot) => {
            const data = snapshot.val();
            const loader = document.getElementById('loading-overlay');
            if(loader) loader.style.display = 'none';

            if (data) {
                appState = data;
                // Patch sicurezza
                if (!appState.lists) appState.lists = { "Shopping List": [] };
                if (!appState.lists[appState.currentList]) appState.currentList = Object.keys(appState.lists)[0] || "Shopping List";
                if (!appState.seasonalData) appState.seasonalData = JSON.parse(JSON.stringify(fullSeasonalData));
                if (!appState.inventory) appState.inventory = JSON.parse(JSON.stringify(defaultData.inventory));
                
                populateInventoryFromSeason();
            } else {
                restoreDefaults();
            }
            isDataLoaded = true;
            refreshUI();
        });
    } else {
        // Se DB non configurato, sblocca comunque
        document.getElementById('loading-overlay').style.display = 'none';
        isDataLoaded = true;
    }
});

// --- SISTEMA DOPPIA SINCRONIZZAZIONE ---
function performDoubleSync(reason) {
    triggerManualSync(); 
    setTimeout(() => {
        isReconnecting = false; 
        triggerManualSync();
    }, 4000);
}

window.triggerManualSync = function() {
    if(isReconnecting || !db) return;
    isReconnecting = true;
    showToast("🔄 Sincronizzazione...");
    db.goOffline();
    setTimeout(() => {
        db.goOnline();
        setTimeout(() => {
            showToast("✅ Allineato");
            isReconnecting = false;
        }, 2500); 
    }, 500);
}

function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if(toast) {
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => { toast.classList.add('hidden'); }, 3000);
    }
}

function refreshUI() {
    applyTheme();
    updateCartBadge();
    const activeBtn = document.querySelector('.nav-btn.active');
    
    // FIX SFONDO INIZIALE:
    // Se c'è un bottone attivo (es. cambio tab), usalo.
    // Altrimenti (avvio app), forza navTo('carrello') per applicare lo stile notepad.
    if(activeBtn) {
        const onclickAttr = activeBtn.getAttribute('onclick');
        if(onclickAttr) {
            const sectionName = onclickAttr.match(/'([^']+)'/)[1];
            navTo(sectionName);
        }
    } else {
        // Se non c'è selezione, siamo all'avvio: forza il carrello E lo stile
        navTo('carrello');
    }
}

function restoreDefaults() {
    appState = JSON.parse(JSON.stringify(defaultData));
    populateInventoryFromSeason();
    saveState();
}

function saveState() {
    if (!isDataLoaded || !appState || !appState.inventory) return;
    if(db) db.ref('shoppingApp_V12').set(appState).catch(e => console.error("Err Save:", e));
}

function populateInventoryFromSeason() {
    if(!appState.inventory.frutta || appState.inventory.frutta.length === 0) {
        let allFruits = new Set();
        if(appState.seasonalData && appState.seasonalData.Frutta) {
            Object.values(appState.seasonalData.Frutta).forEach(arr => arr.forEach(i => allFruits.add(i)));
        }
        appState.inventory.frutta = Array.from(allFruits).sort();
    }
    if(!appState.inventory.verdura || appState.inventory.verdura.length === 0) {
        let allVegs = new Set();
        if(appState.seasonalData && appState.seasonalData.Verdura) {
            Object.values(appState.seasonalData.Verdura).forEach(arr => arr.forEach(i => allVegs.add(i)));
        }
        appState.inventory.verdura = Array.from(allVegs).sort();
    }
}

// --- NAVIGAZIONE ---
function navTo(section) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    currentSearchTerm = "";
    
    // Gestione Stile Notepad
    if(section !== 'carrello') {
        const btn = document.querySelector(`button[onclick="navTo('${section}')"]`);
        if(btn) btn.classList.add('active');
        document.getElementById('main-content').classList.remove('notepad-mode');
    } else {
        // Qui aggiungiamo la classe, e poiché navTo è chiamato da refreshUI all'avvio, 
        // lo sfondo apparirà subito.
        document.getElementById('main-content').classList.add('notepad-mode');
        // Attiva visivamente il bottone del carrello
        const cartBtn = document.querySelector('.cart-main-btn');
        if(cartBtn) cartBtn.classList.add('active'); // Opzionale, se vuoi stile attivo sul carrello
    }

    const headerTitle = document.getElementById('page-title');
    const cartActions = document.getElementById('cart-actions');
    cartActions.style.display = 'none';

    const currentDot = headerTitle.querySelector('span') ? headerTitle.querySelector('span').outerHTML : '';

    switch(section) {
        case 'frutta': headerTitle.innerHTML = `Frutta ${currentDot}`; renderListSection('frutta'); break;
        case 'verdura': headerTitle.innerHTML = `Verdura ${currentDot}`; renderListSection('verdura'); break;
        case 'latticini': headerTitle.innerHTML = `Latticini ${currentDot}`; renderListSection('latticini'); break;
        case 'altro': headerTitle.innerHTML = `Altro ${currentDot}`; renderListSection('altro'); break;
        case 'carrello': 
            headerTitle.innerHTML = `${appState.currentList || "Shopping List"} ${currentDot}`; 
            cartActions.style.display = 'flex'; 
            renderCart(); 
            break;
        case 'stagione': headerTitle.innerHTML = `Stagionalità ${currentDot}`; renderSeason(); break;
        case 'liste': headerTitle.innerHTML = `Le tue Liste ${currentDot}`; renderListsParams(); break;
        case 'opzioni': headerTitle.innerHTML = `Opzioni ${currentDot}`; renderOptions(); break;
    }
}

// --- RENDER CARRELLO ---
function renderCart() {
    const main = document.getElementById('main-content');
    const container = document.createElement('div');
    container.className = 'notepad-content'; 
    main.innerHTML = ''; main.appendChild(container);

    const fullList = (appState.lists && appState.lists[appState.currentList]) ? appState.lists[appState.currentList] : [];
    
    const activeList = fullList.filter(i => !i.checked);
    const completedList = fullList.filter(i => i.checked);

    if(activeList.length === 0 && completedList.length === 0) { 
        container.innerHTML = '<div style="text-align:center; color:gray; margin-top:50px;">Carrello vuoto</div>'; 
        return; 
    }

    const grouped = {};
    activeList.forEach(i => { if(!grouped[i.store]) grouped[i.store] = []; grouped[i.store].push(i); });

    Object.keys(grouped).sort().forEach(store => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'cart-group';
        groupDiv.innerHTML = `<div class="cart-group-title">${store}</div>`;
        grouped[store].forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-qty">${item.qty}${item.unit}</span>
                    <span class="cart-item-note">${item.note}</span>
                </div>
                <div class="cart-actions-btn">
                    <i class="fas fa-trash btn-remove" onclick="askDeleteCartItem(${item.id})"></i>
                    <i class="far fa-check-circle btn-check" onclick="checkItem(${item.id})"></i>
                </div>
            `;
            groupDiv.appendChild(div);
        });
        container.appendChild(groupDiv);
    });

    if(completedList.length > 0) {
        const completedSection = document.createElement('div');
        completedSection.className = 'completed-section';
        let completedHtml = `
            <div class="completed-header">
                <strong>Prodotti Acquistati</strong>
                <button class="btn-clean-completed" onclick="clearCompletedItems()"><i class="fas fa-trash"></i> Svuota</button>
            </div>
        `;
        completedList.forEach(item => {
            completedHtml += `
                <div class="cart-item is-completed">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-qty">${item.qty}${item.unit}</span>
                        <span class="cart-item-note">${item.note}</span>
                    </div>
                    <div class="cart-actions-btn">
                        <i class="fas fa-undo btn-restore" onclick="checkItem(${item.id})"></i>
                    </div>
                </div>
            `;
        });
        completedSection.innerHTML = completedHtml;
        container.appendChild(completedSection);
    }
}

// --- AZIONI CARRELLO ---
function checkItem(id) {
    const list = appState.lists[appState.currentList];
    const item = list.find(i => i.id === id);
    if(item) { item.checked = !item.checked; saveState(); }
}

function clearCompletedItems() {
    if(confirm("Vuoi rimuovere definitivamente tutti i prodotti acquistati?")) {
        appState.lists[appState.currentList] = appState.lists[appState.currentList].filter(i => !i.checked);
        saveState();
    }
}

function shareList() {
    const list = (appState.lists[appState.currentList] || []).filter(i => !i.checked);
    if (list.length === 0) { alert("La lista da comprare è vuota!"); return; }

    let text = `🛒 *${appState.currentList}*\n\n`;
    const grouped = {};
    list.forEach(i => { if (!grouped[i.store]) grouped[i.store] = []; grouped[i.store].push(i); });

    Object.keys(grouped).sort().forEach(store => {
        text += `📍 *${store}*\n`;
        grouped[store].forEach(i => {
            const note = i.note ? ` _(${i.note})_` : '';
            text += `- ${i.name}: ${i.qty} ${i.unit}${note}\n`;
        });
        text += `\n`;
    });

    if (navigator.share) {
        navigator.share({ title: 'Spesa', text: text }).catch(() => fallbackWhatsApp(text));
    } else {
        fallbackWhatsApp(text);
    }
}

function fallbackWhatsApp(text) {
    if(confirm("Aprire WhatsApp?")) {
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
}

// --- MODAL & LOGIC ---
function openAddModal(name, cat) {
    itemToEdit = { name, category: cat };
    document.getElementById('modal-item-name').innerText = name || "Nuovo";
    const sel = document.getElementById('modal-store');
    sel.innerHTML = '';
    (appState.stores || []).forEach(s => { const o = document.createElement('option'); o.text = s; sel.add(o); });
    
    const existing = (appState.lists[appState.currentList] || []).find(c => c.name === name && !c.checked);

    if (existing) {
        sel.value = existing.store;
        document.getElementById('modal-qty').value = existing.qty;
        document.getElementById('modal-unit').value = existing.unit;
        document.getElementById('modal-notes').value = existing.note;
    } else {
        sel.value = appState.settings.defaultStores[cat] || appState.stores[0];
        document.getElementById('modal-qty').value = "1";
        document.getElementById('modal-unit').value = "pz";
        document.getElementById('modal-notes').value = "";
    }
    document.getElementById('add-modal').style.display = 'flex';
}

function closeModal() { document.getElementById('add-modal').style.display = 'none'; }

function addToCartConfirm() {
    const l = appState.currentList;
    if(!appState.lists) appState.lists = {};
    if(!appState.lists[l]) appState.lists[l] = [];
    
    if(!appState.inventory[itemToEdit.category].includes(itemToEdit.name)) {
        appState.inventory[itemToEdit.category].push(itemToEdit.name);
        appState.inventory[itemToEdit.category].sort();
    }

    const item = {
        id: Date.now(),
        name: itemToEdit.name,
        category: itemToEdit.category,
        qty: document.getElementById('modal-qty').value,
        unit: document.getElementById('modal-unit').value,
        store: document.getElementById('modal-store').value,
        note: document.getElementById('modal-notes').value,
        checked: false
    };

    const idx = appState.lists[l].findIndex(i => i.name === item.name && !i.checked);
    if(idx > -1) appState.lists[l].splice(idx, 1);
    
    appState.lists[l].push(item);
    
    document.getElementById('modal-qty').value = "1";
    document.getElementById('modal-notes').value = "";
    
    saveState(); closeModal();
}

// --- GESTIONE DELETE ---
function askDeleteCartItem(id) { itemToDelete={type:'cart',id}; openConfirmModal("Rimuovere dal carrello?", false); }
function askDeleteInventory(cat, name) { itemToDelete={type:'inv',cat,name}; openConfirmModal("Eliminare definitivamente?", false); }
function askDeleteStore(name) { itemToDelete={type:'store',name}; openConfirmModal("Eliminare negozio?", false); }
function askDeleteSeasonItem(m, cat, name) { 
    itemToDelete = { type:'seas', m, cat, name }; 
    openConfirmModal(`Eliminare "${name}"?`, true); 
}

function openConfirmModal(msg, showDeleteAll) {
    document.querySelector('#confirm-modal h3').innerText = "Attenzione";
    document.querySelector('#confirm-modal p').innerText = msg;
    const btnContainer = document.querySelector('#confirm-modal .modal-actions');
    const existingExtra = btnContainer.querySelector('.delete-all-btn');
    if(existingExtra) existingExtra.remove();

    if(showDeleteAll) {
        const btnAll = document.createElement('button');
        btnAll.className = 'delete-all-btn';
        btnAll.innerText = "DA TUTTO";
        btnAll.style.backgroundColor = "var(--danger-color)";
        btnAll.style.color = "white";
        btnAll.style.marginRight = "auto";
        btnAll.onclick = confirmDeleteAll;
        btnContainer.prepend(btnAll);
    }
    document.getElementById('confirm-modal').style.display = 'flex';
}

function confirmDeleteAll() {
    if(itemToDelete && itemToDelete.type === 'seas') {
        const cat = itemToDelete.cat; 
        const name = itemToDelete.name;
        const arrMonth = appState.seasonalData[cat][itemToDelete.m];
        const idxM = arrMonth.indexOf(name);
        if(idxM > -1) arrMonth.splice(idxM, 1);
        const globalCat = cat.toLowerCase(); 
        const arrInv = appState.inventory[globalCat];
        if(arrInv) {
            const idxI = arrInv.indexOf(name);
            if(idxI > -1) { arrInv.splice(idxI, 1); alert(`Eliminato ${name} anche dalla lista principale.`); }
        }
        saveState(); closeConfirmModal();
    }
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if(itemToDelete.type === 'cart') {
        const list = appState.lists[appState.currentList];
        const idx = list.findIndex(i => i.id === itemToDelete.id);
        if(idx > -1) list.splice(idx, 1);
    } else if (itemToDelete.type === 'inv') {
        const arr = appState.inventory[itemToDelete.cat];
        const idx = arr.indexOf(itemToDelete.name);
        if(idx > -1) arr.splice(idx, 1);
    } else if (itemToDelete.type === 'seas') {
        const arr = appState.seasonalData[itemToDelete.cat][itemToDelete.m];
        const idx = arr.indexOf(itemToDelete.name);
        if(idx > -1) arr.splice(idx, 1);
    } else if (itemToDelete.type === 'store') {
        const idx = appState.stores.indexOf(itemToDelete.name);
        if(idx > -1) appState.stores.splice(idx, 1);
    }
    saveState(); closeConfirmModal();
});

function closeConfirmModal() { document.getElementById('confirm-modal').style.display = 'none'; itemToDelete = null; }

// --- ALTRE FUNZIONI ---
function renderListSection(category) {
    const main = document.getElementById('main-content');
    main.innerHTML = '';
    const searchDiv = document.createElement('div');
    searchDiv.className = 'search-container';
    searchDiv.innerHTML = `<input type="text" class="search-input" placeholder="Cerca ${category}..." value="${currentSearchTerm}" onkeyup="handleSearch(this.value, '${category}')">`;
    main.appendChild(searchDiv);

    const currentMonth = new Date().getMonth();
    const seasonKey = category === 'frutta' ? 'Frutta' : (category === 'verdura' ? 'Verdura' : null);
    const seasonItems = (seasonKey && appState.seasonalData && appState.seasonalData[seasonKey]) ? (appState.seasonalData[seasonKey][currentMonth] || []) : [];
    
    if(!appState.inventory[category]) appState.inventory[category] = [];
    let list = appState.inventory[category].sort();
    if(currentSearchTerm) list = list.filter(i => i.toLowerCase().includes(currentSearchTerm.toLowerCase()));

    const currentCart = (appState.lists && appState.lists[appState.currentList]) ? appState.lists[appState.currentList] : [];

    if(list.length === 0) {
        main.innerHTML += `<div style="text-align:center; margin-top:20px; color:gray;">Nessun elemento.<br><br><button class="confirm-btn" onclick="openAddModal('${currentSearchTerm}', '${category}')">+ Aggiungi Nuovo</button></div>`;
        return;
    }

    list.forEach(item => {
        const isSeasonal = seasonItems.includes(item);
        const inCart = currentCart.find(c => c.name === item && !c.checked);
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item}</span>
                ${isSeasonal ? '<i class="fas fa-sun season-icon"></i>' : ''}
                ${inCart ? `<span class="in-cart-indicator">${inCart.qty} ${inCart.unit}</span>` : ''}
            </div>
            <div class="item-actions">
                <button class="btn-del" onclick="askDeleteInventory('${category}', '${item}')"><i class="fas fa-trash"></i></button>
                <button class="btn-add" onclick="openAddModal('${item}', '${category}')"><i class="fas fa-plus-circle"></i></button>
            </div>
        `;
        main.appendChild(div);
    });
}

function handleSearch(val, cat) { currentSearchTerm = val; renderListSection(cat); document.querySelector('.search-input').focus(); }

function renderSeason() {
    const main = document.getElementById('main-content');
    const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    const currentMonth = parseInt(localStorage.getItem('lastSeasonMonth') || new Date().getMonth());
    let html = `<div style="padding:10px;"><label>Mese:</label><select id="season-month-select" onchange="updateSeasonView(this.value)" style="width:100%; padding:10px; font-size:16px; margin-bottom:20px;">`;
    monthNames.forEach((m, i) => { html += `<option value="${i}" ${i === currentMonth ? 'selected' : ''}>${m}</option>`; });
    html += `</select><div id="season-results"></div></div>`;
    main.innerHTML = html;
    updateSeasonView(currentMonth);
}

function updateSeasonView(monthIndex) {
    localStorage.setItem('lastSeasonMonth', monthIndex);
    const res = document.getElementById('season-results');
    const renderList = (cat) => {
        const items = (appState.seasonalData && appState.seasonalData[cat]) ? (appState.seasonalData[cat][monthIndex] || []) : [];
        let h = `<h3>${cat} <button onclick="addSeasonItem('${cat}', ${monthIndex})" class="confirm-btn" style="font-size:10px; padding:3px 8px;">+ Aggiungi</button></h3><div style="display:flex; flex-wrap:wrap; gap:5px;">`;
        items.forEach(i => { h += `<span style="background:white; border:1px solid #ccc; padding:4px 8px; border-radius:15px; font-size:13px;">${i} <i class="fas fa-times" onclick="askDeleteSeasonItem(${monthIndex}, '${cat}', '${i}')" style="color:red; margin-left:5px;"></i></span>`; });
        return h + `</div><hr>`;
    };
    res.innerHTML = renderList("Frutta") + renderList("Verdura");
}

function renderListsParams() {
    const main = document.getElementById('main-content');
    let html = `<div style="padding:10px;">`;
    if (!appState.lists) appState.lists = { "Shopping List": [] };
    Object.keys(appState.lists).forEach(lName => {
        const isActive = lName === appState.currentList;
        const borderStyle = isActive ? 'border: 2px solid var(--accent-color); background-color: rgba(0,122,255,0.1);' : 'border: 1px solid var(--border-color);';
        html += `<div class="item-row" onclick="switchList('${lName}')" style="cursor:pointer; ${borderStyle} padding: 15px; margin-bottom: 10px;"><span style="font-weight:bold; font-size: 18px;">${lName}</span>${isActive ? '<span style="color:var(--accent-color); font-weight:bold; float:right;">ATTIVA <i class="fas fa-check-circle"></i></span>' : ''}</div>`;
    });
    html += `<button onclick="createNewList()" style="width:100%; padding:15px; background:var(--accent-color); color:white; border:none; border-radius:10px; margin-top:20px; font-size:16px; font-weight:bold;">+ Crea Nuova Lista</button></div>`;
    main.innerHTML = html;
}

function switchList(name) { appState.currentList = name; saveState(); navTo('carrello'); }
function createNewList() { const name = prompt("Nome della nuova lista:"); if(name) { if(!appState.lists) appState.lists = {}; if(!appState.lists[name]) { appState.lists[name] = [{ id: Date.now(), name: "Nuova Lista", qty: 1, unit: "", store: "", note: "Inizia ad aggiungere...", checked: false }]; appState.currentList = name; saveState(); navTo('carrello'); } else { alert("Esiste già una lista con questo nome."); } } }

function renderOptions() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div style="padding:15px;">
            <p style="text-align:center; color:green;"><b>☁️ Cloud Sync Attivo</b></p>
            <h3>Generale</h3><button onclick="toggleTheme()" class="item-row" style="width:100%; justify-content:center;">Cambia Tema</button>
            <h3>Negozi</h3><div class="item-row" style="flex-wrap:wrap; gap:5px;">${(appState.stores || []).map(s => `<span style="background:#eee; padding:3px 8px; border-radius:10px; font-size:12px;">${s} <i class="fas fa-times" onclick="askDeleteStore('${s}')" style="color:red;"></i></span>`).join('')}</div><button onclick="addStore()" style="margin-top:5px; padding:5px;">+ Aggiungi Negozio</button>
            <h3>Prodotti Manuali</h3><input type="text" id="new-prod-name" placeholder="Nome" style="width:100%; padding:8px;"><select id="new-prod-cat" style="width:100%; margin-top:5px; padding:8px;"><option value="frutta">Frutta</option><option value="verdura">Verdura</option><option value="latticini">Latticini</option><option value="altro">Altro</option></select><button onclick="addManualProduct()" class="confirm-btn" style="width:100%; margin-top:10px; padding:10px;">Salva Prodotto</button>
            <hr style="margin:20px 0;"><button onclick="forceReset()" style="width:100%; padding:15px; background:red; color:white; border:none; border-radius:10px;">⚠️ RESETTA DATABASE</button>
        </div>`;
}

function addStore() { const name = prompt("Nome Negozio:"); if(name && !appState.stores.includes(name)) { appState.stores.push(name); saveState(); } }
function addManualProduct() { const name = document.getElementById('new-prod-name').value; const cat = document.getElementById('new-prod-cat').value; if(name) { if(!appState.inventory[cat].includes(name)) appState.inventory[cat].push(name); saveState(); alert("Salvato!"); } }
function forceReset() { if(confirm("Sei sicuro di voler RESETTARE tutto il database?")) restoreDefaults(); }
function enterApp() { document.getElementById('welcome-screen').classList.remove('active'); document.getElementById('app-screen').classList.add('active'); }
function toggleTheme() { appState.settings.theme = appState.settings.theme==='light'?'dark':'light'; saveState(); }
function applyTheme() { document.body.setAttribute('data-theme', appState.settings.theme); }
function updateCartBadge() { const list = (appState.lists && appState.lists[appState.currentList]) ? appState.lists[appState.currentList] : []; const count = list.filter(i => !i.checked).length; const badge = document.getElementById('cart-badge'); if(count > 0) { badge.style.display = 'flex'; badge.innerText = count; } else { badge.style.display = 'none'; } }