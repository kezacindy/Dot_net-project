using E_commerce_backend.DTOs;
using E_commerce_backend.Services; // Ensure IAuthService is accessible
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
// Potentially add: using E_commerce_backend.Models; if you need User type here
// Potentially add: using Microsoft.AspNetCore.Identity; for IdentityResult type hints

namespace E_commerce_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService; // Optional

        public AuthController(IAuthService authService, IEmailService emailService)
        {
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Destructure the tuple returned by RegisterAsync
            var (identityResult, createdUser) = await _authService.RegisterAsync(registerDto);
            // Alternatively: var registrationOutcome = await _authService.RegisterAsync(registerDto);

            // Access Succeeded and Errors from the identityResult part of the tuple
            if (!identityResult.Succeeded) // Corrected: Access .Succeeded on identityResult
            {
                return BadRequest(new { Errors = identityResult.Errors.Select(e => e.Description) }); // Corrected: Access .Errors on identityResult
            }

            // Optional: Use createdUser if needed (e.g., to get the ID or send a specific welcome email)
            // if (createdUser != null)
            // {
            //    await _emailService.SendEmailAsync(createdUser.Email, "Welcome!", $"Thanks for registering, {createdUser.FirstName}!");
            // }


            return StatusCode(201, new { Message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var authResponse = await _authService.LoginAsync(loginDto);

            if (authResponse == null)
            {
                return Unauthorized(new { Message = "Invalid email or password." });
            }

            return Ok(authResponse);
        }
    }
}