import express from 'express'

const app = express()

const maintenances_list = []


app.post('/maintenance', (req, res) =>{
    res.send('OK,  deu bom')
})

// Vai fazer um request 
app.get('/maintenance', (req, res) =>{
    res.send('OK,  deu bom')
})

app.listen(3000)


/*
    - Criar uma janela de manutenção
    - Listar todas as Janelas de manutenções
    - Deletar Janela de manutenção
    - Aceitar Janela de manutenção
    - Editar Janela de manutenção.


*/