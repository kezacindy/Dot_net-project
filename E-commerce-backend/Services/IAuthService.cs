using E_commerce_backend.DTOs;
using E_commerce_backend.Models; // For User type
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public interface IAuthService
    {
        Task<(IdentityResult Result, User? CreatedUser)> RegisterAsync(RegisterDto registerDto, string role = "User");
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}