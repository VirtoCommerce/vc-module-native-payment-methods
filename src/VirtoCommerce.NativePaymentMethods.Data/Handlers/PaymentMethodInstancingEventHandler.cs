using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Extensions;
using VirtoCommerce.PaymentModule.Core.Events;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;

namespace VirtoCommerce.NativePaymentMethods.Data.Handlers
{
    public class PaymentMethodInstancingEventHandler : IEventHandler<PaymentMethodInstancingEvent>
    {
        private readonly IDynamicPaymentTypeService _dynamicPaymentTypeService;
        private readonly INativePaymentMethodsSearchService _searchService;

        public PaymentMethodInstancingEventHandler(IDynamicPaymentTypeService dynamicPaymentTypeService,
            INativePaymentMethodsSearchService searchService)
        {
            _dynamicPaymentTypeService = dynamicPaymentTypeService;
            _searchService = searchService;
        }

        public async Task Handle(PaymentMethodInstancingEvent message)
        {
            if (message.PaymentMethodCodes.IsNullOrEmpty())
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
                var criteria = new NativePaymentMethodsSearchCriteria { IsEnabled = true, Codes = new List<string>(message.PaymentMethodCodes) };
                var nativeMethodsSearchResult = await _searchService.SearchAsync(criteria);

                RegisterMissingMethodTypes(nativeMethodsSearchResult.Results);
            }
        }

        private void RegisterMissingMethodTypes(IList<NativePaymentMethod> nativePaymentMethods)
        {
            var nativeMethodTypeNames = GetNativePaymentMethodTypeNames();
            var nativeMethodsToAdd = new List<NativePaymentMethod>();
            foreach (var nativeMethod in nativePaymentMethods)
            {
                var typeName = NativePaymentMethodTypeExtensions.NativePaymentMethodTypeName(nativeMethod.Code);
                var exists = nativeMethodTypeNames.Any(x => x == typeName);
                if (!exists)
                {
                    nativeMethodsToAdd.Add(nativeMethod);
                }
            }

            _dynamicPaymentTypeService.InitDynamicPaymentMethods(nativeMethodsToAdd);
        }

        private static void DeleteNonExistingMethodTypes(IList<NativePaymentMethod> nativePaymentMethods)
        {
            var nativeMethodTypeNames = GetNativePaymentMethodTypeNames();
            var persistentnativeMethodTypeNames = nativePaymentMethods
                .Select(x => NativePaymentMethodTypeExtensions.NativePaymentMethodTypeName(x.Code))
                .ToList();

            foreach (var typeName in nativeMethodTypeNames)
            {
                var exists = persistentnativeMethodTypeNames.Any(x => x == typeName);
                if (!exists)
                {
                    NativePaymentMethodTypeExtensions.RemoveTypeByName<PaymentMethod>(typeName);
                }
            }
        }

        private static List<string> GetNativePaymentMethodTypeNames()
        {
            return AbstractTypeFactory<PaymentMethod>.AllTypeInfos
                .Select(x => x.TypeName)
                .Where(x => x.StartsWith(ModuleConstants.NativePaymentMethodPrefix))
                .ToList();
        }
    }
}
