import express, {urlencoded} from "express";
import { google } from "googleapis";
import path from "path"; //
import { fileURLToPath } from "url" // 

const app = express();
const __filename = fileURLToPath(import.meta.url); //
const __dirname = path.dirname(__filename); //
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); //
});

app.post("/", async (req, res) => {
  const { request, Assignment,Assignment2,BonusPoints,Blogs,Attendence,Total} = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1fpdpBadWH1U7QIz7TnQJssKhLls0XKFFr2BmMHMa8Ds";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  // const getRows = await googleSheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range: "Sheet1!A:A",
  // });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:G",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[request,Assignment,Assignment2,BonusPoints,Blogs,Attendence,Total]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));
