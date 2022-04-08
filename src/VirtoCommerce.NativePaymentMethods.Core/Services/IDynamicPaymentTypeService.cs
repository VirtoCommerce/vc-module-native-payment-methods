using System.Collections.Generic;
using VirtoCommerce.NativePaymentMethods.Core.Models;

namespace VirtoCommerce.NativePaymentMethods.Core.Services
{
    public interface IDynamicPaymentTypeService
    {
        void RegisterDynamicPaymentMethods(IEnumerable<NativePaymentMethod> nativePaymentMethods);
    }
}
