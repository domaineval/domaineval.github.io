const table_pass_1 = document.getElementById("pass_1");
const table_pass_5 = document.getElementById("pass_5");

async function displayData(data) {
  const models = await fetch("models.json").then((resp) => resp.json());
  const flattened = flatten(data);

  function display(el, cols, sort_key) {
    flattened.sort((a, b) => b[sort_key] - a[sort_key]);

    const tbody = el.querySelector("tbody");
    tbody.innerHTML = "";
    for (const [index, row] of flattened.entries()) {
      const tr = document.createElement("tr");
      const tdIndex = document.createElement("td");
      tdIndex.textContent = index + 1;
      tr.appendChild(tdIndex);

      for (const col of ["model", ...cols]) {
        const td = document.createElement("td");
        if (col === "model") {
          const anchor = document.createElement("a");
          anchor.href = models.find((m) => m.model === row.model).link;
          anchor.innerHTML = row.model;
          td.appendChild(anchor);
        } else {
          td.innerHTML = row[col];
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  }

  display(
    table_pass_1,
    ["pass_1"],
    "pass_1"
  );
  display(
    table_pass_5,
    ["pass_5"],
    "pass_5"
  );
}

buttons.forEach(({ id, file}) => {
  document.getElementById(id).addEventListener("click", () => {
    fetch(file)
      .then((resp) => resp.json())
      .then((data) => {
        displayData(data);
      });
  });
});

fetch("data/data_computation.json")
  .then((resp) => resp.json())
  .then((data) => {
    displayData(data);
  });