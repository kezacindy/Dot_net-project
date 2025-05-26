using E_commerce_backend.Data;
using E_commerce_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public DbSet<Role> GetRoles()
        {
            return _context.Roles;
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }
    }
}
