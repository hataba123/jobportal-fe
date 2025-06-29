using System.ComponentModel.DataAnnotations;

namespace JobPortal.API.DTOs
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Excerpt { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string Category { get; set; } = string.Empty;
        public string[] Tags { get; set; } = Array.Empty<string>();
        public DateTime PublishedAt { get; set; }
        public string ReadTime { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Likes { get; set; }
        public bool Featured { get; set; }
        public string Image { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public BlogAuthorDto Author { get; set; } = null!;
    }
    
    public class BlogAuthorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
    
    public class CreateBlogDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Excerpt { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? Slug { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;
        
        public string[] Tags { get; set; } = Array.Empty<string>();
        
        [StringLength(20)]
        public string ReadTime { get; set; } = string.Empty;
        
        public bool Featured { get; set; } = false;
        
        [StringLength(500)]
        public string Image { get; set; } = string.Empty;
        
        public int AuthorId { get; set; }
    }
    
    public class UpdateBlogDto
    {
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(500)]
        public string? Excerpt { get; set; }
        
        public string? Content { get; set; }
        
        [StringLength(100)]
        public string? Slug { get; set; }
        
        [StringLength(50)]
        public string? Category { get; set; }
        
        public string[]? Tags { get; set; }
        
        [StringLength(20)]
        public string? ReadTime { get; set; }
        
        public bool? Featured { get; set; }
        
        [StringLength(500)]
        public string? Image { get; set; }
    }
    
    public class BlogSearchDto
    {
        public string? Search { get; set; }
        public string? Category { get; set; }
        public string? Sort { get; set; } // "newest", "popular", "trending"
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
    }
    
    public class BlogResponseDto
    {
        public List<BlogDto> Blogs { get; set; } = new List<BlogDto>();
        public int Total { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalPages { get; set; }
    }
    
    public class BlogCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Count { get; set; }
    }
    
    public class BlogStatsDto
    {
        public int TotalBlogs { get; set; }
        public int TotalAuthors { get; set; }
        public int TotalViews { get; set; }
        public int TotalLikes { get; set; }
    }
    
    public class CreateBlogAuthorDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Avatar { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Role { get; set; } = string.Empty;
    }
    
    public class UpdateBlogAuthorDto
    {
        [StringLength(100)]
        public string? Name { get; set; }
        
        [StringLength(500)]
        public string? Avatar { get; set; }
        
        [StringLength(100)]
        public string? Role { get; set; }
    }
} 