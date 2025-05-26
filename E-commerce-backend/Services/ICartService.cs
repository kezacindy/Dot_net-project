using E_commerce_backend.DTOs;
using System;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface ICartService
    {
        Task<CartDto?> GetCartAsync(int userId);
        Task<CartDto?> AddItemToCartAsync(int userId, AddCartItemDto itemDto);
        Task<CartDto?> UpdateItemInCartAsync(int userId, long productId, UpdateCartItemDto itemDto);
        Task<bool> RemoveItemFromCartAsync(int userId, long productId);
        Task<bool> ClearCartAsync(int userId);
    }
}