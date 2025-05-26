using System.ComponentModel.DataAnnotations;

namespace E_commerce_backend.DTOs
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class CreateCategoryDto
    {
        [Required, StringLength(100)]
        public string Name { get; set; } = null!;
    }

    public class UpdateCategoryDto
    {
        [Required, StringLength(100)]
        public string Name { get; set; } = null!;
    }
}