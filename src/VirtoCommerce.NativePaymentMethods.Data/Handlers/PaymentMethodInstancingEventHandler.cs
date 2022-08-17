using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Extensions;
using VirtoCommerce.PaymentModule.Core.Events;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Handlers
{
    public class PaymentMethodInstancingEventHandler : IEventHandler<PaymentMethodInstancingEvent>
    {
        private readonly IDynamicPaymentTypeService _dynamicPaymentTypeService;
        private readonly ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> _searchService;

        public PaymentMethodInstancingEventHandler(IDynamicPaymentTypeService dynamicPaymentTypeService,
            ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod> searchService)
        {
            _dynamicPaymentTypeService = dynamicPaymentTypeService;
            _searchService = searchService;
        }

        public async Task Handle(PaymentMethodInstancingEvent message)
        {
            if (string.IsNullOrEmpty(message.PaymentMethodCode))
            {
                // syncronize all native in-memory and persistent methods (multi-instance issue)
                var criteria = new NativePaymentMethodsSearchCriteria { IsEnabled = true, };
                var nativeMethodsSearchResult = await _searchService.SearchAsync(criteria);

                // delete non-exiting
                DeleteNonExistingMethodTypes(nativeMethodsSearchResult.Results);

                // register non-registered
                RegisterMissingMethodTypes(nativeMethodsSearchResult.Results);
            }
            else
            {
                // register non-registered native method in memory is absent by type name (multi-instance issue)
                var criteria = new NativePaymentMethodsSearchCriteria { IsEnabled = true, Codes = new List<string> { message.PaymentMethodCode } };
                var nativeMethodsSearchResult = await _searchService.SearchAsync(criteria);

                RegisterMissingMethodTypes(nativeMethodsSearchResult.Results);
            }
        }

        private void RegisterMissingMethodTypes(IList<NativePaymentMethod> nativePaymentMethods)
        {
            var nativeMethodTypes = AbstractTypeFactory<NativePaymentMethod>.AllTypeInfos.ToList();
            var nativeMethodsToAdd = new List<NativePaymentMethod>();
            foreach (var nativeMethod in nativePaymentMethods)
            {
                var typeName = NativePaymentMethodTypeExtensions.NativePaymentMethodTypeName(nativeMethod.Code);
                var exists = nativeMethodTypes.Any(x => x.TypeName == typeName);
                if (!exists)
                {
                    nativeMethodsToAdd.Add(nativeMethod);
                }
            }

            _dynamicPaymentTypeService.InitDynamicPaymentMethods(nativeMethodsToAdd);
        }

        private static void DeleteNonExistingMethodTypes(IList<NativePaymentMethod> nativePaymentMethods)
        {
            var nativeMethodTypeNames = AbstractTypeFactory<NativePaymentMethod>.AllTypeInfos
                .Select(x => x.TypeName)
                .ToList();

            foreach (var nativeMethodTypeName in nativeMethodTypeNames)
            {
                var exists = nativePaymentMethods.Any(x => x.TypeName == nativeMethodTypeName);
                if (!exists)
                {
                    NativePaymentMethodTypeExtensions.RemoveTypeByName<PaymentMethod>(nativeMethodTypeName);
                }
            }
        }
    }
}
