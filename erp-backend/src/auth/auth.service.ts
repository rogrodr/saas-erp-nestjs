import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
