using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
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
    public class NativePaymentMethodsService : CrudService<NativePaymentMethod, NativePaymentMethodEntity, PaymentMethodChangingEvent, PaymentMethodChangedEvent>, INativePaymentMethodsService
    {
        private readonly IDynamicPaymentTypeService _dynamicPaymentTypeService;
        private readonly AbstractValidator<NativePaymentMethod> _nativePaymentMethodValidator;

        public NativePaymentMethodsService(Func<INativePaymentMethodsRepository> repositoryFactory,
            IPlatformMemoryCache platformMemoryCache,
            IEventPublisher eventPublisher,
            IDynamicPaymentTypeService dynamicPaymentTypeService,
            AbstractValidator<NativePaymentMethod> nativePaymentMethodValidator)
            : base(repositoryFactory, platformMemoryCache, eventPublisher)
        {
            _dynamicPaymentTypeService = dynamicPaymentTypeService;
            _nativePaymentMethodValidator = nativePaymentMethodValidator;
        }

        protected override Task<IList<NativePaymentMethodEntity>> LoadEntities(IRepository repository, IList<string> ids, string responseGroup)
        {
            var paymentMethodsRepository = repository as INativePaymentMethodsRepository;

            if (paymentMethodsRepository == null)
            {
                throw new ArgumentException(nameof(repository));
            }

            return paymentMethodsRepository.GetPaymentMethodsByIdsAsync(ids);
        }

        protected override Task BeforeSaveChanges(IList<NativePaymentMethod> models)
        {
            foreach (var method in models)
            {
                _nativePaymentMethodValidator.ValidateAndThrow(method);
            }
            return base.BeforeSaveChanges(models);
        }

        protected override async Task AfterSaveChangesAsync(IList<NativePaymentMethod> models, IList<GenericChangedEntry<NativePaymentMethod>> changedEntries)
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

        protected override async Task AfterDeleteAsync(IList<NativePaymentMethod> models, IList<GenericChangedEntry<NativePaymentMethod>> changedEntries)
        {
            await base.AfterDeleteAsync(models, changedEntries);

            if (models.Any())
            {
                await _dynamicPaymentTypeService.DeleteDynamicPaymentMethodsAsync(models);
            }
        }
    }
}
