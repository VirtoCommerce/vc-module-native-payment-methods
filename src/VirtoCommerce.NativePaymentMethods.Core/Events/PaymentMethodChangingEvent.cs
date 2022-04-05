using System.Collections.Generic;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.Platform.Core.Events;

namespace VirtoCommerce.NativePaymentMethods.Core.Events
{
    public class PaymentMethodChangingEvent : GenericChangedEntryEvent<NativePaymentMethod> 
    {
        public PaymentMethodChangingEvent(IEnumerable<GenericChangedEntry<NativePaymentMethod>> changedEntries)
            : base(changedEntries)
        {
        }
    }
}
