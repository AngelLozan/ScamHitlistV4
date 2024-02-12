import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(cors());

// @dev Search functionality

app.get("/api/iocs/search", async (req, res) => {
  const { q } = req.query; //@dev ?q=hello

  if (!q) {
    return res.status(400).send("Query parameter required");
  }

  try {
    const iocs = await prisma.note.findMany({
      where: {
        OR: [
          {
            title: {
              contains: q.toString(),
            },
          },
          {
            content: {
              contains: q.toString(),
            },
          },
        ],
      },
    });

    res.json(iocs);

  } catch (error) {
    console.log(error);
  }

});

app.get("/api/", async (req, res) => {
  res.json({ message: "success!" });
});

app.get("/api/iocs", async (req, res) => {
  const iocs = await prisma.ioc.findMany();
  res.json(iocs);
});

app.post("/api/iocs", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});


app.put("/api/iocs/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});


app.delete("/api/iocs/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
