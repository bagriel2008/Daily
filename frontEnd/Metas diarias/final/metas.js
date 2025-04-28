function selectGoal(element) {
    document.querySelectorAll('.goal-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
  }
  
  function toggleGoal(event, icon) {
    event.stopPropagation();
    const parent = icon.closest('.goal-item');
    parent.classList.toggle('selected');
    icon.innerText = parent.classList.contains('selected') ? 'remove' : 'add';
  }
  
  function deleteGoal(event, icon) {
    event.stopPropagation();
    if (confirm("Deseja excluir esta meta?")) {
      icon.closest('.goal-item').remove();
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
      const newGoal = document.createElement('div');
      newGoal.className = 'goal-item';
      newGoal.innerHTML = `
        <span class="goal-name">${goalName}</span>
        <div class="goal-actions">
          <span class="material-icons-outlined" onclick="toggleGoal(event, this)">add</span>
          <span class="material-icons-outlined trash" onclick="deleteGoal(event, this)">delete_outline</span>
        </div>
      `;
      newGoal.onclick = function() { selectGoal(this); };
      document.getElementById('goalList').appendChild(newGoal);
      document.getElementById('newGoalName').value = '';
      closeAddGoalPopup();
    }
  }
  