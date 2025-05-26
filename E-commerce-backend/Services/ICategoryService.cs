using E_commerce_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(int id);
        Task<CategoryDto?> AddCategoryAsync(CreateCategoryDto categoryDto);
        Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto categoryDto);
        Task<(bool Success, string? ErrorMessage)> DeleteCategoryByIdAsync(int id);
    }
}