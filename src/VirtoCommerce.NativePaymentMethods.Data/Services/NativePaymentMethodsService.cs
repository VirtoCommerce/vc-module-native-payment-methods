using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class NativePaymentMethodsService : CrudService<NativePaymentMethod, NativePaymentMethodEntity, PaymentMethodChangingEvent, PaymentMethodChangedEvent>
    {
        private readonly IDynamicPaymentTypeService _dynamicPaymentTypeService;

        public NativePaymentMethodsService(Func<INativePaymentMethodsRepository> repositoryFactory,
            IPlatformMemoryCache platformMemoryCache,
            IEventPublisher eventPublisher,
            IDynamicPaymentTypeService dynamicPaymentTypeService)
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
            await base.AfterSaveChangesAsync(models, changedEntries);

            var methodsToUpdate = new List<NativePaymentMethod>();
            var methodsToDelete = new List<NativePaymentMethod>();

            foreach (var changedEntry in changedEntries)
            {
                // added active
                if (changedEntry.NewEntry.IsEnabled)
                {
                    methodsToUpdate.Add(changedEntry.NewEntry);
                }

                // disabled
                if (!changedEntry.NewEntry.IsEnabled && changedEntry.OldEntry.IsEnabled)
                {
                    methodsToDelete.Add(changedEntry.NewEntry);
                }
            }

            if (methodsToUpdate.Any())
            {
                await _dynamicPaymentTypeService.RegisterDynamicPaymentMethodsAsync(methodsToUpdate);
            }

            if (methodsToDelete.Any())
            {
                await _dynamicPaymentTypeService.DeleteDynamicPaymentMethodsAsync(methodsToDelete);
            }
        }

        protected override async Task AfterDeleteAsync(IEnumerable<NativePaymentMethod> models, IEnumerable<GenericChangedEntry<NativePaymentMethod>> changedEntries)
        {
            await base.AfterDeleteAsync(models, changedEntries);

            if (models.Any())
            {
                await _dynamicPaymentTypeService.DeleteDynamicPaymentMethodsAsync(models);
            }
        }
    }
}
