using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.DTOs
{
    public class RegisterDto
    {
        [Required, StringLength(100)]
        public string FirstName { get; set; } = null!;
        [Required, StringLength(100)]
        public string LastName { get; set; } = null!;
        [Required, EmailAddress, StringLength(128)]
        public string Email { get; set; } = null!;
        [Required, StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = null!;
    }

    public class LoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }

    public class AuthResponseDto
    {
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime TokenExpiration { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class ForgotPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
    }

    public class ResetPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        [Required]
        public string Token { get; set; } = null!;
        [Required, StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = null!;
    }
}