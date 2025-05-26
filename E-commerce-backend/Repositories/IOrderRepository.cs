using E_commerce_backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public interface IOrderRepository
    {
        Task AddOrderAsync(Order order);
        Task<Order?> GetOrderByIdAsync(long orderId, int userId); // Ensure user owns the order
        Task<List<Order>> GetOrdersByUserIdAsync(int userId);
        Task SaveChangesAsync();
    }
}