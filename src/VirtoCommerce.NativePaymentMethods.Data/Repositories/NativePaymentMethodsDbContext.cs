using System.Reflection;
using EntityFrameworkCore.Triggers;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.NativePaymentMethods.Data.Models;

namespace VirtoCommerce.NativePaymentMethods.Data.Repositories
{
    public class NativePaymentMethodsDbContext : DbContextWithTriggers
    {
        public NativePaymentMethodsDbContext(DbContextOptions<NativePaymentMethodsDbContext> options)
          : base(options)
        {
        }

        protected NativePaymentMethodsDbContext(DbContextOptions options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NativePaymentMethodEntity>().ToTable("NativePaymentMethods").HasKey(x => x.Id);
            modelBuilder.Entity<NativePaymentMethodEntity>().Property(x => x.Id).HasMaxLength(128).ValueGeneratedOnAdd();

            base.OnModelCreating(modelBuilder);


            // Allows configuration for an entity type for different database types.
            // Applies configuration from all <see cref="IEntityTypeConfiguration{TEntity}" in VirtoCommerce.NativePaymentMethods.Data.XXX project. /> 
            switch (this.Database.ProviderName)
            {
                case "Pomelo.EntityFrameworkCore.MySql":
                    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.Load("VirtoCommerce.NativePaymentMethods.Data.MySql"));
                    break;
                case "Npgsql.EntityFrameworkCore.PostgreSQL":
                    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.Load("VirtoCommerce.NativePaymentMethods.Data.PostgreSql"));
                    break;
                case "Microsoft.EntityFrameworkCore.SqlServer":
                    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.Load("VirtoCommerce.NativePaymentMethods.Data.SqlServer"));
                    break;
            }
        }
    }
}

