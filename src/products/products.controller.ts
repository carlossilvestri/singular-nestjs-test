import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Param,
  Query,
  UseGuards,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  DefaultColumnsResponse,
  UpdateProductDto,
} from './dto/create-product.dto';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../utils/constants/default.constants';

@ApiTags('product')
@Controller('product')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'create a product' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token') // in the swagger documentation, a bearer token is required to access this endpoint
  @Post('add')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public() // makes the endpoint accessible to all
  @Get('list')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe)
    page = DEFAULT_PAGE,
    @Query('limit', new DefaultValuePipe(DEFAULT_LIMIT), ParseIntPipe)
    limit = DEFAULT_LIMIT,
  ) {
    return this.productsService.paginate({
      page,
      limit,
    });
  }

  @ApiBearerAuth('access-token') // in the swagger documentation, a bearer token is required to access this endpoint.
  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
}
