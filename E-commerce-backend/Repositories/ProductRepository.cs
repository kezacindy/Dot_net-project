using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
            // SaveChangesAsync called by service
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync(); // Include Category
        }

        public async Task<Product?> GetByIdAsync(long id)
        {
            return await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id); // Include Category
        }

        // MODIFIED: Takes the entity that the service has already fetched and modified
        public Task UpdateAsync(Product productToUpdate)
        {
            _context.Products.Update(productToUpdate);
            // SaveChangesAsync called by service
            return Task.CompletedTask; // Update just marks the entity state
        }

        public async Task DeleteAsync(long id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                // SaveChangesAsync called by service
            }
        }

        public async Task<List<Product>> GetAllByCategoryIdAsync(int categoryId)
        {
            return await _context.Products.Include(p => p.Category) // Include Category
                                     .Where(p => p.CategoryId == categoryId)
                                     .ToListAsync();
        }

        // ADDED: Implementation for ExistsAsync
        public async Task<bool> ExistsAsync(long id)
        {
            return await _context.Products.AnyAsync(p => p.Id == id);
        }

        // ADDED: Implementation for SaveChangesAsync
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}