using E_commerce_backend.DTOs;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq; // For Select on errors
using System.Threading.Tasks;

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PasswordResetController : ControllerBase
    {
        private readonly IPasswordResetService _passwordResetService;

        public PasswordResetController(IPasswordResetService passwordResetService)
        {
            _passwordResetService = passwordResetService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _passwordResetService.SendResetTokenAsync(forgotPasswordDto.Email);

            if (!result.Succeeded)
            {
                // Log the error description if available
                Console.WriteLine($"Password reset email failed: {result.Errors.FirstOrDefault()?.Description}");
                // Return generic message to avoid leaking info
                return Ok(new { Message = "If an account with that email exists, a password reset link has been sent." });
                // Alternatively, return a BadRequest if email sending truly failed
                // return BadRequest(new { Message = result.Errors.FirstOrDefault()?.Description ?? "Failed to send reset email."});
            }

            // Always return OK to prevent email enumeration attacks
            return Ok(new { Message = "If an account with that email exists, a password reset link has been sent." });
        }

        // No GET endpoint needed to validate token for API, validation happens on POST
        // The React app gets the token/email from the URL query parameters

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _passwordResetService.ResetPasswordAsync(resetPasswordDto);

            if (!result.Succeeded)
            {
                // Provide specific errors back? Be careful about info leakage.
                // Common errors: Invalid token, Password complexity not met.
                return BadRequest(new { Errors = result.Errors.Select(e => e.Description) });
            }

            return Ok(new { Message = "Password has been successfully reset." });
        }
    }
}