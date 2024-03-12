const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
app.use(express.json()); // リクエストボディのJSONを解析するため
app.use(cors());

app.post('/jobs', async (req, res) => {
  const {
    id, title, companyName, location, salary, jobType,
    jobDescription, requiredSkills, appealPoints, workingHoursAndDays,
    workForm, holidays, locationNotes, trialPeriod, compensationAndBenefits,
    socialInsurance, headOfficeLocation, industry,
    representativePhoneNumber, representativeName, other
  } = req.body;
  console.log(req.body)
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
    console.error("Error saving job to the database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
