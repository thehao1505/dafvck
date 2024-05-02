import { ForbiddenException, Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(authDto: AuthDTO) {
    try {
      const hashedPassword = await argon.hash(authDto.password);
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hashedPassword,
          firstName: authDto.firstName,
          lastName: authDto.lastName,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        }
      });

      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(error.message);
      }
    }
  }

  async login(authDto: AuthDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: authDto.email
      }
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const passwordMatch = await argon.verify(
      user.hashedPassword, authDto.password
    );
    if (!passwordMatch) {
      throw new ForbiddenException('Password incorrect');
    }
    delete user.hashedPassword;
    return await this.signJwtToken(user.id, user.email);
  }

  async signJwtToken(userID: number, email: string): 
    Promise<{accessToken: string}>{
    const payload = { sub: userID, email };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET
    });

    return { accessToken: jwtString };
  }
}
