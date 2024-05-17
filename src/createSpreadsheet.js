const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const { email } = require("./config/credentials");

const authFile = path.resolve(__dirname, "..", "auth.json");
const credentials = JSON.parse(fs.readFileSync(authFile));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
async function createSpreadsheet(title) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    const resource = {
      properties: {
        title: title,
      },
    };

    const spreadsheet = await sheets.spreadsheets.values.append({
      resource,
      fields: "spreadsheetId",
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    console.log(`Planilha criada com ID: ${spreadsheetId}`);
    await shareSpreadsheet(spreadsheetId);

    return spreadsheetId;
  } catch (error) {
    console.error("Erro ao criar a planilha", error);
  }
}

/**
 * Share the spreadsheet with your email
 * @param {string} spreadsheetId Spreadsheets ID to be shared
 * @return {string} Message spreadsheets success
 */
async function shareSpreadsheet(spreadsheetId) {
  try {
    const drive = google.drive({ version: "v3", auth });

    await drive.permissions.create({
      resource: {
        type: "user",
        role: "writer",
        emailAddress: email,
      },
      fileId: spreadsheetId,
      fileds: "id",
    });
    console.log(`Planilha compartilhada com ${email}`);
  } catch (error) {
    console.error("Erro ao compartilhar a planilha", error);
  }
}

createSpreadsheet("Planilha criada com api");
