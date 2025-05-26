using E_commerce_backend.Data;
using E_commerce_backend.Models;
using E_commerce_backend.Repositories;
using E_commerce_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models; // For Swagger
using System; // For Exception in test endpoint
using Microsoft.AspNetCore.Builder; // For WebApplication
using Microsoft.Extensions.DependencyInjection; // For IServiceCollection
using Microsoft.Extensions.Hosting; // For IHostEnvironment

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// --- Configure CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        var allowedOrigins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" };
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
        // .AllowCredentials(); // Add if you need to send cookies/auth headers with CORS from frontend
    });
});

// --- Database and Identity Setup ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, Role>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    // options.SignIn.RequireConfirmedAccount = false; // Default is false
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// --- Configure JWT and Google Authentication ---
builder.Services.AddAuthentication(options =>
{
    // Set JWT as the default scheme for API authentication
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // For API challenges
    // options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme; // Also often set
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options => // Explicitly name the scheme
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = !builder.Environment.IsDevelopment(); // False in Dev, True in Prod
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidAudience = configuration["Jwt:Audience"],
        ValidIssuer = configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Convert.FromBase64String(configuration["Jwt:Key"]!)) // Assuming Key is Base64
    };
})
.AddGoogle(options => // Google can be used as an external login provider
{
    options.ClientId = configuration["Authentication:Google:ClientId"]!;
    options.ClientSecret = configuration["Authentication:Google:ClientSecret"]!;
    // options.CallbackPath = "/signin-google"; // Default, ensure your Google Cloud Console is configured for this
});


// --- Repository and Service Registration ---
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
// builder.Services.AddScoped<IRoleRepository, RoleRepository>(); // Not needed if using RoleManager directly

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPasswordResetService, PasswordResetService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
// builder.Services.AddScoped<IDbInitializer, DbInitializer>(); // If you have a DB seeder

// --- App Services ---
builder.Services.AddControllers(); // Changed from AddControllersWithViews if this is a pure API
// If you still need Views for some reason (e.g. error pages served by backend, or mixed app):
// builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "E-Commerce API",
        Version = "v1"
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field (e.g. Bearer YOUR_TOKEN)",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey, // Or Http with Scheme = "bearer" and BearerFormat = "JWT"
        Scheme = "Bearer"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// --- Build the App ---
var app = builder.Build();

// --- Middleware Pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "E-Commerce API v1");
        // c.RoutePrefix = string.Empty; // To serve Swagger UI at app root
    });
}
else
{
    // Consider a more specific error handling page or middleware for production
    app.UseExceptionHandler("/error"); // Ensure you have an /error endpoint or page if using this
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serves files from wwwroot
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins); // IMPORTANT: Before Authentication and Authorization

app.UseAuthentication(); // Enable authentication features
app.UseAuthorization();  // Enable authorization features

// --- Test Endpoints (Keep for quick checks during development) ---
app.MapGet("/test", () => "API is running").ExcludeFromDescription(); // Exclude from Swagger if desired
app.MapGet("/test-db", async (ApplicationDbContext db) =>
{
    try { await db.Database.CanConnectAsync(); return Results.Ok("Database connection successful"); }
    catch (Exception ex) { return Results.Problem($"Database connection failed: {ex.Message}"); }
}).ExcludeFromDescription();
app.MapGet("/test-serialization", () => new { Message = "Test", Data = new { Id = 1, Name = "Test" } }).ExcludeFromDescription();


app.MapControllers(); // For attribute-routed API controllers

// Remove or keep MapControllerRoute based on whether you serve MVC views from this backend
// For a pure API backend serving a React frontend, this is often not needed.
/*
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
*/

// Seed database if you have an initializer
// async Task SeedDatabaseAsync(IHost webApp) { ... }
// await SeedDatabaseAsync(app);


app.Run();