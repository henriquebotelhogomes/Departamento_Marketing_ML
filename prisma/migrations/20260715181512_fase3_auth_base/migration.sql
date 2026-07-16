-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "custId" TEXT NOT NULL,
    "balance" REAL NOT NULL,
    "balanceFrequency" REAL NOT NULL,
    "purchases" REAL NOT NULL,
    "oneoffPurchases" REAL NOT NULL,
    "installmentsPurchases" REAL NOT NULL,
    "cashAdvance" REAL NOT NULL,
    "purchasesFrequency" REAL NOT NULL,
    "oneoffPurchasesFrequency" REAL NOT NULL,
    "purchasesInstallmentsFrequency" REAL NOT NULL,
    "cashAdvanceFrequency" REAL NOT NULL,
    "cashAdvanceTrx" INTEGER NOT NULL,
    "purchasesTrx" INTEGER NOT NULL,
    "creditLimit" REAL,
    "payments" REAL NOT NULL,
    "minimumPayments" REAL,
    "prcFullPayment" REAL NOT NULL,
    "tenure" INTEGER NOT NULL,
    "clusterId" INTEGER,
    "segmentLabel" TEXT,
    "pca1" REAL,
    "pca2" REAL,
    "modelVersion" TEXT,
    "scoredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Segment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelVersion" TEXT NOT NULL,
    "clusterId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "customerCount" INTEGER NOT NULL,
    "sharePct" REAL NOT NULL,
    "dominantFeatures" TEXT NOT NULL,
    "avgBalance" REAL NOT NULL,
    "avgPurchases" REAL NOT NULL,
    "avgCashAdvance" REAL NOT NULL,
    "avgCreditLimit" REAL NOT NULL,
    "avgPrcFullPayment" REAL NOT NULL,
    "recommendation" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClusterRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "modelVersion" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL,
    "nClusters" INTEGER NOT NULL,
    "silhouette" REAL NOT NULL,
    "daviesBouldin" REAL NOT NULL,
    "calinskiHarabasz" REAL NOT NULL,
    "inertia" REAL NOT NULL,
    "usedAutoencoder" BOOLEAN NOT NULL,
    "nComponentsPca" INTEGER NOT NULL,
    "trainedAt" DATETIME NOT NULL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "SegmentationConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activeModelVersion" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_custId_key" ON "Customer"("custId");

-- CreateIndex
CREATE INDEX "Customer_clusterId_idx" ON "Customer"("clusterId");

-- CreateIndex
CREATE INDEX "Customer_modelVersion_idx" ON "Customer"("modelVersion");

-- CreateIndex
CREATE INDEX "Segment_modelVersion_idx" ON "Segment"("modelVersion");

-- CreateIndex
CREATE UNIQUE INDEX "Segment_modelVersion_clusterId_key" ON "Segment"("modelVersion", "clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "ClusterRun_modelVersion_key" ON "ClusterRun"("modelVersion");
