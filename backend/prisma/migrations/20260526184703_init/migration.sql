-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
