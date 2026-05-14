-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "scaleDown" DOUBLE PRECISION NOT NULL,
    "logoPosition" TEXT NOT NULL,
    "logoImagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);
