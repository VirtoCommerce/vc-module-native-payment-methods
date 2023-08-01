using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.GenericCrud;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class NativePaymentMethodSearchService : SearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod, NativePaymentMethodEntity>, INativePaymentMethodSearchService
    {
        public NativePaymentMethodSearchService(
            Func<INativePaymentMethodsRepository> repositoryFactory,
            IPlatformMemoryCache platformMemoryCache,
            INativePaymentMethodService crudService,
            IOptions<CrudOptions> crudOptions)
            : base(repositoryFactory, platformMemoryCache, crudService, crudOptions)
        {
        }

        protected override IQueryable<NativePaymentMethodEntity> BuildQuery(IRepository repository, NativePaymentMethodsSearchCriteria criteria)
        {
            var query = ((INativePaymentMethodsRepository)repository).PaymentMethods;

            if (criteria.IsEnabled.HasValue)
            {
                query = query.Where(x => x.IsEnabled == criteria.IsEnabled.Value);
            }

            if (!criteria.Codes.IsNullOrEmpty())
            {
                query = query.Where(x => criteria.Codes.Contains(x.Code));
            }

            return query;
        }

        protected override IList<SortInfo> BuildSortExpression(NativePaymentMethodsSearchCriteria criteria)
        {
            var sortInfos = criteria.SortInfos;
            if (sortInfos.IsNullOrEmpty())
            {
                sortInfos = new[]
                {
                    new SortInfo { SortColumn = nameof(NativePaymentMethodEntity.Code) }
                };
            }

            return sortInfos;
        }
    }
}
