using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Cart?> GetCartByUserIdAsync(int userId, bool includeItems = true) // <<<< ADDED parameter & logic
        {
            var query = _context.Carts.AsQueryable();

            if (includeItems)
            {
                query = query.Include(c => c.Items)
                             .ThenInclude(i => i.Product); // Include product details for cart items
            }
            // else: do not include items and products, for a lightweight cart object

            return await query.FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Cart> CreateCartAsync(int userId)
        {
            var cart = new Cart { UserId = userId };
            await _context.Carts.AddAsync(cart);
            // SaveChangesAsync() will be called by the service after this or other operations
            return cart;
        }

        public async Task<CartItem?> GetCartItemAsync(Guid cartId, long productId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId);
        }

        public async Task AddCartItemAsync(CartItem item)
        {
            await _context.CartItems.AddAsync(item);
        }

        public Task UpdateCartItemAsync(CartItem item) // Marks entity as modified
        {
            _context.CartItems.Update(item);
            return Task.CompletedTask;
        }

        public Task RemoveCartItemAsync(CartItem item) // Marks entity for removal
        {
            _context.CartItems.Remove(item);
            return Task.CompletedTask;
        }

        public Task RemoveCartItemsAsync(IEnumerable<CartItem> items) // Marks entities for removal
        {
            _context.CartItems.RemoveRange(items);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}