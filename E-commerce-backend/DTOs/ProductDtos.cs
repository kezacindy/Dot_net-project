using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.DTOs
{
    public class ProductDto // Response DTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!; // Include category name
        public decimal Price { get; set; }
        public decimal Weight { get; set; }
        public string Description { get; set; } = null!;
        public string ImageName { get; set; } = null!;
        // Add ImageUrl if you construct it on the backend
        public string? ImageUrl { get; set; }
    }

    public class CreateProductDto // Request DTO for creating
    {
        [Required, StringLength(200)]
        public string Name { get; set; } = null!;
        [Required]
        public int CategoryId { get; set; }
        [Required, Range(0.01, 1000000)]
        public decimal Price { get; set; }
        [Range(0, 10000)]
        public decimal Weight { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageName { get; set; } = string.Empty;
        // Consider using IFormFile for image uploads directly
    }

    public class UpdateProductDto // Request DTO for updating
    {
        [Required, StringLength(200)]
        public string Name { get; set; } = null!;
        [Required]
        public int CategoryId { get; set; }
        [Required, Range(0.01, 1000000)]
        public decimal Price { get; set; }
        [Range(0, 10000)]
        public decimal Weight { get; set; }
        public string Description { get; set; } = string.Empty;
        public string ImageName { get; set; } = string.Empty;
    }
}