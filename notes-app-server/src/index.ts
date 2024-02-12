import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// @dev Search functionality
// @dev add to end of path /?q=query
app.get("/api/iocs/search", async (req, res) => {
  const { q } = req.query; //@dev ?q=hello

  if (!q) {
    return res.status(400).send("Query parameter required");
  }

  try {
    const iocs = await prisma.ioc.findMany({
      where: {
        OR: [
          {
            url: {
              contains: q.toString(),
            },
          },
          {
            comments: {
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
  const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments } = req.body;

  if (!url || !report_method_one) {
    return res.status(400).send("Url and Method 1 fields are required");
  }

  try {
    const ioc = await prisma.ioc.create({
      data: { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments},
    });
    res.json(ioc);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.get("/api/iocs/:id", async (req, res) => {
  const ioc_id = parseInt(req.params.id);
  try {
    const ioc = await prisma.ioc.findUnique({
      where: {
        id: ioc_id,
      }
    });
    res.json(ioc);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});


app.put("/api/iocs/:id", async (req, res) => {
  const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments } = req.body;
  const id = parseInt(req.params.id);
  if (!url || !report_method_one) {
    return res.status(400).send("Url and Method 1 fields are required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedIoc = await prisma.ioc.update({
      where: { id },
      data: { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments},
    });
    res.json(updatedIoc);
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
    await prisma.ioc.delete({
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
