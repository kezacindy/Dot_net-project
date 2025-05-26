// AdminController.cs
using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

// Using statements for CSV and PDF generation
using System.Globalization;
using CsvHelper;
using QuestPDF.Fluent;
using QuestPDF.Helpers;       // For pre-defined Fonts like Arial, Colors
using QuestPDF.Infrastructure; // For Unit, LicenseType

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IProductService _productService;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly UserManager<User> _userManager;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
            ICategoryService categoryService,
            IProductService productService,
            IConfiguration configuration,
            IWebHostEnvironment webHostEnvironment,
            UserManager<User> userManager,
            ILogger<AdminController> logger)
        {
            _categoryService = categoryService;
            _productService = productService;
            _configuration = configuration;
            _webHostEnvironment = webHostEnvironment;
            _userManager = userManager;
            _logger = logger;
        }

        // --- Categories CRUD ---
        // ... (Category methods remain the same) ...
        [HttpPost("categories")]
        public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto categoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var createdCategory = await _categoryService.AddCategoryAsync(categoryDto);
            if (createdCategory == null)
            {
                return BadRequest(new { Message = "Failed to create category or category already exists." });
            }
            return CreatedAtAction(nameof(GetCategoryAdmin), new { id = createdCategory.Id }, createdCategory);
        }

        [HttpGet("categories/{id}", Name = "GetCategoryAdmin")]
        public async Task<ActionResult<CategoryDto>> GetCategoryAdmin(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto categoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var success = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (!success) return NotFound(new { Message = "Category not found or update failed." });
            return NoContent();
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var (success, errorMessage) = await _categoryService.DeleteCategoryByIdAsync(id);
            if (!success)
            {
                if (!string.IsNullOrEmpty(errorMessage) && errorMessage.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { Message = errorMessage });
                return BadRequest(new { Message = errorMessage ?? "Failed to delete category." });
            }
            return NoContent();
        }

        // --- Products CRUD ---
        // ... (Product methods remain the same) ...
        [HttpGet("products")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllAdminProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            if (products == null || !products.Any()) return Ok(new List<ProductDto>());
            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<ActionResult<ProductDto>> CreateProduct([FromForm] CreateProductDto productDto, IFormFile? imageFile)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var category = await _categoryService.GetCategoryByIdAsync(productDto.CategoryId);
            if (category == null) return BadRequest(new { Message = $"Category with ID {productDto.CategoryId} not found." });

            string? uniqueFileName = null;
            if (imageFile != null && imageFile.Length > 0)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string imageProductPath = Path.Combine(wwwRootPath, "imageProduct");
                if (!Directory.Exists(imageProductPath)) Directory.CreateDirectory(imageProductPath);
                uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(imageProductPath, uniqueFileName);
                try { using (var fs = new FileStream(filePath, FileMode.Create)) { await imageFile.CopyToAsync(fs); } }
                catch (Exception ex) { _logger?.LogError(ex, "Error uploading image during product creation."); return StatusCode(500, $"Image upload error: {ex.Message}"); }
            }
            var product = new Product { Name = productDto.Name, CategoryId = productDto.CategoryId, Price = productDto.Price, Weight = productDto.Weight, Description = productDto.Description, ImageName = uniqueFileName ?? productDto.ImageName };
            var createdProductEntity = await _productService.AddProductAsync(product);
            if (createdProductEntity == null) return BadRequest(new { Message = "Failed to create product." });
            var createdProductDto = await _productService.GetProductByIdAsync(createdProductEntity.Id);
            if (createdProductDto == null) return NotFound("Could not retrieve created product details.");
            return CreatedAtAction(nameof(GetProductAdmin), new { id = createdProductDto.Id }, createdProductDto);
        }

        [HttpGet("products/{id}", Name = "GetProductAdmin")]
        public async Task<ActionResult<ProductDto>> GetProductAdmin(long id)
        {
            var productDto = await _productService.GetProductByIdAsync(id);
            if (productDto == null) return NotFound();
            return Ok(productDto);
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(long id, [FromForm] UpdateProductDto productDto, IFormFile? imageFile)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var category = await _categoryService.GetCategoryByIdAsync(productDto.CategoryId);
            if (category == null) return BadRequest(new { Message = $"Category with ID {productDto.CategoryId} not found." });
            var existingProductEntity = await _productService.GetProductEntityByIdAsync(id);
            if (existingProductEntity == null) return NotFound(new { Message = "Product not found." });

            existingProductEntity.Name = productDto.Name;
            existingProductEntity.CategoryId = productDto.CategoryId;
            existingProductEntity.Price = productDto.Price;
            existingProductEntity.Weight = productDto.Weight;
            existingProductEntity.Description = productDto.Description;

            if (imageFile != null && imageFile.Length > 0)
            {
                string wwwRootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string imageProductPath = Path.Combine(wwwRootPath, "imageProduct");
                if (!string.IsNullOrEmpty(existingProductEntity.ImageName))
                {
                    string oldImagePath = Path.Combine(imageProductPath, existingProductEntity.ImageName);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        try { System.IO.File.Delete(oldImagePath); }
                        catch (Exception ex) { _logger?.LogWarning(ex, "Error deleting old image {OldImagePath}", oldImagePath); }
                    }
                }
                if (!Directory.Exists(imageProductPath)) Directory.CreateDirectory(imageProductPath);
                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(imageProductPath, uniqueFileName);
                try { using (var fs = new FileStream(filePath, FileMode.Create)) { await imageFile.CopyToAsync(fs); } }
                catch (Exception ex) { _logger?.LogError(ex, "Error uploading new image during product update."); return StatusCode(500, $"Image upload error: {ex.Message}"); }
                existingProductEntity.ImageName = uniqueFileName;
            }
            var success = await _productService.UpdateProductAsync(id, existingProductEntity);
            if (!success) return BadRequest(new { Message = "Failed to update product." });
            return NoContent();
        }

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(long id)
        {
            var (success, errorMessage) = await _productService.DeleteProductByIdAsync(id);
            if (!success)
            {
                if (!string.IsNullOrEmpty(errorMessage) && errorMessage.Contains("not found", StringComparison.OrdinalIgnoreCase))
                    return NotFound(new { Message = errorMessage });
                return BadRequest(new { Message = errorMessage ?? "Failed to delete product." });
            }
            return NoContent();
        }


        // --- Users Management & Reports ---
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllAppUsers()
        {
            var users = await _userManager.Users
                .OrderBy(u => u.LastName).ThenBy(u => u.FirstName)
                .Select(u => new UserDto { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName, Email = u.Email })
                .ToListAsync();
            if (!users.Any()) return Ok(new List<UserDto>());
            return Ok(users);
        }

        [HttpGet("users/pdf")]
        public async Task<IActionResult> DownloadUsersPdf()
        {
            try
            {
                var users = await _userManager.Users
                    .OrderBy(u => u.LastName).ThenBy(u => u.FirstName)
                    .Select(u => new UserDto { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName, Email = u.Email })
                    .ToListAsync();

                if (!users.Any()) return NotFound("No users available to generate PDF report.");

                QuestPDF.Settings.License = LicenseType.Community;

                var document = Document.Create(container =>
                {
                    container.Page(page =>
                    {
                        page.Margin(30, Unit.Point);
                        // Use Arial as a safe, common font
                        page.DefaultTextStyle(x => x.FontSize(10).FontFamily(Fonts.Arial));

                        page.Header()
                            .PaddingBottom(1, Unit.Centimetre)
                            .Text("Users List Report")
                            .SemiBold().FontSize(16).FontColor(Colors.Blue.Darken2);

                        page.Content()
                            .Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(50, Unit.Point);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(4);
                                });
                                table.Header(header =>
                                {
                                    header.Cell().Background(Colors.Grey.Lighten3).Padding(5, Unit.Point).Text("ID").Bold();
                                    header.Cell().Background(Colors.Grey.Lighten3).Padding(5, Unit.Point).Text("First Name").Bold();
                                    header.Cell().Background(Colors.Grey.Lighten3).Padding(5, Unit.Point).Text("Last Name").Bold();
                                    header.Cell().Background(Colors.Grey.Lighten3).Padding(5, Unit.Point).Text("Email").Bold();
                                });
                                foreach (var user in users)
                                {
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(Colors.Grey.Lighten2).Padding(5, Unit.Point).Text(user.Id.ToString());
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(Colors.Grey.Lighten2).Padding(5, Unit.Point).Text(user.FirstName);
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(Colors.Grey.Lighten2).Padding(5, Unit.Point).Text(user.LastName);
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(Colors.Grey.Lighten2).Padding(5, Unit.Point).Text(user.Email);
                                }
                            });
                        page.Footer()
                            .AlignCenter()
                            .Text(x => { x.Span("Page "); x.CurrentPageNumber(); x.Span(" of "); x.TotalPages(); x.Span($" - Generated on: {DateTime.Now:yyyy-MM-dd HH:mm}"); });
                    });
                });
                byte[] pdfBytes = document.GeneratePdf();
                return File(pdfBytes, "application/pdf", $"Users_Report_{DateTime.Now:yyyyMMdd}.pdf");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error generating PDF report for users.");
                return StatusCode(500, "An error occurred while generating the PDF report.");
            }
        }

        [HttpGet("users/csv")]
        public async Task<IActionResult> DownloadUsersCsv()
        {
            try
            {
                var users = await _userManager.Users
                    .OrderBy(u => u.LastName).ThenBy(u => u.FirstName)
                    .Select(u => new UserDto { Id = u.Id, FirstName = u.FirstName, LastName = u.LastName, Email = u.Email })
                    .ToListAsync();
                if (!users.Any()) return NotFound("No users available to generate CSV report.");

                byte[] csvBytes;
                using (var memoryStream = new MemoryStream())
                using (var streamWriter = new StreamWriter(memoryStream, System.Text.Encoding.UTF8))
                using (var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture))
                {
                    csvWriter.WriteRecords(users);
                    streamWriter.Flush(); // Important: Ensure data is written to the memory stream
                    csvBytes = memoryStream.ToArray();
                }
                return File(csvBytes, "text/csv", $"Users_Report_{DateTime.Now:yyyyMMdd}.csv");
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Error generating CSV report for users.");
                return StatusCode(500, "An error occurred while generating the CSV report.");
            }
        }
    }
}