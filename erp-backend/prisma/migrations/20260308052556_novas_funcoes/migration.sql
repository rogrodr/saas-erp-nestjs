-- CreateEnum
CREATE TYPE "TipoPreco" AS ENUM ('COMPRA', 'VENDA');

-- CreateTable
CREATE TABLE "HistoricoPreco" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoPreco" NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoPreco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendaItem" ADD CONSTRAINT "VendaItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPreco" ADD CONSTRAINT "HistoricoPreco_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPreco" ADD CONSTRAINT "HistoricoPreco_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
