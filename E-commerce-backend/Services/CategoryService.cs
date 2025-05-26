using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using E_commerce_backend.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProductRepository _productRepository;

        public CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
        }

        public async Task<CategoryDto?> AddCategoryAsync(CreateCategoryDto categoryDto)
        {
            var categoryEntity = new Category { Name = categoryDto.Name };
            await _categoryRepository.AddAsync(categoryEntity);
            await _categoryRepository.SaveChangesAsync(); // Call SaveChanges

            return new CategoryDto { Id = categoryEntity.Id, Name = categoryEntity.Name };
        }

        public async Task<List<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name }).ToList();
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null) return null;
            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto)
        {
            var categoryEntity = await _categoryRepository.GetByIdAsync(id);
            if (categoryEntity == null)
            {
                return false;
            }

            categoryEntity.Name = categoryDto.Name;
            await _categoryRepository.UpdateAsync(categoryEntity); // Pass the entity
            await _categoryRepository.SaveChangesAsync(); // Call SaveChanges
            return true;
        }

        public async Task<(bool Success, string? ErrorMessage)> DeleteCategoryByIdAsync(int id)
        {
            if (!await _categoryRepository.ExistsAsync(id)) // Use ExistsAsync
            {
                return (false, "Category not found.");
            }

            var productsInCategory = await _productRepository.GetAllByCategoryIdAsync(id);
            if (productsInCategory.Any())
            {
                return (false, "Cannot delete category: It has associated products.");
            }

            await _categoryRepository.DeleteAsync(id);
            await _categoryRepository.SaveChangesAsync(); // Call SaveChanges
            return (true, null);
        }
    }
}