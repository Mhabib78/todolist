document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');
  const showDeletedTasksBtn = document.getElementById('showDeletedTasksBtn');
  const deletedTaskList = document.getElementById('deletedTaskList');

  const database = firebase.database();

  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText) {
      const li = createTaskListItem(taskText);

      const newTaskRef = database.ref('tasks').push();
      newTaskRef.set({
        text: taskText,
        deleted: false
      });

      taskInput.value = '';
    }
  }

  function createTaskListItem(taskText, taskId) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button');

    span.textContent = taskText;
    deleteBtn.textContent = 'X';

    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', () => {
      database.ref('tasks/' + taskId).update({
        deleted: true
      });
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    return li;
  }

  function toggleDeletedTasksVisibility() {
    if (deletedTaskList.style.display === 'none') {
      deletedTaskList.style.display = 'block';
      showDeletedTasksBtn.textContent = 'Hide Deleted Tasks';
    } else {
      deletedTaskList.style.display = 'none';
      showDeletedTasksBtn.textContent = 'Show Deleted Tasks';
    }
  }

  database.ref('tasks').on('value', (snapshot) => {
    const tasks = snapshot.val();

    taskList.innerHTML = '';
    deletedTaskList.innerHTML = '';

    for (const taskId in tasks) {
      const task = tasks[taskId];

      if (!task.deleted) {
        taskList.appendChild(createTaskListItem(task.text, taskId));
      } else {
        deletedTaskList.appendChild(createTaskListItem(task.text, taskId));
      }
    }
  });

  addTaskBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  showDeletedTasksBtn.addEventListener('click', toggleDeletedTasksVisibility);
});
