using System;
using System.Collections.Generic;
using WebChat.Domain.Entities;

namespace WebChat.Domain.Collections
{
    public static class UserFriendStatuses
    {
        private static readonly Lazy<ICollection<UserFriendStatus>> _lazyStatuses = new Lazy<ICollection<UserFriendStatus>>(() =>
        {
            return new List<UserFriendStatus>()
            {
                new UserFriendStatus()
                {
                    Id = 1,
                    Name = "Friends"
                },
                new UserFriendStatus()
                {
                    Id = 2,
                    Name = "Follower-Subscriber"
                }
            };
        }, true);

        public static ICollection<UserFriendStatus> Value => _lazyStatuses.Value;
    }
}
