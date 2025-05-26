using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.DTOs
{
    public class CartDto
    {
        public Guid Id { get; set; }
        public int UserId { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();
        public decimal TotalPrice { get; set; }
    }

    public class CartItemDto
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string? ImageName { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class AddCartItemDto
    {
        [Required]
        public long ProductId { get; set; }
        [Required, Range(1, 100)]
        public int Quantity { get; set; }
    }

    public class UpdateCartItemDto
    {
        [Required, Range(1, 100)]
        public int Quantity { get; set; }
    }
}