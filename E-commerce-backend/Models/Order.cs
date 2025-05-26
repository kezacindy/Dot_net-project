using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce_backend.Models
{
    [Table("orders")]
    public class Order
    {
        [Key]
        [Column("order_id")]
        public long Id { get; set; }

        [Required]
        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        public virtual User User { get; set; } = null!;

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderStatus { get; set; } = "Pending"; // e.g., Pending, Processing, Shipped, Delivered, Cancelled

        // Shipping / Billing Address (Consider separate Address entity or embed here)
        [Required]
        [StringLength(200)]
        public string ShippingAddress { get; set; } = null!;

        [StringLength(200)]
        public string BillingAddress { get; set; } = null!; // Optional, can default to shipping

        // Navigation property for order items
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}