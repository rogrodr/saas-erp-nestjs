/*
  Warnings:

  - You are about to drop the column `bairro` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cep` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `numero` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Cliente` table. All the data in the column will be lost.
  - The `role` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GERENTE', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('PENDENTE', 'FATURADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "AcaoAuditoria" AS ENUM ('CRIAR', 'ATUALIZAR', 'DELETAR', 'ACESSO');

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "bairro",
DROP COLUMN "cep",
DROP COLUMN "cidade",
DROP COLUMN "email",
DROP COLUMN "endereco",
DROP COLUMN "estado",
DROP COLUMN "numero",
DROP COLUMN "telefone";

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "estoqueMin" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "sku" TEXT,
ALTER COLUMN "estoque" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpires" TIMESTAMP(3),
ADD COLUMN     "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FUNCIONARIO';

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "status" "StatusPedido" NOT NULL DEFAULT 'PENDENTE';

-- CreateTable
CREATE TABLE "EnderecoCliente" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT true,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "EnderecoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContatoCliente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "principal" BOOLEAN NOT NULL DEFAULT true,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "ContatoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovimentacaoEstoque" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "produtoId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "MovimentacaoEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" SERIAL NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" INTEGER,
    "acao" "AcaoAuditoria" NOT NULL,
    "dadosAnteriores" JSONB,
    "dadosNovos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EnderecoCliente" ADD CONSTRAINT "EnderecoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContatoCliente" ADD CONSTRAINT "ContatoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimentacaoEstoque" ADD CONSTRAINT "MovimentacaoEstoque_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auditoria" ADD CONSTRAINT "Auditoria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
