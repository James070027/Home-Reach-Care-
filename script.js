// Home Reach Care: how the website behaves.
// To change the phone number, edit the two lines below.
const PHONE = "256766791805";      // number for WhatsApp links, no + or spaces
const PHONE_SHOWN = "0766 791 805"; // number shown to visitors

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// ---------- WhatsApp and phone buttons ----------
// These are ordinary links, so the phone itself opens WhatsApp or the dialler.
// (Some preview windows block this. On the real website it works normally.)
const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
toast.hidden = true;
document.body.appendChild(toast);

function showNumber() {
  toast.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = "Please call us on " + PHONE_SHOWN + ".";
  const copy = document.createElement("button");
  copy.type = "button";
  copy.textContent = "Copy number";
  copy.onclick = () => { try { navigator.clipboard.writeText(PHONE_SHOWN); copy.textContent = "Copied ✓"; } catch (e) { copy.textContent = PHONE_SHOWN; } };
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  close.onclick = () => { toast.hidden = true; };
  toast.append(p, copy, close);
  toast.hidden = false;
}

function waLink(msg) { return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg); }

document.querySelectorAll("[data-wa]").forEach(el => {
  el.href = waLink(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});

// On computers there is usually no dialler, so show the number instead of doing nothing.
if (!isMobile) {
  document.querySelectorAll('a[href^="tel:"]').forEach(el => el.addEventListener("click", e => { e.preventDefault(); showNumber(); }));
}

// ---------- Menu on phones ----------
const btn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
btn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  btn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); btn.setAttribute("aria-expanded", false); }
});

// ---------- Live Google map ----------
// Shows the map on a normal website. In preview windows that block maps, the "Open in Maps" buttons stay.
const mapBox = document.getElementById("mapBox");
if (mapBox && !/claude|usercontent/i.test(location.hostname)) {
  const f = document.createElement("iframe");
  f.className = "map";
  f.title = "Map showing Home Reach Care in Katabi, Entebbe";
  f.loading = "lazy";
  f.src = "https://maps.google.com/maps?q=" + encodeURIComponent("St. Joseph Primary School Katabi Entebbe") + "&output=embed";
  mapBox.prepend(f);
  mapBox.classList.add("live");
}

// ---------- Social media links ----------
// Paste each full address between the quotes. Empty ones stay switched off until you add them.
const SOCIAL = { facebook: "", instagram: "", tiktok: "", youtube: "", x: "" };
document.querySelectorAll("[data-social]").forEach(el => {
  const url = SOCIAL[el.dataset.social];
  if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
  else { el.addEventListener("click", e => e.preventDefault()); el.title = "Coming soon"; el.classList.add("soon"); }
});

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Booking form ----------
// The "Send on WhatsApp" button is a normal link. We keep its address up to date
// while the person fills in the form, so one tap opens WhatsApp with everything typed.
const field = id => document.getElementById(id);
const value = id => field(id).value.trim();
const goBtn = field("f-go");
const formError = field("f-e");
const homeBox = field("homeFields");
field("f-d").min = new Date().toISOString().split("T")[0];

function isHomeVisit() { return field("f-w").value === "Home visit"; }

function bookingMessage() {
  let msg = "Hello Home Reach Care, I would like to book.\n" +
    "Name: " + value("f-n") + "\n" +
    "Treatment: " + value("f-s") + "\n" +
    "Where: " + value("f-w") + "\n" +
    "Date: " + (value("f-d") || "Flexible") + "\n" +
    "Time: " + (value("f-t") || "Flexible") + "\n";
  if (isHomeVisit()) msg += "Phone: " + value("f-p") + "\nLocation: " + value("f-l") + "\n";
  return msg + "Details: " + (value("f-m") || "-");
}

// What is still missing? Returns a friendly message, or "" when all is well.
function missingInfo() {
  if (!value("f-n")) return ["Please tell us your name so we know who to expect.", "f-n"];
  if (isHomeVisit()) {
    if (value("f-p").replace(/\D/g, "").length < 9) return ["Please add a phone number we can reach you on.", "f-p"];
    if (!value("f-l")) return ["Please tell us where to come, such as your area or a landmark.", "f-l"];
  }
  return null;
}

function refreshBooking() {
  homeBox.hidden = !isHomeVisit();
  goBtn.href = waLink(bookingMessage());
}
["f-n", "f-s", "f-w", "f-d", "f-t", "f-p", "f-l", "f-m"].forEach(id => {
  field(id).addEventListener("input", refreshBooking);
  field(id).addEventListener("change", refreshBooking);
});
goBtn.addEventListener("click", e => {
  const problem = missingInfo();
  if (problem) {
    e.preventDefault();
    formError.textContent = problem[0];
    field(problem[1]).focus();
  } else {
    formError.textContent = "";
  }
});
refreshBooking();

// ---------- English / Luganda switch ----------
// Please ask a Luganda speaker to check these words. Add more pairs as you like.
const LG = {
  "Call now":"Kubira kati","About":"Ebitukwatako","Services":"Obuweereza","Team":"Abakozi","FAQ":"Ebibuuzo","Book":"Teekawo","Contact":"Tuukirire",
  "Gentle care that gets you moving again":"Obujjanjabi obukwata ku mubiri okukuyamba okuddamu okutambula obulungi",
  "Chat on WhatsApp":"Tuwandiikire ku WhatsApp","Call 0766 791 805":"Kubira 0766 791 805",
  "Request a home visit":"Saba tukukyalire awaka","Send on WhatsApp":"Weereza ku WhatsApp","Ask for prices on WhatsApp":"Saba ebbeeyi ku WhatsApp",
  "Open every day, 8:00am – 9:00pm":"Tuggule buli lunaku, 8:00am – 9:00pm",
  "Are you living with any of these?":"Olina obuzibu buno?","Meet our team":"Labagana n’abakozi baffe",
  "Frequently asked questions":"Ebibuuzo ebibuuzibwa ennyo","Book an appointment":"Teekawo ekiseera","Find us in Katabi":"Tusange e Katabi",
  "Prices":"Ebbeeyi","Where all healing begins":"Gy’okuwonera gye kutandikira",
  "Your name":"Erinnya lyo","Treatment":"Obujjanjabi","Date":"Olunaku","Time":"Essaawa","Address":"Ekifo","Opening hours":"Essaawa z’emirimu"
};
const els = [...document.querySelectorAll("a,h1,h2,h3,p,span,b,button,small,label,figcaption")]
  .filter(e => !e.children.length && LG[e.textContent.trim()] && e.id !== "lang");
els.forEach(e => e.dataset.en = e.textContent.trim());
const langBtn = document.getElementById("lang");
function setLang(l) {
  els.forEach(e => e.textContent = l === "lg" ? LG[e.dataset.en] : e.dataset.en);
  document.documentElement.lang = l === "lg" ? "lg" : "en";
  langBtn.textContent = l === "lg" ? "English" : "Luganda";
  try { localStorage.setItem("hrc-lang", l); } catch (e) {}
}
langBtn.addEventListener("click", () => setLang(document.documentElement.lang === "lg" ? "en" : "lg"));
try { if (localStorage.getItem("hrc-lang") === "lg") setLang("lg"); } catch (e) {}
