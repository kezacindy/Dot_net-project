// src/Services/ProductService.cs

using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using E_commerce_backend.Repositories;
using Microsoft.Extensions.Configuration; // For IConfiguration
using System; // For Console.WriteLine (basic logging/warning)
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IConfiguration _configuration; // To access appsettings.json values

        public ProductService(IProductRepository productRepository, IConfiguration configuration)
        {
            _productRepository = productRepository;
            _configuration = configuration;
        }

        public async Task<Product?> AddProductAsync(Product product)
        {
            // The controller has already prepared the Product entity,
            // including setting the ImageName if a file was uploaded.
            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();
            return product; // Return the entity, now with a database-generated ID
        }

        public async Task<List<ProductDto>> GetAllProductsAsync()
        {
            // Repository's GetAllAsync should include Category for CategoryName mapping
            var products = await _productRepository.GetAllAsync();
            return products.Select(MapEntityToDto).ToList();
        }

        public async Task<ProductDto?> GetProductByIdAsync(long id)
        {
            // Repository's GetByIdAsync should include Category
            var product = await _productRepository.GetByIdAsync(id);
            return product == null ? null : MapEntityToDto(product);
        }

        public async Task<Product?> GetProductEntityByIdAsync(long id)
        {
            // This method is for fetching the raw, tracked entity for updates.
            // Repository's GetByIdAsync should include Category if the update logic
            // might indirectly affect or depend on it, though usually not necessary
            // just for updating product fields.
            return await _productRepository.GetByIdAsync(id);
        }

        public async Task<bool> UpdateProductAsync(long id, Product productToUpdate)
        {
            // The controller fetches the entity using GetProductEntityByIdAsync,
            // modifies it (including potentially ImageName if a new file was uploaded),
            // and then passes the modified entity here.
            if (!await _productRepository.ExistsAsync(id))
            {
                // Or throw an exception, or return a more detailed result
                return false; // Product to update doesn't exist
            }
            await _productRepository.UpdateAsync(productToUpdate); // Repository's UpdateAsync takes the modified entity
            await _productRepository.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Success, string? ErrorMessage)> DeleteProductByIdAsync(long id)
        {
            if (!await _productRepository.ExistsAsync(id))
            {
                return (false, "Product not found.");
            }

            // TODO: Consider adding checks here if the product is part of any active orders
            // or other critical dependencies before allowing deletion.
            // This would involve injecting and using other repositories/services.
            // Example (pseudo-code):
            // var orderItemsWithProduct = await _orderItemRepository.GetByProductIdAsync(id);
            // if (orderItemsWithProduct.Any())
            // {
            //     return (false, "Cannot delete product: It is referenced in existing orders.");
            // }

            await _productRepository.DeleteAsync(id);
            await _productRepository.SaveChangesAsync();
            return (true, null);
        }

        public async Task<List<ProductDto>> GetAllProductsByCategoryIdAsync(int categoryId)
        {
            // Repository's GetAllByCategoryIdAsync should include Category
            var products = await _productRepository.GetAllByCategoryIdAsync(categoryId);
            return products.Select(MapEntityToDto).ToList();
        }

        // Helper method to map Product entity to ProductDto
        private ProductDto MapEntityToDto(Product product)
        {
            if (product == null) return null!;

            // 1. Get the configured base URL of your backend server from appsettings.json
            var configuredServerBaseUrl = _configuration["AppUrls:ImageBaseUrl"]?.TrimEnd('/');
            if (string.IsNullOrEmpty(configuredServerBaseUrl))
            {
                // Log this warning. For development, you might have a hardcoded fallback,
                // but it's essential this configuration is set correctly.
                Console.WriteLine("WARNING: AppUrls:ImageBaseUrl is not configured in appsettings.json. Image URLs might be incorrect. Falling back to an empty base for relative paths, or a default like http://localhost:YOUR_PORT.");
                // Consider what a sensible fallback is. If all else fails and you expect relative paths from root:
                // configuredServerBaseUrl = ""; // This would result in /imageProduct/filename.jpg
                // OR a more specific default if you know your dev server URL:
                configuredServerBaseUrl = "http://localhost:5270"; // Ensure this matches your backend URL
            }

            // 2. Define the path segment where images are served from within wwwroot
            var imagePathSegment = "/imageProduct"; // This MUST match the folder inside wwwroot

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? "N/A", // Relies on Category being included by the repository
                Price = product.Price,
                Weight = product.Weight,
                Description = product.Description,
                ImageName = product.ImageName, // The raw filename, e.g., "guid_someimage.jpg"
                ImageUrl = !string.IsNullOrEmpty(product.ImageName)
                               ? $"{configuredServerBaseUrl}{imagePathSegment}/{product.ImageName}"
                               // Example result: "http://localhost:5270/imageProduct/guid_someimage.jpg"
                               : null
            };
        }
    }
}