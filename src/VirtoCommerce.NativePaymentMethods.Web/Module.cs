using System;
using System.Linq;
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
using VirtoCommerce.Platform.Core.Bus;
using VirtoCommerce.Platform.Core.GenericCrud;
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
            serviceCollection.AddDbContext<NativePaymentMethodsDbContext>((provider, options) =>
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
            serviceCollection.AddTransient<ICrudService<NativePaymentMethod>, NativePaymentMethodsService>();
            serviceCollection.AddTransient<ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod>, NativePaymentMethodsSearchService>();
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
            var permissionsProvider = appBuilder.ApplicationServices.GetRequiredService<IPermissionsRegistrar>();
            permissionsProvider.RegisterPermissions(ModuleConstants.Security.Permissions.AllPermissions.Select(x =>
                new Permission()
                {
                    GroupName = "NativePaymentMethods",
                    ModuleId = ModuleInfo.Id,
                    Name = x
                }).ToArray());

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
            var searchService = appBuilder.ApplicationServices.GetRequiredService<ISearchService<NativePaymentMethodsSearchCriteria, NativePaymentMethodsSearchResult, NativePaymentMethod>>();
            var searchCriteria = new NativePaymentMethodsSearchCriteria() { IsEnabled = true };
            var activePaymentMethods = searchService.SearchAsync(searchCriteria).GetAwaiter().GetResult();
            dynamicPaymentTypeService.InitDynamicPaymentMethods(activePaymentMethods.Results);

            // subscribe to payment module "refresh payment methods" event
            var inProcessBus = appBuilder.ApplicationServices.GetService<IHandlerRegistrar>();
            inProcessBus.RegisterHandler<PaymentMethodInstancingEvent>(async (message, token) => await appBuilder.ApplicationServices.GetService<PaymentMethodInstancingEventHandler>().Handle(message));
        }

        public void Uninstall()
        {
            // do nothing in here
        }
    }
}
