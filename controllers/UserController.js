import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import Users from '../models/Users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importUser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, msg: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, '..', 'public', 'uploads', req.file.originalname);
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        let sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Fill missing values
        let lastSno, lastSupervisor, lastSupervisorEmail, lastTopic, lastDescription;
        sheetData = sheetData.map(row => {
            if (row['sno']) lastSno = row['sno'];
            if (row['supervisor']) lastSupervisor = row['supervisor'];
            if (row['supervisor_email']) lastSupervisorEmail = row['supervisor_email'];
            if (row['topic']) lastTopic = row['topic'];
            if (row['description']) lastDescription = row['description'];
            
            return {
                sno: lastSno,
                reg: row['reg'],
                name: row['name'],
                supervisor: lastSupervisor,
                supervisor_email: lastSupervisorEmail,
                topic: lastTopic,
                description: lastDescription
            };
        });

        // Remove duplicates within the same import data
        const seenRegs = new Set();
        sheetData = sheetData.filter(row => {
            if (seenRegs.has(row.reg)) {
                console.log(`Duplicate found in data: ${row.reg}, skipping...`);
                return false;
            }
            seenRegs.add(row.reg);
            return true;
        });

        // Insert data with upsert to avoid duplicates in the database
        for (const record of sheetData) {
            try {
                await Users.updateOne(
                    { reg: record.reg }, // Find by reg number
                    { $set: record }, // Update the document with new data
                    { upsert: true } // Insert if it doesn't exist
                );
            } catch (error) {
                throw error;
            }
        }

        res.status(200).send({ success: true, msg: 'Data processed successfully!' });
    } catch (error) {
        res.status(500).send({ success: false, msg: error.message });
    }
};

export default { importUser };
