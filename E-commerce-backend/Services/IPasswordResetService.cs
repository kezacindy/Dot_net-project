using E_commerce_backend.DTOs; // Use DTOs
using Microsoft.AspNetCore.Identity; // For IdentityResult
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface IPasswordResetService
    {
        Task<IdentityResult> SendResetTokenAsync(string email);
        Task<IdentityResult> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        // ValidateToken is implicitly done in ResetPasswordAsync by UserManager
    }
}