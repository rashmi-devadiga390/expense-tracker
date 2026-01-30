export function openForm() {
  document.getElementById("modal").style.display = "flex";
}


export function closeForm() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  const formInputs = modal.querySelectorAll("input, textarea, select");
  formInputs.forEach(el => {
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });

  document
    .querySelectorAll(".error")
    .forEach(e => (e.style.display = "none"));
}


document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modal");

  modal.addEventListener("click", e => {
    if (e.target === modal) closeForm();
  });

});

window.openForm = openForm;
window.closeForm = closeForm;
