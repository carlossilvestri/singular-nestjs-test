import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Product>> {
    return paginate<Product>(this.productRepository, options);
  }

  async create(createProductDto: CreateProductDto) {
    const createdProduct = await this.productRepository.create(
      createProductDto,
    );
    return await this.productRepository.save(createdProduct);
  }

  async findAll() {
    return await this.productRepository.find();
  }
  async findById(id: number) {
    return await this.productRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} does not exist`);
    }
    return this.productRepository.save(product);
  }
}
