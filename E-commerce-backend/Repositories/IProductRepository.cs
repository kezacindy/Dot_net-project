using E_commerce_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public interface IProductRepository
    {
        Task AddAsync(Product product);
        Task<List<Product>> GetAllAsync();      // Should include Category
        Task<Product?> GetByIdAsync(long id);   // Should include Category
        Task UpdateAsync(Product productToUpdate); // MODIFIED: Takes the entity
        Task DeleteAsync(long id);
        Task<List<Product>> GetAllByCategoryIdAsync(int categoryId); // Should include Category
        Task<bool> ExistsAsync(long id);    // ADDED
        Task SaveChangesAsync();            // ADDED
    }
}