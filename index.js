console.log("index.js loaded")
import { db, ref, set, get, onValue } from "./firebase.js";

const button  = document.getElementById("Clicker");
const Img     = document.getElementById("GoonImg");
const Count   = document.getElementById("Count");
const Upgrade = document.getElementById("Upgrade");
const Cost    = document.getElementById("Price");
const Winner  = document.getElementById("Winner");

const getLocal = (key, fallback) => {
    const val = localStorage.getItem(key);
    return val !== null ? parseInt(val) : fallback;
};

let Goon         = getLocal("GoonCount", 0);
let GoonPerClick = getLocal("GoonPerClick", 1);
let GoonCost     = getLocal("GoonCost", 15);
let Username     = localStorage.getItem("Username");

Count.textContent = Goon;
Cost.textContent  = "Cost = " + GoonCost;
Img.classList.add("BeforeGoon");

function saveLocal() {
    localStorage.setItem("GoonCount",    Goon);
    localStorage.setItem("GoonPerClick", GoonPerClick);
    localStorage.setItem("GoonCost",     GoonCost);
}

function saveScore() {
    if (!Username) return;
    set(ref(db, "players/" + Username), {
        username: Username,
        score: Goon
    });
}

function updateUI() {
    Count.textContent = Goon;
    Cost.textContent  = "Cost = " + GoonCost;
}

async function setupUsername() {
    let name = "";
    while (!name) {
        name = prompt("Enter your username (Only then can you be a gooner):");
        if (!name) { alert("I SAID ENTER A USER NAME NOW!!!"); continue; }
        const snapshot = await get(ref(db, "players/" + name));
        if (snapshot.exists()) {
            alert("This diddy blud tried to use a taken username? couldn't be me.");
            name = "";
        } else {
            Username = name;
            localStorage.setItem("Username", Username);
            saveScore();
        }
    }
}

if (!Username) setupUsername();

onValue(ref(db, "players"), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const top = Object.values(data).reduce((best, player) =>
        player.score > best.score ? player : best
    );
    Winner.textContent = "Top Gooner: " + top.username + " (" + top.score + " Goons)";
});

button.addEventListener("click", Activate);
button.addEventListener("mouseenter", () => button.textContent = "Yeah click here");
button.addEventListener("mouseleave", () => button.textContent = "Click to goon");
Upgrade.addEventListener("click", UpgradeGoon);

function UpgradeGoon() {
    if (Goon >= GoonCost) {
        alert("Goon");
        Goon         -= GoonCost;
        GoonPerClick++;
        GoonCost++;
        updateUI();
        saveLocal();
        saveScore();
    } else {
        Upgrade.classList.add("NopeAnim");
        Upgrade.addEventListener("animationend", () => {
            Upgrade.classList.remove("NopeAnim");
        }, { once: true });
    }
}

function Activate() {
    Goon += GoonPerClick;
    updateUI();
    saveLocal();
    saveScore();
    Img.classList.remove("BeforeGoon");
    Img.classList.add("Gooning");
    Img.addEventListener("animationend", () => {
        Img.classList.remove("Gooning");
    }, { once: true });
}