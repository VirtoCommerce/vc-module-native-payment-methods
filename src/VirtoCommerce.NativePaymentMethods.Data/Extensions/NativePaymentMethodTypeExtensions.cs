using System;
using System.Collections.Generic;
using System.Linq;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.NativePaymentMethods.Data.Extensions
{
    public static class NativePaymentMethodTypeExtensions
    {
        public static string NativePaymentMethodTypeName(string code)
        {
            var typeName = $"{ModuleConstants.NativePaymentMethodPrefix}_{code}";
            return typeName;
        }

        public static void RemoveTypeByName<TBaseType>(string typeName)
        {
            AbstractTypeFactory<TBaseType>.RemoveType(typeName);
        }

        // Need to compare existing dynamic types by name so that's why can't use the default AbstractTypeFactory<PaymentMethod>.RegisterType(type)
        // Dynamic types are recreated with the same name but as different Type objects, so the platform's
        // RegisterType (which deduplicates by type identity) won't catch duplicates.
        public static TypeInfo<TBaseType> RegisterType<TBaseType>(Type type)
        {
            var typeInfo = AbstractTypeFactory<TBaseType>.AllTypeInfos
                .FirstOrDefault(x => x.Type.Name == type.Name);

            return typeInfo ?? AbstractTypeFactory<TBaseType>.RegisterType(type);
        }
    }
}
