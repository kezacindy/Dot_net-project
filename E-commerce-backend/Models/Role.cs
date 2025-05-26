using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.Models
{
    public class Role : IdentityRole<int> // Use int as the primary key type
    {
        // Inherits Id, Name, NormalizedName, ConcurrencyStamp from IdentityRole<int>
        // No need for custom properties unless specifically required.

        // The relationship to Users is managed by Identity through IdentityUserRole<int>
        // Do NOT add ICollection<User> Users here unless you manually configure the mapping, which conflicts with Identity.
    }
}