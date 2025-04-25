const calendario = document.getElementById('calendarioDias');

// Define as cores para cada dia (70 no total, ou quantos quiser)
const cores = [
    ...Array(170).fill('#E3B5E5')
];

cores.forEach(cor => {
    const div = document.createElement('div');
    div.classList.add('dia');
    div.style.backgroundColor = cor;
    calendario.appendChild(div);
});