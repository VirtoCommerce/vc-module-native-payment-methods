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
            if (AbstractTypeFactory<TBaseType>.AllTypeInfos is IList<TypeInfo<TBaseType>> types)
            {
                var typeInfo = types.FirstOrDefault(x => x.Type.Name == typeName);

                if (typeInfo != null)
                {
                    types.Remove(typeInfo);
                }
            }
        }

        // Need to compare existing dynamic types by name so that's why can't use the default AbstractTypeFactory<PaymentMethod>.RegisterType(type)
        public static TypeInfo<TBaseType> RegisterType<TBaseType>(Type type)
        {
            TypeInfo<TBaseType> typeInfo = null;

            if (AbstractTypeFactory<TBaseType>.AllTypeInfos is IList<TypeInfo<TBaseType>> types)
            {
                typeInfo = types.FirstOrDefault(x => x.Type.Name == type.Name);

                if (typeInfo == null)
                {
                    typeInfo = new TypeInfo<TBaseType>(type);
                    types.Add(typeInfo);
                }
            }

            return typeInfo;
        }
    }
}
