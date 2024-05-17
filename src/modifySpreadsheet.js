const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const { spreadsheetId } = require("./config/credentials");

const authFile = path.resolve(__dirname, "..", "auth.json");
const credentials = JSON.parse(fs.readFileSync(authFile));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

/**
 * Modify data a google spreadsheet
 * @param {string} spreadsheetId Spreadsheets id
 * @param {array} newData Spreadsheets data
 * @param {number} rowIndex Spreadsheets rowIndex
 * @return {string} Return info spreadsheets
 */
async function modifySpreadsheet(spreadsheetId, newData, rowIndex) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const range = `A${rowIndex}:D${rowIndex}`;

    const verifyDataExists = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `A${rowIndex}:D${rowIndex}`,
    });

    const existingData = verifyDataExists.data.values;

    if (!existingData || existingData.length === 0) {
      console.log(
        `Não há dados na linha ${rowIndex}. Não é possível modificar.`
      );
      return;
    }

    const spreadsheet = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [newData],
      },
    });

    console.log("Dados modificados com sucesso na planilha:", spreadsheet.data);

    return spreadsheet.data;
  } catch (error) {
    console.error("Erro ao modificar a planilha", error);
  }
}

modifySpreadsheet(
  spreadsheetId,
  [
    "Javascript2",
    "É uma linguagem single-threaded",
    "true",
    new Date().getTime(),
  ],
  5
);
