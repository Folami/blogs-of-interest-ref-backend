const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

let blogs = [
    {
    title: "Multimodal Neurons in Artificial Neural Networks",
    author: "Gabriel Goh et al.",
    url: "https://distill.pub/2021/multimodal-neurons/",
    likes: 0
    },
    {
    title: "Calculus for Machine Learning (7-day mini-course)",
    author: "Adrain Tam",
    url: "https://machinelearningmastery.com/calculus-for-machine-learning-7-day-mini-course/",
    likes: 0
    },
    {
    title: "Machine Learning is Fun!: The world’s easiest introduction to Machine Learning",
    author: "Adam Geitey",
    url: "https://medium.com/@ageitgey/machine-learning-is-fun-80ea3ec3c471",
    likes: 0
    },
    {
    title: "Algorithms & Data Structures Series: Inspired by Algorithms, Part I course from Princeton University & Algorithms, 4th Edition.",
    author: "Omar Elgabry",
    url: "https://medium.com/omarelgabrys-blog/algorithms-data-structures-series-85ec94eb8aff",
    likes: 0
    }
]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
      
app.get('/api/blogs', (request, response) => {
    response.json(blogs)
})

app.get('/api/blogs/:id', (request, response) => {
    const id = Number(request.params.id)
    const blog = blogs.find(blog => blog.id === id)
    
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
})

app.post('/api/blogs', (request, response) => {
    const blog = request.body
    console.log(blog)
    response.json(blog)
})

const generateId = () => {
    const maxId = blogs.length > 0
      ? Math.max(...blogs.map(n => n.id))
      : 0
    return maxId + 1
}

app.post('/api/blogs', (request, response) => {
    const body = request.body
  
    if (!body.title || !body.url) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      id: generateId(),
    }
    blogs = blogs.concat(blog)
    response.json(blog)
})

app.delete('/api/blogs/:id', (request, response) => {
    const id = Number(request.params.id)
    blogs = blogs.filter(blog => blog.id !== id)
  
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
      
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) 
})
      