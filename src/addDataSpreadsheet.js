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
 * Add data a google spreadsheet
 * @param {string} spreadsheetId Spreadsheets title
 * @param {array} data Spreadsheets data
 * @return {string} Spreadsheets Values
 */
async function addDataSpreadsheet(spreadsheetId, data) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    // obtém o intervalo atual de dados da planilha
    const spreadsheet = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:A",
    });
    const values = spreadsheet.data.values;
    const nextRow = values ? values.length + 1 : 1;

    const range = `A${nextRow}`;

    const addSpreadsheet = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: data,
      },
    });

    console.log(
      "Dados inseridos com sucesso na planilha:",
      addSpreadsheet.data
    );

    return addSpreadsheet.data;
  } catch (error) {
    console.error("Erro ao modificar a planilha", error);
  }
}

addDataSpreadsheet(spreadsheetId, [
  [
    "Javascript",
    "É uma linguagem single-threaded",
    "true",
    new Date().getTime(),
  ],
]);
