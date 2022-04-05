using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core.Models;

namespace VirtoCommerce.NativePaymentMethods.Core.Services
{
    public interface IPaymentMethodsService
    {
        Task<IEnumerable<NativePaymentMethod>> GetAll();
        Task SaveChangesAsync(IEnumerable<NativePaymentMethod> models);
        Task DeleteAsync(IEnumerable<string> ids, bool softDelete = false);
    }
}
