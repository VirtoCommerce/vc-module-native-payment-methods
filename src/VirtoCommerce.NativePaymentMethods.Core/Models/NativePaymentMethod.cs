using System;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.NativePaymentMethods.Core.Models
{
    public class NativePaymentMethod : AuditableEntity, ICloneable
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string LogoUrl { get; set; }
        public bool IsEnabled { get; set; }
        public object Clone()
        {
            var result = MemberwiseClone() as NativePaymentMethod;

            return result;
        }
    }
}
