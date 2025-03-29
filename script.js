const apiUrl = "http://localhost:3000/tasks";

document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
    
        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}" data-id="${task.id}" data-completed="${task.completed}">
                ${task.title}
            </span>
            <button class="completed-btn" onclick="toggleTask(${task.id})">✓</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
        `;
    
        // Agregar evento de click para marcar como completada
        li.querySelector("span").addEventListener("click", function () {
            toggleTask(this.dataset.id, this.dataset.completed === "true");
        });
    
        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById("taskInput");
    if (taskInput.value.trim() === "") return;

    await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: taskInput.value, completed: false })
    });

    taskInput.value = "";
    loadTasks();
}

async function toggleTask(id, completed) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !completed }) 
        });

        if (!response.ok) throw new Error("Error al actualizar la tarea");

        fetchTasks(); 
    } catch (error) {
        console.error("Error:", error);
    }
    loadTasks();
}


async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    loadTasks();
}
