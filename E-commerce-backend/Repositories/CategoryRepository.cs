using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            // SaveChangesAsync will be called by the service
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        // MODIFIED: Takes the entity that the service has already fetched and modified
        public Task UpdateAsync(Category categoryToUpdate)
        {
            _context.Categories.Update(categoryToUpdate);
            // SaveChangesAsync will be called by the service
            return Task.CompletedTask; // Update just marks the entity state
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                // SaveChangesAsync will be called by the service
            }
        }

        // ADDED: Implementation for ExistsAsync
        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Categories.AnyAsync(c => c.Id == id);
        }

        // ADDED: Implementation for SaveChangesAsync
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}