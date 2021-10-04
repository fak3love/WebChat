using System;

namespace WebChat.Domain.Interfaces
{
    public interface ILastPasswordUpdate
    {
        public DateTime LastPasswordUpdate { get; set; }
    }
}
