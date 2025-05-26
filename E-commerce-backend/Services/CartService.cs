// src/Services/CartService.cs
using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using E_commerce_backend.Repositories;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly IConfiguration _configuration;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository, IConfiguration configuration)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _configuration = configuration;
        }

        public async Task<CartDto?> GetCartAsync(int userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: true);
            if (cart == null)
            {
                // Return a new, empty CartDto structure if no cart exists
                return new CartDto { UserId = userId, Id = Guid.Empty, Items = new List<CartItemDto>(), TotalPrice = 0 };
            }
            return MapCartToDto(cart);
        }

        public async Task<CartDto?> AddItemToCartAsync(int userId, AddCartItemDto itemDto)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: false);
            if (cart == null)
            {
                cart = await _cartRepository.CreateCartAsync(userId);
                // await _cartRepository.SaveChangesAsync(); // Will be saved with item
            }

            var product = await _productRepository.GetByIdAsync(itemDto.ProductId);
            if (product == null)
            {
                throw new ArgumentException("Product not found.");
            }

            var existingItem = await _cartRepository.GetCartItemAsync(cart.Id, itemDto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += itemDto.Quantity;
                // EF Core tracks existingItem, no explicit call to _cartRepository.UpdateCartItemAsync needed
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    DateAdded = DateTime.UtcNow
                };
                await _cartRepository.AddCartItemAsync(newItem);
            }

            cart.LastModifiedDate = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();

            var updatedCartWithDetails = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: true);
            return updatedCartWithDetails != null ? MapCartToDto(updatedCartWithDetails) : null;
        }

        public async Task<CartDto?> UpdateItemInCartAsync(int userId, long productId, UpdateCartItemDto itemDto)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: false);
            if (cart == null)
            {
                throw new InvalidOperationException("User cart not found.");
            }

            var existingItem = await _cartRepository.GetCartItemAsync(cart.Id, productId);
            if (existingItem == null)
            {
                throw new ArgumentException("Cart item not found.");
            }

            if (itemDto.Quantity <= 0)
            {
                await _cartRepository.RemoveCartItemAsync(existingItem);
            }
            else
            {
                existingItem.Quantity = itemDto.Quantity;
                // EF Core tracks existingItem
            }

            cart.LastModifiedDate = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();

            var updatedCartWithDetails = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: true);
            return updatedCartWithDetails != null ? MapCartToDto(updatedCartWithDetails) : null;
        }

        public async Task<bool> RemoveItemFromCartAsync(int userId, long productId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: false);
            if (cart == null) return false;

            var itemToRemove = await _cartRepository.GetCartItemAsync(cart.Id, productId);
            if (itemToRemove == null) return false;

            await _cartRepository.RemoveCartItemAsync(itemToRemove);
            cart.LastModifiedDate = DateTime.UtcNow;
            await _cartRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync(int userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: true); // Need items to remove
            if (cart == null || !cart.Items.Any())
            {
                return true; // Cart is already clear or doesn't exist
            }

            await _cartRepository.RemoveCartItemsAsync(cart.Items);
            cart.LastModifiedDate = DateTime.UtcNow; // Though cart might be deleted soon if empty
            await _cartRepository.SaveChangesAsync();
            return true;
        }

        private CartDto MapCartToDto(Cart cart)
        {
            var configuredServerBaseUrl = _configuration["AppUrls:ImageBaseUrl"]?.TrimEnd('/');
            if (string.IsNullOrEmpty(configuredServerBaseUrl))
            {
                Console.WriteLine("WARNING: AppUrls:ImageBaseUrl is not configured in appsettings.json (CartService). Defaulting to http://localhost:5270");
                configuredServerBaseUrl = "http://localhost:5270"; // Ensure matches your backend
            }
            var imagePathSegment = "/imageProduct";

            return new CartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items?.Select(item => new CartItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product?.Name ?? "N/A",
                    UnitPrice = item.Product?.Price ?? 0,
                    Quantity = item.Quantity,
                    ImageName = item.Product?.ImageName,
                    ImageUrl = !string.IsNullOrEmpty(item.Product?.ImageName)
                                 ? $"{configuredServerBaseUrl}{imagePathSegment}/{item.Product.ImageName}"
                                 : null
                }).ToList() ?? new List<CartItemDto>(),
                TotalPrice = cart.Items?.Sum(item => (item.Product?.Price ?? 0) * item.Quantity) ?? 0
            };
        }
    }
}