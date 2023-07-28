using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Moq;
using VirtoCommerce.NativePaymentMethods.Core.Models;
using VirtoCommerce.NativePaymentMethods.Data.Services;
using VirtoCommerce.PaymentModule.Core.Model;
using VirtoCommerce.PaymentModule.Core.Model.Search;
using VirtoCommerce.PaymentModule.Core.Services;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Settings;
using Xunit;

namespace VirtoCommerce.NativePaymentMethods.Tests
{
    public class DynamicPaymentTypeServiceTests
    {
        private readonly Fixture _fixture = new Fixture();

        private Mock<ISettingsRegistrar> _settingsMock;
        private Mock<IPaymentMethodsSearchService> _searchServiceMock;
        private Mock<IPaymentMethodsService> _paymentServiceMock;

        public DynamicPaymentTypeServiceTests()
        {
            _settingsMock = new Mock<ISettingsRegistrar>();
            _searchServiceMock = new Mock<IPaymentMethodsSearchService>();
            _paymentServiceMock = new Mock<IPaymentMethodsService>();
        }

        [Fact]
        public async Task DeleteDynamicPaymentMethodsAsync_MethodRegistered_MethodDeleted()
        {
            // Arrange
            var target = GerService();

            var nativePaymentMethod = _fixture.Create<NativePaymentMethod>();
            var nativePaymentMethods = new List<NativePaymentMethod> { nativePaymentMethod };

            // Act
            await target.RegisterDynamicPaymentMethodsAsync(nativePaymentMethods);
            await target.DeleteDynamicPaymentMethodsAsync(nativePaymentMethods);

            // Assert
            var typeInfo = GetPaymentMethodType(nativePaymentMethod);
            typeInfo.Should().BeNull();
        }

        [Fact]
        public async void RegisterDynamicPaymentMethodsAsync_MethodNotRegistered_MethodRegistered()
        {
            // Arrange
            var target = GerService();

            var nativePaymentMethod = _fixture.Create<NativePaymentMethod>();
            var nativePaymentMethods = new List<NativePaymentMethod> { nativePaymentMethod };

            // Act
            await target.RegisterDynamicPaymentMethodsAsync(nativePaymentMethods);

            // Assert
            var typeInfo = GetPaymentMethodType(nativePaymentMethod);
            var paymentMethod = AbstractTypeFactory<PaymentMethod>.TryCreateInstance(typeInfo.TypeName) as NativePaymentMethod;

            paymentMethod.Code.Should().Equals(nativePaymentMethod.Code);
            paymentMethod.Name.Should().Equals(nativePaymentMethod.Name);
            paymentMethod.LogoUrl.Should().Equals(nativePaymentMethod.LogoUrl);
            paymentMethod.Description.Should().Equals(nativePaymentMethod.Description);
        }

        private DynamicPaymentTypeService GerService()
        {
            _searchServiceMock.Setup(x => x.SearchAsync(It.IsAny<PaymentMethodsSearchCriteria>(), true)).ReturnsAsync(new PaymentMethodsSearchResult());

            var target = new DynamicPaymentTypeService(
                _settingsMock.Object,
                _searchServiceMock.Object,
                _paymentServiceMock.Object);

            return target;
        }

        private static TypeInfo<PaymentMethod> GetPaymentMethodType(NativePaymentMethod nativePaymentMethod)
        {
            return AbstractTypeFactory<PaymentMethod>
                .AllTypeInfos
                .OfType<TypeInfo<PaymentMethod>>()
                .FirstOrDefault(x => x.TypeName.Contains(nativePaymentMethod.Code));
        }
    }
}
