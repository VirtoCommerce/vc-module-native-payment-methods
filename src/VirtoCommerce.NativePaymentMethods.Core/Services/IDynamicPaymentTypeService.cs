using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core.Models;

namespace VirtoCommerce.NativePaymentMethods.Core.Services
{
    public interface IDynamicPaymentTypeService
    {
        void InitDynamicPaymentMethods(IEnumerable<NativePaymentMethod> nativePaymentMethods);
        Task RegisterDynamicPaymentMethodsAsync(IEnumerable<NativePaymentMethod> nativePaymentMethods);
        Task DeleteDynamicPaymentMethodsAsync(IEnumerable<NativePaymentMethod> nativePaymentMethods);
    }
}
