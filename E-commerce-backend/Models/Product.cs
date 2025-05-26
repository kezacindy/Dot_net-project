using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // Added for OrderItem/CartItem navigation

namespace E_commerce_backend.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public long Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = null!;

        [Required]
        [ForeignKey("Category")]
        [Column("category_id")]
        public int CategoryId { get; set; }

        public virtual Category Category { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(18,2)")] // Use decimal for price
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,3)")] // Optional: decimal for weight
        public decimal Weight { get; set; }

        [Column(TypeName = "nvarchar(max)")] // Allow longer descriptions
        public string Description { get; set; } = string.Empty; // Default to empty

        [StringLength(255)] // Max length for image name
        public string ImageName { get; set; } = string.Empty; // Default to empty

        // Navigation properties
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}