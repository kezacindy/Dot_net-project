using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_commerce_backend.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("order_item_id")]
        public long Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        [Column("order_id")]
        public long OrderId { get; set; }

        public virtual Order Order { get; set; } = null!;

        [Required]
        [ForeignKey("Product")]
        [Column("product_id")]
        public long ProductId { get; set; }

        public virtual Product Product { get; set; } = null!;

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; } // Price at the time of order
    }
}