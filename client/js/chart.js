import { db } from "../firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { currentDate } from "./state.js";

let chartInstance = null;

export function openChartModal() {
  document.getElementById("chartModal").style.display = "flex";
  showMonthChart();
}


export function closeChartModal() {
  document.getElementById("chartModal").style.display = "none";
}


export async function showMonthChart() {
  const year = currentDate.getFullYear();

  const monthlyTotals = new Array(12).fill(0);

  for (let m = 1; m <= 12; m++) {

    const snapshot = await getDocs(
      collection(db, "expenses", `${year}`, `${m}`)
    );

    snapshot.forEach(doc => {
      const e = doc.data();
      monthlyTotals[m - 1] += Number(e.amount);
    });
  }

  const labels = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  renderChart(labels, monthlyTotals, `${year} Monthly Comparison`);
}


export async function showYearChart() {
  const currentYear = currentDate.getFullYear();

  const labels = [];
  const totals = [];

  for (let y = currentYear - 4; y <= currentYear; y++) {

    let yearTotal = 0;

    for (let m = 1; m <= 12; m++) {

      const snapshot = await getDocs(
        collection(db, "expenses", `${y}`, `${m}`)
      );

      snapshot.forEach(doc => {
        yearTotal += Number(doc.data().amount);
      });
    }

    labels.push(`${y}`);
    totals.push(yearTotal);
  }
  renderChart(labels, totals, "Yearly Expense Comparison");
}


function renderChart(labels, data, title) {
  const ctx = document.getElementById("expenseChart").getContext("2d");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: "#7a72ff",
        borderWidth: 1
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false, 

      plugins: {
        legend: {
          display: true,
          position: "top"
        },
        title: {
          display: true,
          text: title
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

window.openChartModal = openChartModal;
window.closeChartModal = closeChartModal;
window.showMonthChart = showMonthChart;
window.showYearChart = showYearChart;
