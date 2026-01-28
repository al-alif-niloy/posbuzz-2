import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // allows env variables everywhere
    }),
    AuthModule, // this registers /auth/login
     ProductsModule,
      SalesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
