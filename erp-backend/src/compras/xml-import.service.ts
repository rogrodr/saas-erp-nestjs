import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

export interface ItemXmlNota {
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface NotaFiscalImportada {
  fornecedor: { cnpj: string; nome: string };
  itens: ItemXmlNota[];
  valorTotal: number;
}

@Injectable()
export class XmlService {
  private parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

  parse(xml: string): NotaFiscalImportada {
    const resultado = this.parser.parse(xml);
    const infNFe = this.extrairInfNFe(resultado);

    const emit = infNFe.emit;
    if (!emit) {
      throw new Error('Tag <emit> (emitente/fornecedor) não encontrada no XML.');
    }

    const detBruto = infNFe.det;
    if (!detBruto) {
      throw new Error('Nenhum item (<det>) encontrado no XML.');
    }
    // O fast-xml-parser retorna objeto único quando só tem 1 item, e array quando tem vários.
    const itensBrutos = Array.isArray(detBruto) ? detBruto : [detBruto];

    const itens: ItemXmlNota[] = itensBrutos.map((det: any) => {
      const prod = det.prod;
      return {
        codigo: String(prod.cProd ?? ''),
        descricao: String(prod.xProd ?? ''),
        quantidade: Number(prod.qCom ?? 0),
        valorUnitario: Number(prod.vUnCom ?? 0),
        valorTotal: Number(prod.vProd ?? 0),
      };
    });

    return {
      fornecedor: {
        cnpj: String(emit.CNPJ ?? emit.CPF ?? ''),
        nome: String(emit.xNome ?? ''),
      },
      itens,
      valorTotal: itens.reduce((soma, item) => soma + item.valorTotal, 0),
    };
  }

  private extrairInfNFe(resultado: any) {
    // Suporta tanto o XML completo autorizado (nfeProc > NFe) quanto só o bloco NFe isolado.
    const nfe = resultado.nfeProc?.NFe ?? resultado.NFe;
    if (!nfe?.infNFe) {
      throw new Error('XML não parece ser uma NF-e válida (tag <infNFe> não encontrada).');
    }
    return nfe.infNFe;
  }
}
