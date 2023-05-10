const fs = require("fs").promises;
const { parse } = require("csv-parse")
const csv = require("csv");

const rowProcessor = (row: string) => {
  const summaryCol = row[32];
  const titleCol = row[36];
  const contentCol = row[45];
  const languageCol = row[21];

  // console.log({summaryCol, titleCol, contentCol, languageCol});
  const boolCheck = summaryCol === "Partner Resource Center" && languageCol == "en_US";
  console.log({boolCheck})

  if (boolCheck) {
    const newArray = [summaryCol, titleCol, contentCol];


    console.log({newArray})
    const bla = contentCol.replace(/'\n'/g, "").replace(/\n/g, "").replace(/"/g, "")
    return [`"${titleCol}"`, `"${bla}"`];
  }
  return undefined;
}

const fileProcessor = async (filePath: string) => {
const data = await fs.readFile(filePath, "utf-8");

  parse(data, {columns: false, trim: true}, (err: any, rows: any) => {
    const header = rows[0].map((row: any, i: any) => row + " - " + i)
    console.log({header})
    let partnerResourceRows;
      partnerResourceRows = rows.slice(1).map((rowData: string) => {
        return rowProcessor(rowData);
      }).filter((data:any) => data)
    console.log({partnerResourceRows})

    fs.writeFile("./clean.csv", partnerResourceRows.join("\r"), (err:any) => {
      console.log(err || "done");
    })
  })
};

const main = async () => {
  const filesToRead = process.argv.slice(2);
  await filesToRead.reduce((promiseCollection, file) => {
    console.log({file})
    return promiseCollection.then(() => fileProcessor(file));
  }, Promise.resolve());
};

main();