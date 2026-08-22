import { Router } from 'express';
import {
  ProductsService,
  ProductsRepository,
  ProductsController,
} from '@myCommerce/api-products';
// import {
//   ApiResponse,
//   Product,
//   ProductFilter,
//   PaginatedResponse,
// } from '@myCommerce/models';
import { prisma } from './infrastructure/db/prisma';

const router = Router();
const repository = new ProductsRepository(prisma);
const service = new ProductsService(repository);
const controller = new ProductsController(service);

 router.post('/', controller.createProduct);
 router.get('/', controller.allProducts);
// const productsService = new ProductsService();
// // Products endpoints
// router.get('/', (req, res) => {
//   try {
//     const filter: ProductFilter = {};

//     if (req.query.category) {
//       filter.category = req.query.category as string;
//     }
//     if (req.query.minPrice) {
//       filter.minPrice = Number(req.query.minPrice);
//     }
//     if (req.query.maxPrice) {
//       filter.maxPrice = Number(req.query.maxPrice);
//     }
//     if (req.query.inStock !== undefined) {
//       filter.inStock = req.query.inStock === 'true';
//     }
//     if (req.query.searchTerm) {
//       filter.searchTerm = req.query.searchTerm as string;
//     }

//     const page = req.query.page ? Number(req.query.page) : 1;
//     const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

//     const result = productsService.getProducts(filter, page, pageSize);

//     const response: ApiResponse<PaginatedResponse<Product>> = {
//       data: result,
//       success: true,
//     };

//     res.json(response);
//   } catch {
//     const response: ApiResponse<null> = {
//       data: null,
//       success: false,
//       error: 'An error occurred while fetching products',
//     };
//     res.status(500).json(response);
//   }
// });

// router.get('/categories', (req, res) => {
//   try {
//     const categories = productsService.getCategories();
//     const response: ApiResponse<string[]> = {
//       data: categories,
//       success: true,
//     };
//     res.json(response);
//   } catch {
//     const response: ApiResponse<null> = {
//       data: null,
//       success: false,
//       error: 'An error occurred while fetching categories',
//     };
//     res.status(500).json(response);
//   }
// });

// router.get('/:id', (req, res) => {
//   try {
//     const product = productsService.getProductById(req.params.id);

//     if (!product) {
//       const response: ApiResponse<null> = {
//         data: null,
//         success: false,
//         error: 'Product not found',
//       };
//       return res.status(404).json(response);
//     }

//     const response: ApiResponse<Product> = {
//       data: product,
//       success: true,
//     };
//     return res.json(response);
//   } catch {
//     const response: ApiResponse<null> = {
//       data: null,
//       success: false,
//       error: 'An error occurred while fetching the product',
//     };
//     return res.status(500).json(response);
//   }
// });
 export const ProductRouter = router;

