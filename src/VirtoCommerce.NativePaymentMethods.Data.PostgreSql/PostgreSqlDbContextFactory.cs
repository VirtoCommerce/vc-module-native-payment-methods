using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;

namespace VirtoCommerce.NativePaymentMethods.Data.PostgreSql
{
    public class PostgreSqlDbContextFactory : IDesignTimeDbContextFactory<NativePaymentMethodsDbContext>
    {
        public NativePaymentMethodsDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<NativePaymentMethodsDbContext>();
            var connectionString = args.Any() ? args[0] : "User ID = postgres; Password = password; Host = localhost; Port = 5432; Database = virtocommerce3;";

            builder.UseNpgsql(
                connectionString,
                db => db.MigrationsAssembly(typeof(PostgreSqlDbContextFactory).Assembly.GetName().Name));

            return new NativePaymentMethodsDbContext(builder.Options);
        }
    }
}
