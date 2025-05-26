// src/Services/OrderService.cs
using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using E_commerce_backend.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly UserManager<User> _userManager;
        private readonly IProductRepository _productRepository;
        private readonly IConfiguration _configuration;

        public OrderService(
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            UserManager<User> userManager,
            IProductRepository productRepository,
            IConfiguration configuration)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _userManager = userManager;
            _productRepository = productRepository;
            _configuration = configuration;
        }

        public async Task<OrderDto?> CreateOrderFromCartAsync(int userId, CreateOrderDto orderDetails)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) throw new ArgumentException("User not found.");

            var cart = await _cartRepository.GetCartByUserIdAsync(userId, includeItems: true);
            if (cart == null || !cart.Items.Any())
            {
                throw new InvalidOperationException("Cannot create order from an empty cart.");
            }

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var cartItem in cart.Items)
            {
                var product = await _productRepository.GetByIdAsync(cartItem.ProductId); // Re-fetch product for current price
                if (product == null)
                {
                    Console.WriteLine($"Warning: Product ID {cartItem.ProductId} from cart not found during order creation for user {userId}. Skipping item.");
                    continue;
                }

                var orderItem = new OrderItem
                {
                    ProductId = product.Id,
                    Quantity = cartItem.Quantity,
                    UnitPrice = product.Price // Use current product price
                };
                orderItems.Add(orderItem);
                totalAmount += orderItem.UnitPrice * orderItem.Quantity;
            }

            if (!orderItems.Any())
            {
                throw new InvalidOperationException("No valid items from cart to create order.");
            }

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                OrderStatus = "Pending",
                ShippingAddress = orderDetails.ShippingAddress,
                BillingAddress = orderDetails.BillingAddress ?? orderDetails.ShippingAddress,
                OrderItems = orderItems
            };

            await _orderRepository.AddOrderAsync(order);
            // Order is added, items are linked. Now, clear the cart.
            await _cartRepository.RemoveCartItemsAsync(cart.Items); // Mark cart items for deletion
            cart.LastModifiedDate = DateTime.UtcNow;
            // Assuming a shared DbContext scope, SaveChangesAsync on one repository
            // will commit changes for both if they operate on the same context instance.
            // It's often cleaner to have a UnitOfWork pattern or call SaveChanges on the context
            // at the end of the service method if multiple repositories are involved.
            // For now, let's save via OrderRepository which should pick up CartRepository changes too.
            await _orderRepository.SaveChangesAsync();
            // If CartRepository SaveChanges is separate: await _cartRepository.SaveChangesAsync();

            // Re-fetch the order to ensure all related data is loaded for DTO mapping
            var createdOrderWithDetails = await _orderRepository.GetOrderByIdAsync(order.Id, userId);
            if (createdOrderWithDetails == null)
            {
                throw new Exception("Failed to retrieve created order for response mapping after saving.");
            }
            return MapOrderToDto(createdOrderWithDetails);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int userId, long orderId)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId, userId);
            return order == null ? null : MapOrderToDto(order);
        }

        public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _orderRepository.GetOrdersByUserIdAsync(userId);
            return orders.Select(MapOrderToDto).ToList();
        }

        private OrderDto MapOrderToDto(Order order)
        {
            var configuredServerBaseUrl = _configuration["AppUrls:ImageBaseUrl"]?.TrimEnd('/');
            if (string.IsNullOrEmpty(configuredServerBaseUrl))
            {
                Console.WriteLine("WARNING: AppUrls:ImageBaseUrl is not configured in appsettings.json (OrderService). Defaulting to http://localhost:5270");
                configuredServerBaseUrl = "http://localhost:5270"; // Ensure matches your backend
            }
            var imagePathSegment = "/imageProduct";

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                ShippingAddress = order.ShippingAddress,
                BillingAddress = order.BillingAddress,
                OrderItems = order.OrderItems?.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? "N/A",
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    ImageName = oi.Product?.ImageName,
                    ImageUrl = !string.IsNullOrEmpty(oi.Product?.ImageName)
                                ? $"{configuredServerBaseUrl}{imagePathSegment}/{oi.Product.ImageName}"
                                : null
                }).ToList() ?? new List<OrderItemDto>()
            };
        }
    }
}