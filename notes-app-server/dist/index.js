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
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/api/iocs/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    if (!q) {
        return res.status(400).send("Query parameter required");
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
app.post("/api/iocs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments } = req.body;
    if (!url || !report_method_one) {
        return res.status(400).send("Url and Method 1 fields are required");
    }
    try {
        const ioc = yield prisma.ioc.create({
            data: { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments },
        });
        res.json(ioc);
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
            }
        });
        res.json(ioc);
    }
    catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
}));
app.put("/api/iocs/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments } = req.body;
    const id = parseInt(req.params.id);
    if (!url || !report_method_one) {
        return res.status(400).send("Url and Method 1 fields are required");
    }
    if (!id || isNaN(id)) {
        return res.status(400).send("ID must be a valid number");
    }
    try {
        const updatedIoc = yield prisma.ioc.update({
            where: { id },
            data: { url, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments },
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
app.listen(5000, () => {
    console.log("server running on localhost:5000");
});
//# sourceMappingURL=index.js.map