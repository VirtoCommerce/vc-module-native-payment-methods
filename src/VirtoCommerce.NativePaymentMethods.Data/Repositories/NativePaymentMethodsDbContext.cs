using EntityFrameworkCore.Triggers;
using Microsoft.EntityFrameworkCore;

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
            //        modelBuilder.Entity<NativePaymentMethodsEntity>().ToTable("MyModule").HasKey(x => x.Id);
            //        modelBuilder.Entity<NativePaymentMethodsEntity>().Property(x => x.Id).HasMaxLength(128);
            //        base.OnModelCreating(modelBuilder);
        }
    }
}

