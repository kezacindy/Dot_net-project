using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce_backend.Models
{
    [Table("cart_items")]
    public class CartItem
    {
        [Key]
        [Column("cart_item_id")]
        public long Id { get; set; }

        [Required]
        [ForeignKey("Cart")]
        [Column("cart_id")]
        public Guid CartId { get; set; }

        public virtual Cart Cart { get; set; } = null!;

        [Required]
        [ForeignKey("Product")]
        [Column("product_id")]
        public long ProductId { get; set; }

        public virtual Product Product { get; set; } = null!;

        [Required]
        [Range(1, 100)] // Example quantity limit
        public int Quantity { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
    }
}