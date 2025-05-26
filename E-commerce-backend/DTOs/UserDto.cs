// DTOs/UserDto.cs
using System.Collections.Generic; // For IList if you add Roles

namespace E_commerce_backend.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Email { get; set; }
        // public IList<string> Roles { get; set; } = new List<string>(); // Optional
        // Add other non-sensitive properties you want to send to the admin frontend
    }
}