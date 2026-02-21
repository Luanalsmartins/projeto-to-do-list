let novatarefa = document.getElementById('novatarefa')
let tasks = []
let filtroAtual = 'todas'
let todastarefas = document.querySelector('ul')
let darkMode = false

function addTask() {
    if (novatarefa.value === '') {
        alert('Digite uma tarefa para ser adicionada!')
        novatarefa.value = ''
        novatarefa.focus()
        return
    } 

    tasks.push({
        id: Date.now(),
        text: novatarefa.value,
        completed: false
    })

    novatarefa.value = ''
    novatarefa.focus()
    renderTasks()
    saveTasks()
}
function renderTasks() {
    todastarefas.innerHTML = ''
    
    for (let i = 0; i < tasks.length; i++) {
        if (filtroAtual === 'pendentes' && tasks[i].completed) {
            continue
        }

        if (filtroAtual === 'concluidas' && !tasks[i].completed) {
            continue
        }

        let li = document.createElement('li')
        let check = document.createElement('input')
        let span = document.createElement('span')
        let button = document.createElement('button')

        span.textContent = tasks[i].text
        span.classList.add('pointer')

        // Editar tarefa com double click
        span.addEventListener('dblclick', function() {
            editarTask(tasks[i].id)
        })

        // Checkbox  
        check.type = 'checkbox'
        check.classList.add('pointer')
        check.checked = tasks[i].completed
        check.addEventListener('click', function() {
            toggleTask(tasks[i].id)
        })

        // Se concluída risca o texto
        if (tasks[i].completed) {
            li.classList.add('tarefa-concluida')
        }
 
        // Botão deletar
        button.textContent = 'delete'
        button.classList.add(
            'material-symbols-outlined', 
            'pointer', 
            'simbolo'
        )
        button.addEventListener('click', function() {
            deleteTask(tasks[i].id)
        })

        li.appendChild(check)
        li.appendChild(span)
        li.appendChild(button)
        todastarefas.appendChild(li)
    }
}
function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].completed = !tasks[i].completed
        }
    }

    renderTasks()
    saveTasks()
}
function deleteTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks.splice(i, 1)
            break
        }
    }

    renderTasks()
    saveTasks()
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}
function loadTasks() {
    let savedTasks = localStorage.getItem('tasks')
    let savedDarkMode = localStorage.getItem('darkMode')

    if (savedTasks) {
        tasks = JSON.parse(savedTasks)
        renderTasks()
    }
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark')
        darkMode = true
    }
}
function ativarBotao(botaoClicado) {
    let botoes = document.querySelectorAll('.btn')

    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove('ativo')
    }

    botaoClicado.classList.add('ativo')
}
function editarTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {

            let li = todastarefas.children[i]
            let span = li.querySelector('span')

            let input = document.createElement('input')
            input.type = 'text'
            input.value = tasks[i].text
            input.classList.add('editando')

            li.replaceChild(input, span)

            input.focus()

            // Salvar ao pressionar Enter
            input.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    salvarEdicao(input.value, i)
                }
            })

            // Salvar ao perder o foco
            input.addEventListener('blur', function() {
                salvarEdicao(input.value, i)
            })
        
            break
        }
        
    }
}
function salvarEdicao(novoTexto,index) {
    if (novoTexto.trim() !== '') {
        tasks[index].text = novoTexto.trim()
        saveTasks()
        renderTasks()
    } else {
        renderTasks()
    }
}

document.getElementById('novatarefa').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        addTask()
    }
})
document.querySelector('.todas').addEventListener('click', function() {
    filtroAtual = 'todas'
    ativarBotao(this)
    renderTasks()
})
document.querySelector('.pendentes').addEventListener('click', function() {
    filtroAtual = 'pendentes'
    ativarBotao(this)
    renderTasks()
})
document.querySelector('.concluidas').addEventListener('click', function() {
    filtroAtual = 'concluidas'
    ativarBotao(this)
    renderTasks()
})
document.getElementById('darkModeToggle').addEventListener('click', function() {
    darkMode = !darkMode
    document.body.classList.toggle('dark')

    localStorage.setItem('darkMode', darkMode)
})

loadTasks()