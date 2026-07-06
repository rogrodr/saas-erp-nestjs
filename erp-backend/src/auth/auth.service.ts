import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SolicitarRecuperacaoDto } from './dto/solicitar-recuperacao.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        empresaId: data.empresaId,
      },
    });

    return { id: usuario.id, nome: usuario.nome, email: usuario.email };
  }

  async login(data: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) throw new UnauthorizedException('Usuário inválido');

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaValida) throw new UnauthorizedException('Senha inválida');

    const payload = {
      usuarioId: usuario.id,
      empresaId: usuario.empresaId,
      email: usuario.email,
      role: usuario.role,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { token, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const novoToken = this.jwtService.sign(
        {
          usuarioId: payload.usuarioId,
          empresaId: payload.empresaId,
          email: payload.email,
          role: payload.role,
        },
        { expiresIn: '1d' },
      );

      return { token: novoToken };
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async solicitarRecuperacao(data: SolicitarRecuperacaoDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      return { message: 'Se o email estiver cadastrado, as instruções foram enviadas.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresIn = new Date(Date.now() + 3600000);

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetToken: token,
        resetTokenExpires: expiresIn,
      },
    });

    console.log(`[SIMULAÇÃO DE ENVIO DE EMAIL] Token de recuperação para ${usuario.email}: ${token}`);

    return { message: 'Se o email estiver cadastrado, as instruções foram enviadas.' };
  }

  async redefinirSenha(data: RedefinirSenhaDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!usuario) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    const senhaHash = await bcrypt.hash(data.novaSenha, 10);

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        senha: senhaHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return { message: 'Senha atualizada com sucesso' };
  }
}