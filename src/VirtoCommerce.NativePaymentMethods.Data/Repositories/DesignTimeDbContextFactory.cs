using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace VirtoCommerce.NativePaymentMethods.Data.Repositories
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<NativePaymentMethodsDbContext>
    {
        public NativePaymentMethodsDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<NativePaymentMethodsDbContext>();

            builder.UseSqlServer("Data Source=(local);Initial Catalog=VirtoCommerce3;Persist Security Info=True;User ID=virto;Password=virto;MultipleActiveResultSets=True;Connect Timeout=30");

            return new NativePaymentMethodsDbContext(builder.Options);
        }
    }
}
