using System;

namespace WebChat.Application.Models
{
    public class PhotoInfoModel
    {
        public string Slug { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Likes { get; set; }
        public bool Liked { get; set; }
        public bool Editable { get; set; }
    }
}
