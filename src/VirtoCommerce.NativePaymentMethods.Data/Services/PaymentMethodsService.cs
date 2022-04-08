using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.NativePaymentMethods.Core.Events;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class PaymentMethodsService : CrudService<NativePaymentMethod, NativePaymentMethodEntity, PaymentMethodChangingEvent, PaymentMethodChangedEvent>
    {
        private readonly IDynamicPaymentTypeService _dynamicPaymentTypeService;

        public PaymentMethodsService(Func<INativePaymentMethodsRepository> repositoryFactory,
            IPlatformMemoryCache platformMemoryCache,
            IEventPublisher eventPublisher,
            IDynamicPaymentTypeService dynamicPaymentTypeService,
            ISettingsRegistrar settings)
            : base(repositoryFactory, platformMemoryCache, eventPublisher)
        {
            _dynamicPaymentTypeService = dynamicPaymentTypeService;
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

        protected override async Task AfterSaveChangesAsync(IEnumerable<NativePaymentMethod> models, IEnumerable<GenericChangedEntry<NativePaymentMethod>> changedEntries)
        {
            _dynamicPaymentTypeService.RegisterDynamicPaymentMethods(models);

            await base.AfterSaveChangesAsync(models, changedEntries);
        }
    }
}
