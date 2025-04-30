function selectGoal(element) {
  document.querySelectorAll('.goal-item').forEach(item => item.classList.remove('selected'));
  element.classList.add('selected');
}

function toggleGoal(event, icon) {
  event.stopPropagation();
  const parent = icon.closest('.goal-item');
  parent.classList.toggle('selected');
  icon.innerText = parent.classList.contains('selected') ? 'remove' : 'check';
}

function deleteGoal(event, icon) {
  event.stopPropagation();

  if (confirm("Deseja excluir esta meta?")) {
    const goalItem = icon.closest('.goal-item');
    const goalId = goalItem.getAttribute('data-id'); // pega o ID da meta

    // Chamada ao backend para deletar do banco de dados
    fetch(`http://localhost:3030/deleteGoal/${goalId}`, {
      method: 'DELETE'
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao excluir meta do banco de dados');
      // Remove visualmente
      goalItem.remove();
    })
    .catch(error => {
      console.error('Erro ao excluir meta:', error);
      alert('Erro ao excluir meta do banco de dados');
    });
  }
}

function toggleDay(button) {
  button.classList.toggle('selected');
}

function selectTurn(button) {
  document.querySelectorAll('#turns button').forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

function openEditPopup() {
  document.getElementById('editPopup').style.display = 'flex';
  document.getElementById('editInfo1').value = document.getElementById('info1').innerText;
  document.getElementById('editInfo2').value = document.getElementById('info2').innerText;
  document.getElementById('editInfo3').value = document.getElementById('info3').innerText;
}

function closeEditPopup() {
  document.getElementById('editPopup').style.display = 'none';
}

function saveEdit() {
  document.getElementById('info1').innerText = document.getElementById('editInfo1').value;
  document.getElementById('info2').innerText = document.getElementById('editInfo2').value;
  document.getElementById('info3').innerText = document.getElementById('editInfo3').value;
  closeEditPopup();
}

function clearInfo() {
  if (confirm("Deseja limpar as informações desta meta?")) {
    document.getElementById('info1').innerText = '';
    document.getElementById('info2').innerText = '';
    document.getElementById('info3').innerText = '';
  }
}

function openAddGoalPopup() {
  document.getElementById('addGoalPopup').style.display = 'flex';
}

function closeAddGoalPopup() {
  document.getElementById('addGoalPopup').style.display = 'none';
}



function addNewGoal() {
  const goalName = document.getElementById('newGoalName').value.trim();

  if (goalName !== '') {
    fetch('http://localhost:3030/novaMeta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ novaMeta: goalName })
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao adicionar meta');
      return res.json();
    })
    .then(data => {
      const newGoal = document.createElement('div');
      newGoal.className = 'goal-item';
      newGoal.setAttribute('data-id', data.id); // adiciona o ID da meta
      newGoal.innerHTML = `
        <span class="goal-name">${data.novaMeta}</span>
        <div class="goal-actions">
          <span class="material-symbols-outlined" onclick="toggleGoal(event, this)">check</span>
          <span class="material-icons-outlined trash" onclick="deleteGoal(event, this)">delete_outline</span>
        </div>
      `;
      newGoal.onclick = function () {
        selectGoal(newGoal);
      };
      document.getElementById('goalList').appendChild(newGoal);
      document.getElementById('newGoalName').value = '';
      closeAddGoalPopup();
    })
    .catch(error => {
      console.error('Erro ao adicionar meta:', error);
      alert('Erro ao adicionar meta');
    });
  }
}

function carregarMetas() {
  fetch('http://localhost:3030/metas')
    .then(res => {
      if (!res.ok) throw new Error('Erro ao carregar metas');
      return res.json();
    })
    .then(metas => {
      const goalList = document.getElementById('goalList');
      metas.forEach(meta => {
        const goal = document.createElement('div');
        goal.className = 'goal-item';
        goal.setAttribute('data-id', meta.id); // adiciona o ID da meta
        goal.innerHTML = `
          <span class="goal-name">${meta.novaMeta}</span>
          <div class="goal-actions">
            <span class="material-symbols-outlined" onclick="toggleGoal(event, this)">check</span>
            <span class="material-icons-outlined trash" onclick="deleteGoal(event, this)">delete_outline</span>
          </div>
        `;
        goal.onclick = function () {
          selectGoal(goal);
        };
        goalList.appendChild(goal);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar metas:', error);
      alert('Erro ao carregar metas');
    });
}

// Chama ao abrir a página
carregarMetas();