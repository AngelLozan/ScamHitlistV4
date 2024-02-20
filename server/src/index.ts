import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
// import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import AWS from 'aws-sdk'
const multer  = require('multer');
const upload = multer({});

// import fs from 'fs';
// import formidable, { Fields, Files } from 'formidable';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

// const client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//   },
// });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();


// @dev Search functionality
// @dev add to end of path /?q=query
app.get("/api/iocs/search", async (req, res) => {
  const { q , path } = req.query; //@dev ?q=hello path=/reported

  console.log(q);
  console.log(path);

  if (!q) {
    return res.status(400).send("Query parameter required");
  }

  if (path) {
    console.log("From: ", path);
    try {
      const iocs = await prisma.ioc.findMany({
        where: {
          status: 'reported',
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

      return res.json(iocs);
    } catch (error) {
      console.log("Error in reported search: ", error );
    }
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
        lte: new Date(currentDate.setUTCDate(currentDate.getUTCDate() - 13)),
      },
      NOT: {
        OR: [
          { status: { equals: "resolved" } },
          { status: { equals: "official_url" } },
          { status: { equals: "added" } },
        ],
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

// @dev 2B Reported
app.get("/api/iocs/2b_reported", async (req, res) => {
  const iocs = await prisma.ioc.findMany({
    where: {
      status: {
        equals: "added",
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

// @dev Create ioc
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
    image_url
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
        image_url
      },
    });
    res.json(ioc);
  } catch (error) {
    res.status(500).send(`👀 Oops, something went wrong: ${error}`);
  }
});

// @dev Create form
app.post("/api/forms", async (req, res) => {
  const {
    url,
    name,
  } = req.body;

  if (!name) {
    return res.status(400).send("👀 Name field is required");
  }

  const existingForm = await prisma.form.findFirst({
    where: {
      OR: [
        {
          url: {
            contains: url,
          },
        },
        {
          name: {
            contains: name,
          },
        },
      ],
    },
  });

  if(existingForm !== null){
    return res.status(400).send("👀 That form may be on the list, check again.");
  }

  try {
    const form = await prisma.form.create({
      data: {
        url,
        name,
      },
    });
    res.json(form);
  } catch (error) {
    res.status(500).send(`👀 Oops, something went wrong: ${error}`);
  }
});

// @dev Delete form
app.delete("/api/forms/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.form.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

// @dev Create host
app.post("/api/hosts", async (req, res) => {
  const {
    email,
    name,
  } = req.body;

  if (!name) {
    return res.status(400).send("👀 Name field is required");
  }

  try {
    const host = await prisma.host.create({
      data: {
        email,
        name,
      },
    });
    res.json(host);
  } catch (error) {
    res.status(500).send(`👀 Oops, something went wrong: ${error}`);
  }
});

// @dev Delete host
app.delete("/api/hosts/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.host.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
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
    if (!ioc ) {
      res.status(400).send("That does not exist");
    }

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

app.post("/api/upload_file", upload.single('evidence'), async (req, res) => {
    // const { key, file } = req.body
    const key = req.body.key;
    const file = req.file;

    console.log(req.body);

    console.log("FILE: ", file)
    console.log("KEY: ", key);

    const encodedFileName = encodeURIComponent(key);
    const bucketName = process.env.BUCKET;
    const fileName = key;

    if (!bucketName) {
      return res.status(500).send("Bucket name not specified in environment variables.");
    }

    const params = {
      Bucket: bucketName,
      Key: "evidence", //fileName, //key,
      Body: file?.buffer,
    };

    // const input = {
    //   Bucket: process.env.BUCKET,
    //   Key: key,
    //   Body: fs.readFileSync(file), // Access the file content from the uploaded file's path
    // };

    // const command = new PutObjectCommand(input);

    try {
      // const response = await client.send(command);
      const response = s3.putObject(params).promise();
      console.log(response);
      // @dev the string is always this, need to fix: https://scam-hitlist.s3.eu-north-1.amazonaws.com/evidence
      res.status(201).send(`https://${process.env.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedFileName}`);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something failed in file upload, please try again.")
    }
  });


app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
