const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // リクエストボディのJSONを解析するため
app.use(cors());
const UNIQUE_CONSTRAINT_FAILED = 'P2002';

app.post('/jobs', async (req, res) => {
  const {
    id, title, companyName, location, salary, jobType,
    jobDescription, requiredSkills, appealPoints, workingHoursAndDays,
    workForm, holidays, locationNotes, trialPeriod, compensationAndBenefits,
    socialInsurance, headOfficeLocation, industry,
    representativePhoneNumber, representativeName, other
  } = req.body;
  try {
    const job = await prisma.job.create({
      data: {
        id, title, companyName, location, salary, jobType,
        jobDescription, requiredSkills, appealPoints, workingHoursAndDays,
        workForm, holidays, locationNotes, trialPeriod, compensationAndBenefits,
        socialInsurance, headOfficeLocation, industry,
        representativePhoneNumber, representativeName, other
      },
    });
    res.status(201).json(job);
  } catch (error) {
    if (error.code === UNIQUE_CONSTRAINT_FAILED) {
      console.error("Error saving job to the database: Unique constraint failed on the fields: (`id`)", error.code);
      res.status(400).json({ error: "A job with this ID already exists." });
    } else {
      // その他のエラー
      console.error("Error saving job to the database:", error);
      res.status(500).json({ error: "Error saving job to the database" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
