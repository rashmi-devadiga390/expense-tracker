import {
  expenses,
  setFilteredExpenses,
  setFilterActive
} from "./state.js";

import { updateUI } from "./ui.js";

export function applyFilter() {
  const type = document.getElementById("filterType").value;
  let list = [...expenses];

  switch (type) {
    case "az":
      list.sort((a, b) => a.title.localeCompare(b.title));
      break;

    case "lowHigh":
      list.sort((a, b) => a.amount - b.amount);
      break;

    case "highLow":
      list.sort((a, b) => b.amount - a.amount);
      break;

    case "date": {
      const selected = document.getElementById("filterDate").value;
      if (!selected) return;

      list = expenses.filter(e => {
        const d = e.createdAt?.toDate
          ? e.createdAt.toDate()
          : new Date(e.createdAt);

        return d.toLocaleDateString("en-CA") === selected;
      });
      break;
    }

    case "category": {
      const cat = document.getElementById("filterCategory").value;
      if (!cat) return;

      list = expenses.filter(e => e.category === cat);
      break;
    }

    default:
      break;
  }
  setFilteredExpenses(list);
  setFilterActive(true);
  closeFilterModal();
  updateUI();  
}


function openFilterModal() {
  document.getElementById("filterModal").style.display = "flex";
}


function closeFilterModal() {
  document.getElementById("filterModal").style.display = "none";
}


function populateCategories() {
  const select = document.getElementById("filterCategory");

  select.innerHTML = `<option value="">Select category</option>`;

  [...new Set(expenses.map(e => e.category))]
    .sort()
    .forEach(cat => {

      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;

      select.appendChild(opt);
    });
}


document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("filterType")
    .addEventListener("change", e => {

      const type = e.target.value;

      document.getElementById("filterDate").style.display =
        type === "date" ? "block" : "none";

      document.getElementById("filterCategory").style.display =
        type === "category" ? "block" : "none";

      if (type === "category") populateCategories();
    });
});

window.openFilterModal = openFilterModal;
window.closeFilterModal = closeFilterModal;
window.applyFilter = applyFilter;
