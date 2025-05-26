using System.Collections.Generic;
using E_commerce_backend.Models;

namespace E_commerce_backend.Services
{
    public interface IReportingService
    {
        byte[] GenerateUsersPdf(IEnumerable<User> users);
        byte[] GenerateUsersCsv(IEnumerable<User> users);
    }
}
