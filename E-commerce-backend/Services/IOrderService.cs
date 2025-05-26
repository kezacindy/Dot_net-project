using E_commerce_backend.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface IOrderService
    {
        Task<OrderDto?> CreateOrderFromCartAsync(int userId, CreateOrderDto orderDetails);
        Task<OrderDto?> GetOrderByIdAsync(int userId, long orderId);
        Task<List<OrderDto>> GetUserOrdersAsync(int userId);
    }
}