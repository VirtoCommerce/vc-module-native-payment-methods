using System.Collections.Generic;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.Platform.Core.Events;

namespace VirtoCommerce.NativePaymentMethods.Core.Events
{
    public class PaymentMethodChangedEvent : GenericChangedEntryEvent<NativePaymentMethod>
    {
        public PaymentMethodChangedEvent(IEnumerable<GenericChangedEntry<NativePaymentMethod>> changedEntries)
            : base(changedEntries)
        {
        }
    }
}
