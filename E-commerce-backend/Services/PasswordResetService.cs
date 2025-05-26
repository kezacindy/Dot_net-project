using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration; // For generating reset link URL
using System;
using System.Threading.Tasks;
using System.Web; // For UrlEncode

namespace E_commerce_backend.Services
{
    public class PasswordResetService : IPasswordResetService
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public PasswordResetService(UserManager<User> userManager, IEmailService emailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
        }

        public async Task<IdentityResult> SendResetTokenAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                // Don't reveal if the user doesn't exist for security
                // Return success but don't send email or return a specific non-revealing error code
                return IdentityResult.Success; // Or a custom result
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = HttpUtility.UrlEncode(token); // Encode token for URL
            var encodedEmail = HttpUtility.UrlEncode(email); // Encode email for URL

            // Get base URL from configuration
            var frontendBaseUrl = _configuration["AppUrls:FrontendBaseUrl"] ?? "http://localhost:3000"; // Default for local dev
            var resetLink = $"{frontendBaseUrl}/reset-password?token={encodedToken}&email={encodedEmail}";


            try
            {
                await _emailService.SendEmailAsync(
                   email,
                   "Reset Your Password",
                   $"Please reset your password by clicking here: <a href='{resetLink}'>Reset Password</a>");

                return IdentityResult.Success;
            }
            catch (Exception ex) // Catch potential email sending errors
            {
                // Log the exception (using ILogger is better)
                Console.WriteLine($"Error sending password reset email: {ex.Message}");
                return IdentityResult.Failed(new IdentityError { Description = "Failed to send reset email." });
            }
        }

        public async Task<IdentityResult> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                // Don't reveal user doesn't exist
                return IdentityResult.Failed(new IdentityError { Description = "Password reset failed." });
            }

            // UserManager handles token validation internally
            // No need to call a separate ValidateToken method here
            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);

            return result;
        }
    }
}