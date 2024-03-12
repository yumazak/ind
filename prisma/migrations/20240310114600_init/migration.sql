-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "employmentType" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "appealPoints" TEXT NOT NULL,
    "workingHoursAndDays" TEXT NOT NULL,
    "workForm" TEXT NOT NULL,
    "holidays" TEXT NOT NULL,
    "locationNotes" TEXT NOT NULL,
    "trialPeriod" TEXT NOT NULL,
    "compensationAndBenefits" TEXT NOT NULL,
    "socialInsurance" TEXT NOT NULL,
    "corporateName" TEXT NOT NULL,
    "headOfficeLocation" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "representativePhoneNumber" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "other" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
