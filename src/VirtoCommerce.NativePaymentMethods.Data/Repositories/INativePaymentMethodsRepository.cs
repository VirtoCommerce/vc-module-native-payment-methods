using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.NativePaymentMethods.Data.Repositories
{
    public interface INativePaymentMethodsRepository : IRepository
    {
        IQueryable<NativePaymentMethodEntity> PaymentMethods { get; }
        Task<IList<NativePaymentMethodEntity>> GetPaymentMethodsByIdsAsync(IEnumerable<string> ids);
    }
}
