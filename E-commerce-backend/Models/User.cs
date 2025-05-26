using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic; // Added for Order/Cart navigation

namespace E_commerce_backend.Models
{
    public class User : IdentityUser<int> // Use int as the primary key type
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = null!;

        // PasswordHash is handled by IdentityUser
        // ResetToken is handled by Identity's token providers

        // Navigation properties
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual Cart? Cart { get; set; } // A user can have one cart
    }
}