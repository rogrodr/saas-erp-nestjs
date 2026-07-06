import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { CriarFornecedorDto } from './dto/criar-fornecedor.dto';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private service: FornecedoresService) {}

  @Get()
  listar(@Req() req: any) {
    return this.service.listar(req.user.empresaId);
  }

  @Post()
  criar(@Body() data: CriarFornecedorDto, @Req() req: any) {
    return this.service.criar(data, req.user.empresaId);
  }
}
