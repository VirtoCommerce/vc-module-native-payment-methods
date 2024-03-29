using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.Platform.Core.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Core.Services
{
    public interface INativePaymentMethodSearchService : ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod>
    {
    }
}
