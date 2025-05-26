using E_commerce_backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace E_commerce_backend.Repositories
{
    public interface IRoleRepository
    {
        DbSet<Role> GetRoles();
        Task<Role> GetByIdAsync(int id);
    }
}
