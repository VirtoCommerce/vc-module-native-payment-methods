using System;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.NativePaymentMethods.Core;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Core.Models.Search;
using VirtoCommerce.NativePaymentMethods.Core.Services;
using VirtoCommerce.NativePaymentMethods.Data.Handlers;
using VirtoCommerce.NativePaymentMethods.Data.MySql;
using VirtoCommerce.NativePaymentMethods.Data.PostgreSql;
using VirtoCommerce.NativePaymentMethods.Data.Repositories;
using VirtoCommerce.NativePaymentMethods.Data.Services;
using VirtoCommerce.NativePaymentMethods.Data.SqlServer;
using VirtoCommerce.NativePaymentMethods.Data.Validation;
using VirtoCommerce.PaymentModule.Core.Events;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.NativePaymentMethods.Web
{
    public class Module : IModule, IHasConfiguration
    {
        public ManifestModuleInfo ModuleInfo { get; set; }
        public IConfiguration Configuration { get; set; }

        public void Initialize(IServiceCollection serviceCollection)
        {
            serviceCollection.AddDbContext<NativePaymentMethodsDbContext>(options =>
            {
                var databaseProvider = Configuration.GetValue("DatabaseProvider", "SqlServer");
                var connectionString = Configuration.GetConnectionString(ModuleInfo.Id) ?? Configuration.GetConnectionString("VirtoCommerce");

                switch (databaseProvider)
                {
                    case "MySql":
                        options.UseMySqlDatabase(connectionString);
                        break;
                    case "PostgreSql":
                        options.UsePostgreSqlDatabase(connectionString);
                        break;
                    default:
                        options.UseSqlServerDatabase(connectionString);
                        break;
                }
            });

            serviceCollection.AddTransient<INativePaymentMethodsRepository, NativePaymentMethodsRepository>();
            serviceCollection.AddTransient<Func<INativePaymentMethodsRepository>>(provider => () => provider.CreateScope().ServiceProvider.GetRequiredService<INativePaymentMethodsRepository>());
            serviceCollection.AddTransient<INativePaymentMethodService, NativePaymentMethodService>();
            serviceCollection.AddTransient<INativePaymentMethodSearchService, NativePaymentMethodSearchService>();
            serviceCollection.AddTransient<IDynamicPaymentTypeService, DynamicPaymentTypeService>();
            serviceCollection.AddTransient<PaymentMethodInstancingEventHandler>();
            serviceCollection.AddTransient<AbstractValidator<NativePaymentMethod>, NativePaymentMethodValidator>();
        }

        public void PostInitialize(IApplicationBuilder appBuilder)
        {
            // register settings
            var settingsRegistrar = appBuilder.ApplicationServices.GetRequiredService<ISettingsRegistrar>();
            settingsRegistrar.RegisterSettings(ModuleConstants.Settings.AllSettings, ModuleInfo.Id);

            // register permissions
            var permissionsRegistrar = appBuilder.ApplicationServices.GetRequiredService<IPermissionsRegistrar>();
            permissionsRegistrar.RegisterPermissions(ModuleInfo.Id, "NativePaymentMethods", ModuleConstants.Security.Permissions.AllPermissions);

            // Ensure that any pending migrations are applied
            using (var serviceScope = appBuilder.ApplicationServices.CreateScope())
            {
                using (var dbContext = serviceScope.ServiceProvider.GetRequiredService<NativePaymentMethodsDbContext>())
                {
                    dbContext.Database.Migrate();
                }
            }

            // register in memory payment methods
            var dynamicPaymentTypeService = appBuilder.ApplicationServices.GetRequiredService<IDynamicPaymentTypeService>();
            var searchService = appBuilder.ApplicationServices.GetRequiredService<INativePaymentMethodSearchService>();
            var searchCriteria = new NativePaymentMethodsSearchCriteria { IsEnabled = true };
            var activePaymentMethods = searchService.SearchAsync(searchCriteria).GetAwaiter().GetResult();
            dynamicPaymentTypeService.InitDynamicPaymentMethods(activePaymentMethods.Results);

            // subscribe to payment module "refresh payment methods" event
            appBuilder.RegisterEventHandler<PaymentMethodInstancingEvent, PaymentMethodInstancingEventHandler>();
        }

        public void Uninstall()
        {
            // do nothing in here
        }
    }
}
