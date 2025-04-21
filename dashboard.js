let creditsSpent = 200;
let creditsEarned = 300;
let transactions = [
    { date: "21-03-2025", type: "Expense", description: "Needed Help", amount: 200, category: "Gardening" },
    { date: "22-03-2025", type: "Income", description: "Offered Help", amount: 300, category: "Shopping" },
];

function buyItem(description, price) {
    if (creditsEarned - creditsSpent >= price) {
        creditsSpent += price;
        const date = new Date().toLocaleDateString("en-GB");
        transactions.push({ date, type: "Expense", description, amount: price, category: "Shopping" });
        alert("Purchase successful!");
        updateDashboard();
    } else {
        alert("Not enough credits!");
    }
}

function updateDashboard() {
    // Update credits spent
    document.querySelector(".payment--card .value").textContent = `${creditsSpent} Credits`;

    // Update transaction table
    const tableBody = document.querySelector(".tabular--wrapper tbody");
    tableBody.innerHTML = transactions
        .map(
            (t) =>
                `<tr>
                    <td>${t.date}</td>
                    <td>${t.type}</td>
                    <td>${t.description}</td>
                    <td>${t.amount} Credits</td>
                    <td>${t.category}</td>
                </tr>`
        )
        .join("");
}
