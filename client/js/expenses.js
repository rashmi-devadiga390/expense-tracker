import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  currentDate,
  expenses,
  setExpenses
} from "./state.js";

import { updateUI } from "./ui.js";


export async function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amountInput = document.getElementById("amount").value;
  const amount = Number(amountInput);
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  document.getElementById("titleError").style.display = "none";
  document.getElementById("amountError").style.display = "none";
  document.getElementById("categoryError").style.display = "none";

  let hasError = false;

  if (!title) {
    const el = document.getElementById("titleError");
    el.textContent = "Please enter a title*";
    el.style.display = "block";
    hasError = true;
  }

  if (!amountInput) {
    const el = document.getElementById("amountError");
    el.textContent = "Please enter amount*";
    el.style.display = "block";
    hasError = true;
  } else if (isNaN(amount) || amount <= 0) {
    const el = document.getElementById("amountError");
    el.textContent = "Please enter a valid amount*";
    el.style.display = "block";
    hasError = true;
  }

  if (!category) {
    const el = document.getElementById("categoryError");
    el.textContent = "Please select a category*";
    el.style.display = "block";
    hasError = true;
  }

  if (hasError) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  await addDoc(
    collection(db, "expenses", `${year}`, `${month}`),
    {
      title,
      amount,
      category,
      description,
      createdAt: new Date()
    }
  );

  document.getElementById("modal").style.display = "none";
  loadExpenses();
}


export async function loadExpenses() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const list = [];

  const q = query(collection(db, "expenses", `${year}`, `${month}`));
  const snapshot = await getDocs(q);

  snapshot.forEach(d => {
    list.push({ id: d.id, ...d.data() });
  });

  setExpenses(list);
  updateUI();
}

let selectedExpenseId = null;


function openDeleteModal(id) {
  selectedExpenseId = id;
  document.getElementById("deleteModal").style.display = "flex";
}


function closeDeleteModal() {
  selectedExpenseId = null;
  document.getElementById("deleteModal").style.display = "none";
}


export async function confirmDelete() {
  if (!selectedExpenseId) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  await deleteDoc(
    doc(db, "expenses", `${year}`, `${month}`, selectedExpenseId)
  );

  closeDeleteModal();
  loadExpenses();
}

window.addExpense = addExpense;
window.openDeleteModal = openDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
