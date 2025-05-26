namespace E_commerce_backend.DTO
{
    public class ProductDTO
    {
        public long Id { get; set; }
        public string Name { get; set; } = null!;
        public int CategoryId { get; set; }
        public double Price { get; set; }
        public double Weight { get; set; }
        public string Description { get; set; } = null!;
        public string ImageName { get; set; } = null!;
    }
}
