using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(long id);
        Task<Product?> GetProductEntityByIdAsync(long id); // To get raw entity for update
        Task<Product?> AddProductAsync(Product product); // Controller builds entity with ImageName
        Task<bool> UpdateProductAsync(long id, Product productToUpdate); // Controller passes updated entity
        Task<(bool Success, string? ErrorMessage)> DeleteProductByIdAsync(long id);
        Task<List<ProductDto>> GetAllProductsByCategoryIdAsync(int categoryId);
    }
}