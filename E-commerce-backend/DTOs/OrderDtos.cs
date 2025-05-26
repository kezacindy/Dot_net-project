using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.DTOs
{
    public class OrderDto
    {
        public long Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; } = null!;
        public string ShippingAddress { get; set; } = null!;
        public string? BillingAddress { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    }

    public class OrderItemDto
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!; // Include product name
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageName { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CreateOrderDto // Request from cart/checkout
    {
        [Required, StringLength(200)]
        public string ShippingAddress { get; set; } = null!;
        [StringLength(200)]
        public string? BillingAddress { get; set; } // Optional
                                                    // Payment details might go here or be handled separately
    }
}