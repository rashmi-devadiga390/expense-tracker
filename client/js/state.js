export let currentDate = new Date();

export const expenses = [];
export const filteredExpenses = [];

export let isFilterActive = false;

export function setCurrentDate(date) {
  currentDate = date;
}

export function setExpenses(data) {
  expenses.length = 0;        
  expenses.push(...data);    
}

export function setFilteredExpenses(data) {
  filteredExpenses.length = 0;
  filteredExpenses.push(...data);
}

export function setFilterActive(value) {
  isFilterActive = value;
}
