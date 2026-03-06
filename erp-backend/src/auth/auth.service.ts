import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {

    const senhaHash = await bcrypt.hash(data.senha, 10)

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        empresaId: data.empresaId
      }
    })

    return usuario
  }

  async login(data: LoginDto) {

    const usuario = await this.prisma.usuario.findUnique({
      where: { email: data.email }
    })

    if (!usuario) {
      throw new UnauthorizedException('Usuário inválido')
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha)

    if (!senhaValida) {
      throw new UnauthorizedException('Senha inválida')
    }

    const token = this.jwtService.sign({
      userId: usuario.id,
      empresaId: usuario.empresaId
    })

    return { token }
  }

}