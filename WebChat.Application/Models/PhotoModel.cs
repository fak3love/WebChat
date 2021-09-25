using System;

namespace WebChat.Application.Models
{
    public class PhotoModel
    {
        public int Id { get; set; }
        public string Slug { get; set; }
        public string Src { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
