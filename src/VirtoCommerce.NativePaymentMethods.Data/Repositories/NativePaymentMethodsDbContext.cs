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
        }
    }
}

