using System;
using System.Collections.Generic;
using WebChat.Domain.Entities;

namespace WebChat.Domain.Collections
{
    public static class UserFriendStatuses
    {
        public const string Friends = "Friends";
        public const string FollowerTarget = "FollowerTarget";
        public const string TargetFollower = "TargetFollower";


        private static readonly Lazy<ICollection<UserFriendStatus>> _lazyStatuses = new(() =>
        {
            return new List<UserFriendStatus>()
            {
                new UserFriendStatus()
                {
                    Id = 1,
                    Name = Friends
                },
                new UserFriendStatus()
                {
                    Id = 2,
                    Name = FollowerTarget
                },
                new UserFriendStatus()
                {
                    Id = 3,
                    Name = TargetFollower
                }
            };
        }, true);

        public static ICollection<UserFriendStatus> Values => _lazyStatuses.Value;
    }
}
