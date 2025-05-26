using E_commerce_backend.DTOs;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration; // Keep for consistency if MapProductToDto was ever used here
using System.Linq; // Keep for Any() if needed

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ICategoryService _categoryService;
        // private readonly IConfiguration _configuration; // No longer needed if MapProductToDto is removed or not used

        public ProductsController(IProductService productService, ICategoryService categoryService /*, IConfiguration configuration */)
        {
            _productService = productService;
            _categoryService = categoryService;
            // _configuration = configuration;
        }

        [HttpGet] // GET api/products
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            // Service now returns List<ProductDto>
            var productDtos = await _productService.GetAllProductsAsync();
            if (productDtos == null || !productDtos.Any())
            {
                return Ok(new List<ProductDto>()); // Return empty list
            }
            return Ok(productDtos); // Directly return the DTO list
        }

        [HttpGet("{id}")] // GET api/products/5
        public async Task<ActionResult<ProductDto>> GetProductById(long id)
        {
            // Service now returns ProductDto?
            var productDto = await _productService.GetProductByIdAsync(id);
            if (productDto == null)
            {
                return NotFound();
            }
            return Ok(productDto); // Directly return the DTO
        }

        [HttpGet("category/{categoryId}")] // GET api/products/category/2
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(int categoryId)
        {
            var category = await _categoryService.GetCategoryByIdAsync(categoryId); // Service returns CategoryDto?
            if (category == null) return NotFound("Category not found.");

            // Service now returns List<ProductDto>
            var productDtos = await _productService.GetAllProductsByCategoryIdAsync(categoryId);
            if (productDtos == null || !productDtos.Any())
            {
                return Ok(new List<ProductDto>()); // Return empty list
            }
            return Ok(productDtos); // Directly return the DTO list
        }


        [HttpGet("~/api/categories")] // GET api/categories
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAllCategories()
        {
            // Service now returns List<CategoryDto>
            var categoryDtos = await _categoryService.GetAllCategoriesAsync();
            if (categoryDtos == null || !categoryDtos.Any())
            {
                return Ok(new List<CategoryDto>());
            }
            return Ok(categoryDtos);
        }

        [HttpGet("~/api/categories/{id}")] // GET api/categories/1
        public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
        {
            // Service now returns CategoryDto?
            var categoryDto = await _categoryService.GetCategoryByIdAsync(id);
            if (categoryDto == null)
            {
                return NotFound();
            }
            return Ok(categoryDto);
        }

        // The MapProductToDto helper method is NO LONGER NEEDED in this controller
        // if the ProductService is returning ProductDto.
        // You can remove it from this file.
        /*
        private ProductDto MapProductToDto(Models.Product product)
        {
            // ...
        }
        */
    }
}