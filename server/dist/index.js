"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer = require('multer');
const upload = multer({});
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});
const s3 = new aws_sdk_1.default.S3();
app.get("/api/iocs/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q, path } = req.query;
    console.log(q);
    console.log(path);
    if (!q) {
        return res.status(400).send("Query parameter required");
    }
    if (path) {
        console.log("From: ", path);
        try {
            const iocs = yield prisma.ioc.findMany({
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
        }
        catch (error) {
            console.log("Error in reported search: ", error);
        }
    }
    try {
        const iocs = yield prisma.ioc.findMany({
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
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/api/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: "success!" });
}));
app.get("/api/iocs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iocs = yield prisma.ioc.findMany();
    res.json(iocs);
}));
app.get("/api/iocs/reported", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iocs = yield prisma.ioc.findMany({
        where: {
            status: {
                equals: "reported",
            },
        },
    });
    res.json(iocs);
}));
app.get("/api/iocs/follow_up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = new Date();
    const iocs = yield prisma.ioc.findMany({
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
}));
app.get("/api/iocs/watchlist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iocs = yield prisma.ioc.findMany({
        where: {
            status: {
                equals: "watchlist",
            },
        },
    });
    res.json(iocs);
}));
app.get("/api/iocs/official_urls", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iocs = yield prisma.ioc.findMany({
        where: {
            status: {
                equals: "official_url",
            },
        },
    });
    res.json(iocs);
}));
app.get("/api/iocs/2b_reported", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const iocs = yield prisma.ioc.findMany({
        where: {
            status: {
                equals: "added",
            },
        },
    });
    res.json(iocs);
}));
app.get("/api/forms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const forms = yield prisma.form.findMany();
    res.json(forms);
}));
app.get("/api/hosts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hosts = yield prisma.host.findMany();
    res.json(hosts);
}));
app.post("/api/iocs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments, image_url } = req.body;
    if (!url || !report_method_one) {
        return res.status(400).send("👀 Url and Method 1 fields are required");
    }
    try {
        const ioc = yield prisma.ioc.create({
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
    }
    catch (error) {
        res.status(500).send(`👀 Oops, something went wrong: ${error}`);
    }
}));
app.post("/api/forms", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, name, } = req.body;
    if (!name) {
        return res.status(400).send("👀 Name field is required");
    }
    const existingForm = yield prisma.form.findFirst({
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
    if (existingForm !== null) {
        return res.status(400).send("👀 That form may be on the list, check again.");
    }
    try {
        const form = yield prisma.form.create({
            data: {
                url,
                name,
            },
        });
        res.json(form);
    }
    catch (error) {
        res.status(500).send(`👀 Oops, something went wrong: ${error}`);
    }
}));
app.delete("/api/forms/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).send("ID field required");
    }
    try {
        yield prisma.form.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.post("/api/hosts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, } = req.body;
    if (!name) {
        return res.status(400).send("👀 Name field is required");
    }
    try {
        const host = yield prisma.host.create({
            data: {
                email,
                name,
            },
        });
        res.json(host);
    }
    catch (error) {
        res.status(500).send(`👀 Oops, something went wrong: ${error}`);
    }
}));
app.delete("/api/hosts/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).send("ID field required");
    }
    try {
        yield prisma.host.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.get("/api/iocs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ioc_id = parseInt(req.params.id);
    try {
        const ioc = yield prisma.ioc.findUnique({
            where: {
                id: ioc_id,
            },
        });
        if (!ioc) {
            res.status(400).send("That does not exist");
        }
        res.json(ioc);
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.put("/api/iocs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments, } = req.body;
    const id = parseInt(req.params.id);
    if (!url || !report_method_one) {
        return res.status(400).send("👀 Url and Method 1 fields are required");
    }
    if (!id || isNaN(id)) {
        return res.status(400).send("👀 ID must be a valid number");
    }
    try {
        const updatedIoc = yield prisma.ioc.update({
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
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.delete("/api/iocs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id)) {
        return res.status(400).send("ID field required");
    }
    try {
        yield prisma.ioc.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.post("/api/upload_file", upload.single('evidence'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const key = req.body.key;
    const file = req.file;
    console.log(req.body);
    console.log("FILE: ", file);
    console.log("KEY: ", key);
    const encodedFileName = encodeURIComponent(key);
    const bucketName = process.env.BUCKET;
    const fileName = key;
    if (!bucketName) {
        return res.status(500).send("Bucket name not specified in environment variables.");
    }
    const params = {
        Bucket: bucketName,
        Key: "evidence",
        Body: file === null || file === void 0 ? void 0 : file.buffer,
    };
    try {
        const response = s3.putObject(params).promise();
        console.log(response);
        res.status(201).send(`https://${process.env.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedFileName}`);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Something failed in file upload, please try again.");
    }
}));
app.listen(5000, () => {
    console.log("server running on localhost:5000");
});
//# sourceMappingURL=index.js.map