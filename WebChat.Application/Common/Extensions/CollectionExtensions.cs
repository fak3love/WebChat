using System.Collections.Generic;

namespace WebChat.Application.Common.Extensions
{
    public static class CollectionExtensions
    {
        public static ICollection<T> Join<T>(this ICollection<T> collection, ICollection<T> joinCollection)
        {
            var newList = new List<T>(collection);
            newList.AddRange(joinCollection);

            return newList;
        }
    }
}
