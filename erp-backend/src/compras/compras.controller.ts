import { Controller, Get, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { CriarCompraDto } from './dto/criar-compra.dto';
import { ImportarXmlDto } from './dto/importar-xml.dto';
import { XmlService } from './xml-import.service';

@Controller('compras')
export class ComprasController {
  constructor(
    private service: ComprasService,
    private xmlService: XmlService,
  ) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  // Só interpreta o XML e devolve uma prévia (não cria a compra ainda) —
  // a criação de fato acontece no POST /compras normal, depois que o
  // usuário confirma/ajusta os dados na tela de revisão.
  @Post('importar-xml')
  importarXml(@Body() data: ImportarXmlDto, @Req() req: any) {
    let notaFiscal;
    try {
      notaFiscal = this.xmlService.parse(data.xml);
    } catch (erro: any) {
      throw new BadRequestException(
        erro?.message ?? 'Não foi possível interpretar o XML enviado. Confirme que é uma NF-e válida.',
      );
    }
    return this.service.prepararImportacao(notaFiscal, req.user.empresaId);
  }

  @Post()
  criar(@Body() data: CriarCompraDto, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }
}
