import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// function isDateOlderThanTwoWeeks(dateToCheck: Date) {
//   const currentDate = new Date();
//   const twoWeeksAgo = new Date(currentDate.getTime() - (14 * 24 * 60 * 60 * 1000));
//   const date = new Date(dateToCheck);
//   return date < twoWeeksAgo;
// }

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

// @dev Test api
app.get("/api/", async (req, res) => {
  res.json({ message: "success!" });
});

// @dev All iocs
app.get("/api/iocs", async (req, res) => {
  const iocs = await prisma.ioc.findMany();
  res.json(iocs);
});

// @dev Reported iocs
app.get("/api/iocs/reported", async (req, res) => {
  const iocs = await prisma.ioc.findMany({
    where: {
      status: {
        equals: "reported",
      },
    },
  });
  res.json(iocs);
});

// @dev Follow up iocs
app.get("/api/iocs/follow_up", async (req, res) => {
  //@dev Where follow up date is lte (less than or equal to) the date two weeks ago
  const currentDate = new Date();
  const iocs = await prisma.ioc.findMany({
    where: {
      follow_up_date: {
        lte: new Date(currentDate.setUTCDate(currentDate.getUTCDate() - 13)) ,
      },
    },
  });
  res.json(iocs);
});

// @dev Watchlist iocs
app.get("/api/iocs/watchlist", async (req, res) => {
  const iocs = await prisma.ioc.findMany({
    where: {
      status: {
        equals: "watchlist",
      },
    },
  });
  res.json(iocs);
});

// @dev Official urls
app.get("/api/iocs/official_urls", async (req, res) => {
  const iocs = await prisma.ioc.findMany({
    where: {
      status: {
        equals: "official_url",
      },
    },
  });
  res.json(iocs);
});

app.get("/api/forms", async (req, res) => {
  const forms = await prisma.form.findMany();
  res.json(forms);
});

app.get("/api/hosts", async (req, res) => {
  const hosts = await prisma.host.findMany();
  res.json(hosts);
});

// @dev Create
app.post("/api/iocs", async (req, res) => {
  const {
    url,
    removed_date,
    status,
    report_method_one,
    report_method_two,
    form,
    host,
    follow_up_date,
    follow_up_count,
    comments,
  } = req.body;

  if (!url || !report_method_one) {
    return res.status(400).send("👀 Url and Method 1 fields are required");
  }

  try {
    const ioc = await prisma.ioc.create({
      data: {
        url,
        removed_date,
        status,
        report_method_one,
        report_method_two,
        form,
        host,
        follow_up_date,
        follow_up_count,
        comments,
      },
    });
    res.json(ioc);
  } catch (error) {
    res.status(500).send(`👀 Oops, something went wrong: ${error}`);
  }
});

// @dev Show
app.get("/api/iocs/:id", async (req, res) => {
  const ioc_id = parseInt(req.params.id);
  try {
    const ioc = await prisma.ioc.findUnique({
      where: {
        id: ioc_id,
      },
    });
    res.json(ioc);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

// @dev Update
app.put("/api/iocs/:id", async (req, res) => {
  const {
    url,
    removed_date,
    status,
    report_method_one,
    report_method_two,
    form,
    host,
    follow_up_date,
    follow_up_count,
    comments,
  } = req.body;
  const id = parseInt(req.params.id);
  if (!url || !report_method_one) {
    return res.status(400).send("👀 Url and Method 1 fields are required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("👀 ID must be a valid number");
  }

  try {
    const updatedIoc = await prisma.ioc.update({
      where: { id },
      data: {
        url,
        removed_date,
        status,
        report_method_one,
        report_method_two,
        form,
        host,
        follow_up_date,
        follow_up_count,
        comments,
      },
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
