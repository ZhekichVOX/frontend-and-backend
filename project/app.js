const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware для JSON
app.use(express.json());

// 🔥 Раздача статических файлов (твоя практика №1)
app.use(express.static(__dirname));

// Тестовые товары
let products = [
    {
        id: 1,
        title: 'Смартфон X',
        description: 'Мощный смартфон с отличной камерой',
        price: 45000,
        image: 'https://via.placeholder.com/300x200'
    },
    {
        id: 2,
        title: 'Ноутбук Pro',
        description: 'Производительный ноутбук для работы',
        price: 85000,
        image: 'https://via.placeholder.com/300x200'
    }
];

// Главная страница теперь открывает index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 🔹 Получить все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// 🔹 Получить товар по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json(product);
});

// 🔹 Создать товар
app.post('/products', (req, res) => {
    const { title, description, price, image } = req.body;

    if (!title || !price) {
        return res.status(400).json({ message: 'Название и цена обязательны' });
    }

    const newProduct = {
        id: Date.now(),
        title,
        description,
        price,
        image
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 🔹 Обновить товар
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    const { title, description, price, image } = req.body;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image;

    res.json(product);
});

// 🔹 Удалить товар
app.delete('/products/:id', (req, res) => {
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.id);

    if (products.length === initialLength) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    res.json({ message: 'Товар удалён' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
