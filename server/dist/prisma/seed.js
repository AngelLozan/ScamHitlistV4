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
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
const iocsSeed = path_1.default.join(process.cwd(), "src", "data", "iocs.csv");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const seedIoc = yield prisma.$executeRaw `
    COPY "Ioc"(id, url, created_at, updated_at, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments)
    FROM '../data/iocs.csv',
    WITH DELIMITER ','
    Null AS 'null'
    CSV HEADER;
  `;
            console.log({ seedIoc });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map