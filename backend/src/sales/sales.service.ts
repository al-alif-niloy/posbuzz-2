import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.sale.findMany({
      include: { product: true },
    });
  }

  async create(data: { productId: number; quantity: number }) {
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) throw new BadRequestException('Product not found');

    if (product.stock_quantity < data.quantity)
      throw new BadRequestException('Insufficient stock');

    // Deduct stock
    await this.prisma.product.update({
      where: { id: data.productId },
      data: { stock_quantity: product.stock_quantity - data.quantity },
    });

    // Create sale
    return this.prisma.sale.create({
      data: { productId: data.productId, quantity: data.quantity },
      include: { product: true },
    });
  }
}
