console.log("MAIN JS LOADED");

import "./modal.js";
import "./filter.js";
import "./ui.js";

import { updateMonthUI } from "./month.js";
import { loadExpenses } from "./expenses.js";

document.addEventListener("DOMContentLoaded", () => {
  updateMonthUI();
  loadExpenses();
});
