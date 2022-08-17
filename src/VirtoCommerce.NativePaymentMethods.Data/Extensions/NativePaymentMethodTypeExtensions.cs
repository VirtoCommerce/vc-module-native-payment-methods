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

        public static void RemoveTypeByName<BaseType>(string typeName)
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

        /// Need to compare existing dynamic types by name so that's why can't use the default AbstractTypeFactory<PaymentMethod>.RegisterType(type)
        public static TypeInfo<BaseType> RegisterType<BaseType>(Type type)
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
    }
}
