using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Core.Model.Search;
using VirtoCommerce.Platform.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.GenericCrud;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class DynamicPaymentTypeService : IDynamicPaymentTypeService
    {
        private readonly string _paymentMethodPrefix = "DynamicPaymentMethod";

        private readonly ISettingsRegistrar _settingsRegistrar;
        private readonly ISearchService<PaymentMethodsSearchCriteria, PaymentMethodsSearchResult, PaymentMethod> _paymentMethodSearchService;
        private readonly ICrudService<PaymentMethod> _paymentMethodCrudService;

        public DynamicPaymentTypeService(ISettingsRegistrar settingsRegistrar,
            ISearchService<PaymentMethodsSearchCriteria, PaymentMethodsSearchResult, PaymentMethod> paymentMethodsSearchService,
            ICrudService<PaymentMethod> paymentMethodsService)
        {
            _settingsRegistrar = settingsRegistrar;
            _paymentMethodSearchService = paymentMethodsSearchService;
            _paymentMethodCrudService = paymentMethodsService;
        }

        public void InitDynamicPaymentMethods(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            foreach (var nativePaymentMethod in nativePaymentMethods)
            {
                var typeName = $"{_paymentMethodPrefix}_{ nativePaymentMethod.Code}";
                var type = CreatePaymentMethod(typeName);

                var typeInfo = RegisterType<PaymentMethod>(type);

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

            GenericSearchCachingRegion<PaymentMethod>.ExpireRegion();

            var codes = nativePaymentMethods.Select(x => x.Code).ToList();

            if (codes.Any())
            {
                var criteria = new PaymentMethodsSearchCriteria
                {
                    Codes = codes,
                    WithoutTransient = true,
                };

                var methodsToUpdate = await _paymentMethodSearchService.SearchAsync(criteria);

                foreach (var persistentMethodId in methodsToUpdate.Results.Select(x => x.Id))
                {
                    GenericCachingRegion<PaymentMethod>.ExpireTokenForKey(persistentMethodId);
                }
            }
        }

        public async Task DeleteDynamicPaymentMethodsAsync(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            var codes = new List<string>();

            foreach (var nativePaymentMethod in nativePaymentMethods)
            {
                codes.Add(nativePaymentMethod.Code);

                var typeName = $"{_paymentMethodPrefix}_{ nativePaymentMethod.Code}";
                RemoveTypeByName<PaymentMethod>(typeName);
            }

            GenericSearchCachingRegion<PaymentMethod>.ExpireRegion();

            if (codes.Any())
            {
                var criteria = new PaymentMethodsSearchCriteria
                {
                    Codes = codes,
                    WithoutTransient = true,
                };

                var methodsToDelete = await _paymentMethodSearchService.SearchAsync(criteria);
                var ids = methodsToDelete.Results.Select(x => x.Id);

                await _paymentMethodCrudService.DeleteAsync(ids);
            }
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


        /// Need to compare existing dynamic types by name so that's why can't use the default AbstractTypeFactory<PaymentMethod>.RegisterType(type)
        private TypeInfo<BaseType> RegisterType<BaseType>(Type type)
        {
            TypeInfo<BaseType> typeInfo = null;

            if (AbstractTypeFactory<BaseType>.AllTypeInfos is IList<TypeInfo<BaseType>> types)
            {
                typeInfo = types.FirstOrDefault(x => x.Type.Name == type.Name);

                if (typeInfo == null)
                {
                    typeInfo = new TypeInfo<BaseType>(type);
                    types.Add(typeInfo);
                }
            }

            return typeInfo;
        }

        private void RemoveTypeByName<BaseType>(string typeName)
        {
            if (AbstractTypeFactory<BaseType>.AllTypeInfos is IList<TypeInfo<BaseType>> types)
            {
                var typeInfo = types.FirstOrDefault(x => x.Type.Name == typeName);

                if (typeInfo != null)
                {
                    types.Remove(typeInfo);
                }
            }
        }
    }
}
