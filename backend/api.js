const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 8080;
const prisma = new PrismaClient();

app.use(express.json());

// Confirmamos que el servidor está corriendo
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Obtener todas las series
app.get('/api/series', async (req, res) => {
    try {
        const series = await prisma.series.findMany();
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las series' });
    }
});

//  Obtener una serie por ID
app.get('/api/series/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const serie = await prisma.series.findUnique({
            where: { id: Number(id) }
        });

        if (!serie) {
            return res.status(404).json({ error: 'Serie no encontrada' });
        }

        res.json(serie);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la serie' });
    }
});

// Crear una nueva serie
app.post('/api/series', async (req, res) => {
    const { name, status, episode, points } = req.body;

    try {
        const newSerie = await prisma.series.create({
            data: { name, status, episode, points }
        });

        res.status(201).json(newSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la serie' });
    }
});

// Actualizar una serie por ID
app.put('/api/series/:id', async (req, res) => {
    const { id } = req.params;
    const { name, status, episode, points } = req.body;

    try {
        const updatedSerie = await prisma.series.update({
            where: { id: Number(id) },
            data: { name, status, episode, points }
        });

        res.json(updatedSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la serie' });
    }
});

// Eliminar una serie por ID
app.delete('/api/series/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.series.delete({
            where: { id: Number(id) }
        });

        res.json({ message: 'Serie eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la serie' });
    }
});

// Actualizar el estado de una serie
app.patch('/api/series/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Esperamos que el cuerpo tenga el nuevo estado (booleano)

    if (typeof status !== 'boolean') {
        return res.status(400).json({ error: 'El estado debe ser un valor booleano' });
    }

    try {
        const updatedSerie = await prisma.series.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.json(updatedSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la serie' });
    }
});

// Incrementar el episodio actual
app.patch('/api/series/:id/episode', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedSerie = await prisma.series.update({
            where: { id: Number(id) },
            data: { episode: { increment: 1 } } // Incrementamos el episodio en 1
        });

        res.json(updatedSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al incrementar el episodio de la serie' });
    }
});

// Aumentar la puntuación de una serie
app.patch('/api/series/:id/upvote', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedSerie = await prisma.series.update({
            where: { id: Number(id) },
            data: { points: { increment: 1 } } // Aumentamos la puntuación en 1
        });

        res.json(updatedSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al aumentar la puntuación de la serie' });
    }
});

// Disminuir la puntuación de una serie
app.patch('/api/series/:id/downvote', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedSerie = await prisma.series.update({
            where: { id: Number(id) },
            data: { points: { decrement: 1 } } // Disminuimos la puntuación en 1
        });

        res.json(updatedSerie);
    } catch (error) {
        res.status(500).json({ error: 'Error al disminuir la puntuación de la serie' });
    }
});
