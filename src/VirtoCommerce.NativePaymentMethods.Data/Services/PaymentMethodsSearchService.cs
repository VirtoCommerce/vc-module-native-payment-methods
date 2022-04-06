using System;
using System.Collections.Generic;
using System.Linq;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.GenericCrud;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.NativePaymentMethods.Data.Services
{
    public class PaymentMethodsSearchService : SearchService<PaymentMethodsSearchCriteria, PaymentMethodsSearchResult, NativePaymentMethod, NativePaymentMethodEntity>
    {
        public PaymentMethodsSearchService(Func<INativePaymentMethodsRepository> repositoryFactory, IPlatformMemoryCache platformMemoryCache, ICrudService<NativePaymentMethod> crudService)
            : base(repositoryFactory, platformMemoryCache, crudService)
        {
        }

        protected override IQueryable<NativePaymentMethodEntity> BuildQuery(IRepository repository, PaymentMethodsSearchCriteria criteria)
        {
            var query = ((INativePaymentMethodsRepository)repository).PaymentMethods;

            return query;
        }

        protected override IList<SortInfo> BuildSortExpression(PaymentMethodsSearchCriteria criteria)
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
