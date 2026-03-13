/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "cpf" TEXT;

-- AlterTable
ALTER TABLE "ContaReceber" ADD COLUMN     "clienteId" INTEGER,
ADD COLUMN     "vendaId" INTEGER;

-- AlterTable
ALTER TABLE "Fornecedor" ADD COLUMN     "cnpj" TEXT;

-- AlterTable
ALTER TABLE "HistoricoPreco" ADD COLUMN     "compraId" INTEGER,
ADD COLUMN     "vendaId" INTEGER;

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "clienteId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaReceber" ADD CONSTRAINT "ContaReceber_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaReceber" ADD CONSTRAINT "ContaReceber_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPreco" ADD CONSTRAINT "HistoricoPreco_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPreco" ADD CONSTRAINT "HistoricoPreco_vendaId_fkey" FOREIGN KEY ("vendaId") REFERENCES "Venda"("id") ON DELETE SET NULL ON UPDATE CASCADE;
