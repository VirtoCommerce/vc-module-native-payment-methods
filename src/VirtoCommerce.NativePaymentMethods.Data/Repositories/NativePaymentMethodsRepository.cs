using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.NativePaymentMethods.Data.Models;
using VirtoCommerce.Platform.Core.Domain;
using VirtoCommerce.Platform.Data.Infrastructure;

namespace VirtoCommerce.NativePaymentMethods.Data.Repositories
{
    public class NativePaymentMethodsRepository : DbContextRepositoryBase<NativePaymentMethodsDbContext>, INativePaymentMethodsRepository
    {
        public NativePaymentMethodsRepository(NativePaymentMethodsDbContext dbContext, IUnitOfWork unitOfWork = null)
            : base(dbContext, unitOfWork)
        {
        }

        public IQueryable<NativePaymentMethodEntity> PaymentMethods => DbContext.Set<NativePaymentMethodEntity>();

        public virtual async Task<IList<NativePaymentMethodEntity>> GetPaymentMethodsByIdsAsync(IEnumerable<string> ids)
        {
            var result = await PaymentMethods.Where(x => ids.Contains(x.Id)).ToListAsync();

            return result;
        }
    }
}
