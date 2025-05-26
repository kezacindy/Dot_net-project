using E_commerce_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public interface ICategoryRepository
    {
        Task AddAsync(Category category);
        Task<List<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task UpdateAsync(Category categoryToUpdate); // MODIFIED: Takes the entity
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id); // ADDED
        Task SaveChangesAsync();        // ADDED
    }
}