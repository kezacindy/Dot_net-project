using E_commerce_backend.Models;
using System; // For Guid
using System.Collections.Generic; // For IEnumerable
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public interface ICartRepository
    {
        Task<Cart?> GetCartByUserIdAsync(int userId, bool includeItems = true); // <<<< ADDED parameter
        Task<Cart> CreateCartAsync(int userId);
        Task<CartItem?> GetCartItemAsync(Guid cartId, long productId);
        Task AddCartItemAsync(CartItem item);
        Task UpdateCartItemAsync(CartItem item); // EF Core will track, service calls SaveChanges
        Task RemoveCartItemAsync(CartItem item); // EF Core will track, service calls SaveChanges
        Task RemoveCartItemsAsync(IEnumerable<CartItem> items); // EF Core will track, service calls SaveChanges
        Task SaveChangesAsync();
    }
}