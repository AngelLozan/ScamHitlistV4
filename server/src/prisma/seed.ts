import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse";
const prisma = new PrismaClient();
const iocsSeed = path.join(process.cwd(), "src", "data", "iocs.csv");

// enum Status {
//   added = 0,
//   reported,
//   resolved,
//   official_url,
//   watchlist,
// }

// type Ioc = {
//   id: number;
//   url: string;
//   created_at: Date;
//   updated_at: Date;
//   removed: Date;
//   status: Status;
//   method_one: string;
//   method_two: string;
//   form: string;
//   host: string;
//   follow_up: Date;
//   count: number;
//   comment: Text;
// };

// async function main() {
//   const iocsSeed = path.join(process.cwd(), "src", "data", "iocs.csv");
//   const headers = [
//     "id",
//     "url",
//     "created_at",
//     "updated_at",
//     "removed_date",
//     "status",
//     "report_method_one",
//     "report_method_two",
//     "form",
//     "host",
//     "follow_up_date",
//     "follow_up_count",
//     "comments"
//   ];

  // const iocFileContent = fs.readFileSync(iocsSeed, { encoding: "utf-8"});
//   // const formsSeed = path.join(process.cwd(), "src", "data", "forms.csv");
//   // const hostsSeed = path.join(process.cwd(), "src", "data", "hosts.csv");

//   let Iocs;
//   parse(iocFileContent, {
//     delimiter: ',',
//     columns: headers,
//     fromLine: 2,
//     cast: (columnValue, context) => {
//       if(context.column === "id"){
//         return parseInt(columnValue, 10);
//       }
//       return columnValue;
//     }
//   }, (err, result: Ioc[]) => {
//     if (err) {
//       console.error(err);
//     }
//     // console.log("Result: ", result);
//     Iocs = result;
//   }
//   );

async function main(){
 //@dev Attempted => FROM ${iocsSeed}. No success, error at param $1.
 //  const iocsSeed = path.join(process.cwd(), "src", "data", "iocs.csv");
  try {
    const seedIoc = await prisma.$executeRaw`
    COPY "Ioc"(id, url, created_at, updated_at, removed_date, status, report_method_one, report_method_two, form, host, follow_up_date, follow_up_count, comments)
    FROM '../data/iocs.csv',
    WITH DELIMITER ','
    Null AS 'null'
    CSV HEADER;
  `;

    console.log({ seedIoc });
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
