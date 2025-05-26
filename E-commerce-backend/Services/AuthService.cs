using E_commerce_backend.DTOs;
using E_commerce_backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text; // Keep for other uses if any, but not directly for Base64 key
using System.Threading.Tasks;

namespace E_commerce_backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<User> _signInManager;

        public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, RoleManager<Role> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        // RegisterAsync remains the same as your provided version
        public async Task<(IdentityResult Result, User? CreatedUser)> RegisterAsync(RegisterDto registerDto, string role = "User")
        {
            var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if (userExists != null)
            {
                return (IdentityResult.Failed(new IdentityError { Code = "EmailExists", Description = "User with this email already exists." }), null);
            }

            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new Role { Name = role, NormalizedName = role.ToUpperInvariant(), ConcurrencyStamp = Guid.NewGuid().ToString() });
                }
                await _userManager.AddToRoleAsync(user, role);
                return (result, user); // Return the created user
            }

            return (result, null);
        }


        // LoginAsync remains the same as your provided version
        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
            {
                return null;
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, userRoles); // This calls the updated method below
            var expiration = DateTime.UtcNow.AddHours(double.Parse(_configuration["Jwt:DurationInHours"] ?? "1"));

            return new AuthResponseDto
            {
                Email = user.Email!,
                FirstName = user.FirstName,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                TokenExpiration = expiration, // Send as UTC or be consistent
                Roles = userRoles
            };
        }

        private JwtSecurityToken GenerateJwtToken(User user, IList<string> roles)
        {
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("firstName", user.FirstName) // Custom claim for firstName
            };

            foreach (var userRole in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var jwtKeyFromConfig = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKeyFromConfig))
            {
                // Log this error or throw a more specific configuration exception
                throw new InvalidOperationException("JWT Key is not configured in appsettings.json. Cannot generate token.");
            }

            // --- THIS IS THE CRITICAL CORRECTION ---
            // If your Jwt:Key in appsettings.json is Base64 encoded, decode it first.
            // This must match how the key is processed in Program.cs for token validation.
            var secretKeyBytes = Convert.FromBase64String(jwtKeyFromConfig);
            var authSigningKey = new SymmetricSecurityKey(secretKeyBytes);
            // --- END OF CRITICAL CORRECTION ---

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.UtcNow.AddHours(double.Parse(_configuration["Jwt:DurationInHours"] ?? "1")),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }
    }
}