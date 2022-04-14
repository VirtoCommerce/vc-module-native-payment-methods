using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.NativePaymentMethods.Core.Models.Search
{
    public class NativePaymentMethodsSearchCriteria : SearchCriteriaBase
    {
        public bool? IsEnabled { get; set; }
    }
}
