using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.NativePaymentMethods.Core.Events;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class PaymentMethodsService : CrudService<NativePaymentMethod, NativePaymentMethodEntity, PaymentMethodChangingEvent, PaymentMethodChangedEvent>,
        IPaymentMethodsService
    {
        private new readonly Func<INativePaymentMethodsRepository> _repositoryFactory;

        public PaymentMethodsService(Func<INativePaymentMethodsRepository> repositoryFactory, IPlatformMemoryCache platformMemoryCache, IEventPublisher eventPublisher)
            : base(repositoryFactory, platformMemoryCache, eventPublisher)
        {
            _repositoryFactory = repositoryFactory;
        }

        protected override async Task<IEnumerable<NativePaymentMethodEntity>> LoadEntities(IRepository repository, IEnumerable<string> ids, string responseGroup)
        {
            return await ((INativePaymentMethodsRepository)repository).GetPaymentMethodsByIdsAsync(ids);
        }

        public async Task<IEnumerable<NativePaymentMethod>> GetAll()
        {
            using var repository = _repositoryFactory();
            var entities = await repository.PaymentMethods.ToListAsync();

            var result = entities.Select(x =>
            {
                var paymentMethod = AbstractTypeFactory<NativePaymentMethod>.TryCreateInstance();
                x.ToModel(paymentMethod);

                return paymentMethod;
            });

            return result;
        }
    }
}
