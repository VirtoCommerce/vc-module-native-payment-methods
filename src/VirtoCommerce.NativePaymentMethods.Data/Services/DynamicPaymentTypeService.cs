using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Extensions;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Core.Model.Search;
using VirtoCommerce.PaymentModule.Core.Services;
using VirtoCommerce.Platform.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class DynamicPaymentTypeService : IDynamicPaymentTypeService
    {
        private readonly ISettingsRegistrar _settingsRegistrar;
        private readonly IPaymentMethodsSearchService _paymentMethodSearchService;
        private readonly IPaymentMethodsService _paymentMethodCrudService;

        public DynamicPaymentTypeService(ISettingsRegistrar settingsRegistrar,
            IPaymentMethodsSearchService paymentMethodsSearchService,
            IPaymentMethodsService paymentMethodsService)
        {
            _settingsRegistrar = settingsRegistrar;
            _paymentMethodSearchService = paymentMethodsSearchService;
            _paymentMethodCrudService = paymentMethodsService;
        }

        public void InitDynamicPaymentMethods(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            foreach (var nativePaymentMethod in nativePaymentMethods)
            {
                var typeName = NativePaymentMethodTypeExtensions.NativePaymentMethodTypeName(nativePaymentMethod.Code);
                var type = CreatePaymentMethod(typeName);

                var typeInfo = NativePaymentMethodTypeExtensions.RegisterType<PaymentMethod>(type);

                var name = nativePaymentMethod.Name;
                var code = nativePaymentMethod.Code;
                var descr = nativePaymentMethod.Description;
                var logo = nativePaymentMethod.LogoUrl;

                Func<PaymentMethod> factory = () =>
                {
                    var instance = Activator.CreateInstance(typeInfo.Type);
                    var payment = instance as NativePaymentMethod;

                    payment.Code = code;
                    payment.Name = name;
                    payment.Description = descr;
                    payment.LogoUrl = logo;

                    return payment;
                };

                typeInfo.WithFactory(factory);

                _settingsRegistrar.RegisterSettingsForType(ModuleConstants.Settings.General.AllSettings, typeName);
            }
        }

        public async Task RegisterDynamicPaymentMethodsAsync(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            InitDynamicPaymentMethods(nativePaymentMethods);

            var criteria = new PaymentMethodsSearchCriteria
            {
                Codes = nativePaymentMethods.Select(x => x.Code).ToList(),
                WithoutTransient = true,
            };

            var methodsToUpdate = await _paymentMethodSearchService.SearchNoCloneAsync(criteria);

            foreach (var persistentMethodId in methodsToUpdate.Results.Select(x => x.Id))
            {
                GenericCachingRegion<PaymentMethod>.ExpireTokenForKey(persistentMethodId);
            }

            GenericSearchCachingRegion<PaymentMethod>.ExpireRegion();
        }

        public async Task DeleteDynamicPaymentMethodsAsync(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            var codes = nativePaymentMethods.Select(x => x.Code).ToList();

            var criteria = new PaymentMethodsSearchCriteria
            {
                Codes = codes,
                WithoutTransient = true,
            };

            var methodsToDelete = await _paymentMethodSearchService.SearchNoCloneAsync(criteria);
            var ids = methodsToDelete.Results.Select(x => x.Id).ToList();
            await _paymentMethodCrudService.DeleteAsync(ids);

            foreach (var code in codes)
            {
                var typeName = NativePaymentMethodTypeExtensions.NativePaymentMethodTypeName(code);
                NativePaymentMethodTypeExtensions.RemoveTypeByName<PaymentMethod>(typeName);
            }

            GenericSearchCachingRegion<PaymentMethod>.ExpireRegion();
        }

        protected virtual Type CreatePaymentMethod(string className)
        {
            var assemblyName = new AssemblyName("DynamicPaymentMethodsAssembly");

            var assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
            var moduleBuilder = assemblyBuilder.DefineDynamicModule(assemblyName.Name);
            var typeBuilder = moduleBuilder.DefineType(className, TypeAttributes.Public);

            typeBuilder.SetParent(typeof(NativePaymentMethod));

            var type = typeBuilder.CreateType();

            return type;
        }
    }
}
