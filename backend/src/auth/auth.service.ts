import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);

    return { access_token: token };
  }
}
