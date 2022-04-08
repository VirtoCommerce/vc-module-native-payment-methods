using System;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.Platform.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class DynamicPaymentTypeService : IDynamicPaymentTypeService
    {
        private readonly ISettingsRegistrar _settingsRegistrar;

        public DynamicPaymentTypeService(ISettingsRegistrar settingsRegistrar)
        {
            _settingsRegistrar = settingsRegistrar;
        }

        public void RegisterDynamicPaymentMethods(IEnumerable<NativePaymentMethod> nativePaymentMethods)
        {
            foreach (var nativePaymentMethod in nativePaymentMethods)
            {
                var typeName = $"DynamicPaymentMethod_{ nativePaymentMethod.Code}";
                var type = CreatePaymentMethod(typeName);

                var typeInfo = AbstractTypeFactory<PaymentMethod>.RegisterType(type); //need Override(type, type) extention
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

                _settingsRegistrar.RegisterSettingsForType(PaymentModule.Core.ModuleConstants.Settings.DefaultManualPaymentMethod.AllSettings, typeName);
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
