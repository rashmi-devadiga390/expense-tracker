import {
  currentDate,
  setCurrentDate,
  setFilterActive,
  setFilteredExpenses
} from "./state.js";

import { loadExpenses } from "./expenses.js";


export function updateMonthUI() {
  const options = { month: "long", year: "numeric" };

  document.getElementById("currentMonth").textContent =
    currentDate.toLocaleDateString("en-US", options);
}


export function changeMonth(direction) {
  const nextDate = new Date(currentDate);
  nextDate.setMonth(nextDate.getMonth() + direction);

  const today = new Date();

  if (
    nextDate.getFullYear() > today.getFullYear() ||
    (nextDate.getFullYear() === today.getFullYear() &&
      nextDate.getMonth() > today.getMonth())
  ) return;

  setCurrentDate(nextDate);

  setFilterActive(false);
  setFilteredExpenses([]);

  updateMonthUI();
  loadExpenses();

  const modal = document.getElementById("chartModal");
  if (modal) modal.style.display = "none";
}

window.changeMonth = changeMonth;
