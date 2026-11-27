// The router: hash routes for the list and for one deal, with the list's
// filters kept in the page state. window.__shotReady is false while a page
// renders and true once it is on screen, so a screenshot script knows when
// to capture.
//
//   #/                 the list, with search and filters
//   #/deal/<id>        one deal, with its verdict and evidence

import { deals } from "./deals.js";
import { listPage, detailPage, missingPage } from "./render.js";

const app = document.getElementById("app");

const state = { query: "", category: "", store: "", minDiscount: 0, sort: "best" };

// A filtered view is a real address, so it can be shared and screenshotted:
// #/?category=TVs, #/?store=Amazon&minDiscount=50, #/?q=lego&sort=discount.
let lastHash = "";
function readHashQuery() {
  // Apply the hash's query only when the address itself changed: typing in
  // the search box re-renders without touching the hash, and must not wipe
  // what was typed.
  if (location.hash === lastHash) return;
  lastHash = location.hash;
  const qIndex = location.hash.indexOf("?");
  if (qIndex === -1) {
    state.query = "";
    state.category = "";
    state.store = "";
    state.minDiscount = 0;
    state.sort = "best";
    return;
  }
  const params = new URLSearchParams(location.hash.slice(qIndex + 1));
  state.query = params.get("q") ?? "";
  state.category = params.get("category") ?? "";
  state.store = params.get("store") ?? "";
  state.minDiscount = Number(params.get("minDiscount") ?? 0) || 0;
  state.sort = params.get("sort") ?? "best";
}

function render() {
  window.__shotReady = false;
  readHashQuery();
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | FridayAudit`;
    app.innerHTML = found ? detailPage(found) : missingPage();
  } else {
    document.title = "FridayAudit — Black Friday Deal Finder";
    app.innerHTML = listPage(state);
    const q = app.querySelector("#q");
    const rerender = () => {
      state.query = q.value;
      state.category = app.querySelector("#category").value;
      state.store = app.querySelector("#store").value;
      state.minDiscount = Number(app.querySelector("#minDiscount").value);
      state.sort = app.querySelector("#sort").value;
      render();
      const next = app.querySelector("#q");
      if (next) {
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      }
    };
    q.addEventListener("input", rerender);
    for (const id of ["category", "store", "minDiscount", "sort"]) {
      app.querySelector(`#${id}`).addEventListener("change", rerender);
    }
    for (const chip of app.querySelectorAll(".chip")) {
      chip.addEventListener("click", () => {
        state.category = state.category === chip.dataset.category ? "" : chip.dataset.category;
        render();
      });
    }
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
