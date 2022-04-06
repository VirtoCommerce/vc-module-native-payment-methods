using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core.Events;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class PaymentMethodsService : CrudService<NativePaymentMethod, NativePaymentMethodEntity, PaymentMethodChangingEvent, PaymentMethodChangedEvent>
    {
        private new readonly Func<INativePaymentMethodsRepository> _repositoryFactory;

        public PaymentMethodsService(Func<INativePaymentMethodsRepository> repositoryFactory, IPlatformMemoryCache platformMemoryCache, IEventPublisher eventPublisher)
            : base(repositoryFactory, platformMemoryCache, eventPublisher)
        {
            _repositoryFactory = repositoryFactory;
        }

        protected override async Task<IEnumerable<NativePaymentMethodEntity>> LoadEntities(IRepository repository, IEnumerable<string> ids, string responseGroup)
        {
            var paymentMethodsRepository = repository as INativePaymentMethodsRepository;

            if (paymentMethodsRepository == null)
            {
                throw new ArgumentException(nameof(repository));
            }

            return await paymentMethodsRepository.GetPaymentMethodsByIdsAsync(ids);
        }
    }
}
