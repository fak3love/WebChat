using System;
using WebChat.Domain.Interfaces;

namespace WebChat.Domain.Common
{
    public abstract class BaseAuditable : IAuditable
    {
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
