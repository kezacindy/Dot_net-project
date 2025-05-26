using E_commerce_backend.Models;

namespace E_commerce_backend.Global
{
    public static class GlobalData
    {
        public static List<Product> Cart { get; set; } = new List<Product>();
    }
}
