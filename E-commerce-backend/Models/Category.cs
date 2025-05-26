using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic; // <--- Make sure this using is present

namespace E_commerce_backend.Models
{
    [Table("categories")] // Optional: Specify table name if different from DbSet name
    public class Category
    {
        [Key]
        [Column("category_id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        // --- THIS PROPERTY IS NEEDED ---
        // Navigation property for products in this category
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
        // --- END OF NEEDED PROPERTY ---
    }
}